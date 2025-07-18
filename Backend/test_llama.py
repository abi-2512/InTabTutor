import requests

response = requests.post(
    "http://localhost:8000/generate",
    json={
        "prompt": "Explain backpropagation in simple terms.",
        "max_new_tokens": 100
    }
)

print(response.json())