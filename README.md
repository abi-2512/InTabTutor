# InTab Tutor for YouTube 

## Project Status as of 07.18.2025

During development, YouTube released a similar Experimental “Ask and Learn” feature that addresses many of the same user needs. (See Learning-Focused Conversational AI Tool: https://support.google.com/youtube/answer/14110396?hl=en#zippy=)

However, this project remains valuable as a customizable, open-source alternative with local LLM inference — useful for niche applications or education platforms beyond YouTube.

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

## Where I Started

* **Initial idea**: Use OpenAI GPT-4 API to build an assistant that takes YouTube transcripts and answers user questions contextually.
* **Early issues**:

  * Transcript extraction was unreliable — many videos lack official transcripts or IP-blocking prevented API calls.
  * API latency and cost were significant blockers for rapid iteration.
  * OpenAI’s model usage requires API keys with restrictions and can get expensive fast (for a student!).
* **Tech Stack**: Python backend with FastAPI, frontend Chrome extension using HTML, CSS, JS.

---

## Pivot: Open-Source Model

To avoid API costs and dependency, the project pivoted to use **TinyLlama**, a lightweight open-source LLM available on Hugging Face. Advantages:

* Runs locally on CPU or modest GPUs.
* No API keys or costs involved.
* Good enough output quality for MVP.
* Completely open and flexible.

---

## Final MVP Architecture

* **Backend**:

  * FastAPI serving /generate endpoint.
  * Loads TinyLlama 1.1B model locally in CPU mode with adjusted prompt formatting.
  * Accepts JSON POST requests with prompt text and max token limits.
  * Returns cleaned-up generated text answers.

* **Testing**:

  * Simple Python script sends prompts and receives AI-generated explanations.
  * Hardcoded prompt tests simulate transcript input.

* **Future work**:

  * Real transcript extraction integration using youtube-transcript-api.
  * Frontend UI improvement as a browser extension or web app for seamless user experience.
  * Model chunking and async handling for scalability.
  

---

## How to Run

1. Clone the repo.
2. Install dependencies:

bash
pip install -r requirements.txt



3. Run the backend:

bash
uvicorn main:app --host 0.0.0.0 --port 8000



4. Test with:

python
import requests

payload = {
  "prompt": "Explain backpropagation in simple terms.",
  "max_new_tokens": 100
}

resp = requests.post("http://localhost:8000/generate", json=payload)
print(resp.json())


or you can also the run the test_llama.py file!
---

## What We Learned

* Open-source LLMs like TinyLlama can power useful MVPs without huge compute or API costs.
* Prompt formatting is crucial — chat models often require special tokens and structures to generate properly.
* Local inference requires adapting to hardware constraints (e.g., no CUDA on CPU-only machines).
* Handling YouTube transcripts is tricky due to availability and IP-blocking; fallback data and chunking help.
* FastAPI + Hugging Face pipelines form a solid backbone for an AI assistant backend.

---

## Next Steps (Beyond MVP)

* Automate transcript retrieval and chunking for better context handling.
* Experiment with larger or quantized models on GPU to improve output quality and speed. (Highly Ambitious)
* Add conversational memory for multi-turn dialogs. (Highly Ambitious)
* Explore frontend frameworks (React/Vue) for a slick user experience.
* Integrating Whisper for audio-to-text.
* Browser-wide learning assistant
* Making it work offline with pre-cached models. 

---

## Final Thoughts

Despite performance, infrastructure, and cost constraints, I'm proud of how far the current prototype has come. It serves as a strong proof of concept: an AI-powered Chrome extension that enhances the learning experience on YouTube by summarizing, simplifying, and contextualizing educational content in real time.

Looking ahead, there's significant potential to expand this idea beyond YouTube into a full-fledged Browser-Based Learning Assistant—one that can help users learn from any source on the internet, including:

    Educational articles

    Scientific research papers

    Technical documentation

    Even offline PDF textbooks

This evolution could empower students and self-learners by turning static content into interactive, AI-powered tutoring experiences. A few compelling use cases:

    Highlight a sentence in an academic paper → get a simplified explanation

    Upload a textbook PDF → ask contextual questions offline

    Read a coding tutorial → ask the assistant to explain the code step-by-step

The long-term vision is to build an AI tutor that lives in your browser and helps you learn wherever you are—with or without an internet connection.