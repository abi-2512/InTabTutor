# YouTube AI Tutor

## Project Status

During development, YouTube released a similar “Ask and Learn” feature that addresses many of the same user needs. Given this, I’ve decided to pause active development on the Chrome extension.

However, the backend and AI assistant remain fully functional and serve as a strong foundation for future AI-powered learning tools beyond YouTube. This project reflects my hands-on experience building an end-to-end AI system—from model integration to API design and frontend extension development.

---



## Overview

YouTube AI Tutor is a personal project aimed at creating an AI-powered assistant that helps users learn from YouTube videos without leaving the browser or switching tabs. The goal was to build a system where users can input a YouTube video transcript or text and get clear, simplified explanations or summaries powered by an open-source language model — all served through a simple API backend.

---

## Motivation

As a student consuming a ton of YouTube tutorials and study materials daily, it quickly became frustrating to constantly switch windows to ask AI models for clarifications or concept explanations. While some browsers have ChatGPT plugins, none offered an integrated experience that reads YouTube content and explains it contextually in the same tab.

The project goal was simple but ambitious:

* Extract content (starting with transcripts) from YouTube videos.
* Feed that content to an AI model for real-time explanation or Q\&A.
* Build a lightweight backend serving this functionality with fast turnaround.
* Avoid relying on paid APIs to keep it accessible.

---

## Where We Started

* **Initial idea**: Use OpenAI GPT-4 API to build an assistant that takes YouTube transcripts and answers user questions contextually.
* **Early issues**:

  * Transcript extraction was unreliable — many videos lack official transcripts or IP-blocking prevented API calls.
  * API latency and cost were significant blockers for rapid iteration.
  * OpenAI’s model usage requires API keys with restrictions and can get expensive fast.
* **Tech Stack**: Python backend with FastAPI, frontend Chrome extension planned for integration.

---

## Pivot: Open-Source Model

To avoid API costs and dependency, the project pivoted to use **TinyLlama**, a lightweight open-source LLM available on Hugging Face. Advantages:

* Runs locally on CPU or modest GPUs.
* No API keys or costs involved.
* Good enough output quality for MVP.
* Completely open and flexible.

---

## Key Challenges and Solutions

| Challenge                                          | Solution/Workaround                                                                                                    |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **BitsAndBytes CUDA error on CPU-only machines**   | Disabled 4-bit quantization and forced CPU mode for model loading.                                                     |
| **Model echoing input prompt without answer**      | Learned TinyLlama requires manual prompt formatting with special tokens to trigger generation.                         |
| **No Hugging Face 'chat-completion' pipeline**     | Used `text-generation` pipeline with careful prompt template using `[INST]`, `<<SYS>>` tags to simulate chat behavior. |
| **FastAPI endpoint errors due to request parsing** | Added Pydantic models to parse JSON body correctly, avoiding query param issues.                                       |
| **Transcript retrieval blocked by YouTube**        | Added fallback hardcoded transcript tests and planned chunking for long transcripts.                                   |

---

## Final MVP Architecture

* **Backend**:

  * FastAPI serving `/generate` endpoint.
  * Loads TinyLlama 1.1B model locally in CPU mode with adjusted prompt formatting.
  * Accepts JSON POST requests with prompt text and max token limits.
  * Returns cleaned-up generated text answers.

* **Testing**:

  * Simple Python script sends prompts and receives AI-generated explanations.
  * Hardcoded prompt tests simulate transcript input.

* **Future work**:

  * Real transcript extraction integration using `youtube-transcript-api`.
  * Frontend integration as a browser extension or web app for seamless user experience.
  * Model chunking and async handling for scalability.

---

## How to Run

1. Clone the repo.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the backend:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

4. Test with:

```python
import requests

payload = {
  "prompt": "Explain backpropagation in simple terms.",
  "max_new_tokens": 100
}

resp = requests.post("http://localhost:8000/generate", json=payload)
print(resp.json())
```

---

## What We Learned

* Open-source LLMs like TinyLlama can power useful MVPs without huge compute or API costs.
* Prompt formatting is crucial — chat models often require special tokens and structures to generate properly.
* Local inference requires adapting to hardware constraints (e.g., no CUDA on CPU-only machines).
* Handling YouTube transcripts is tricky due to availability and IP-blocking; fallback data and chunking help.
* FastAPI + Hugging Face pipelines form a solid backbone for an AI assistant backend.

---

## Next Steps (Beyond MVP)

* Build a Chrome/Firefox extension that injects the assistant UI into YouTube watch pages.
* Automate transcript retrieval and chunking for better context handling.
* Experiment with larger or quantized models on GPU to improve output quality and speed.
* Add conversational memory for multi-turn dialogs.
* Explore frontend frameworks (React/Vue) for a slick user experience.

---

## Final Thoughts

This project captures my ability to rapidly prototype cutting-edge AI solutions with real user value despite infrastructure constraints. It demonstrates:

* Problem-solving with open-source AI tech
* Adapting to real-world data limitations
* Building clean, maintainable backend APIs
* Iterating towards a usable MVP under uncertainty

---
