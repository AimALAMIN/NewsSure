import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env from the same folder
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("❌ Error: API Key not found. Make sure .env has GOOGLE_API_KEY=...")
else:
    print("✅ API Key found!")
    genai.configure(api_key=api_key)
    
    print("\n--- Available Gemini Models ---")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"Model: {m.name}")
    except Exception as e:
        print(f"Connection Error: {e}")
