from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
import re

app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 100

pipe = None  # global pipeline placeholder

@app.on_event("startup")
def load_model():
    global pipe
    model_id = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        device_map={"": "cpu"},  # force CPU only
        torch_dtype=torch.float32,
        low_cpu_mem_usage=True
    )
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,        
        do_sample=True,
        temperature=0.7,
        top_p=0.9
    )
def clean_output(text):
    text = re.sub(r"^<SYS>\n?", "", text)
    return text.strip()

@app.post("/generate")
def generate_text(req: PromptRequest):
    # Format prompt for TinyLlama chat model
    formatted_prompt = f"""<s>[INST] <<SYS>>
You are a helpful assistant.
<</SYS>>

{req.prompt}[/INST]"""

    try:
        output = pipe(
            formatted_prompt,
            max_new_tokens=req.max_new_tokens,
            do_sample=True,
            temperature=0.7,
            top_p=0.9
        )[0]['generated_text']

        # Remove the prompt part from output to get only the generated answer
        answer = output[len(formatted_prompt):].strip()
        answer = clean_output(answer)
        return {"response": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
