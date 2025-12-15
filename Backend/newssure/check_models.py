import google.generativeai as genai
import os

# Make sure your API key is set
os.environ["GOOGLE_API_KEY"] = "AIzaSyAk8p16MsVnUkH_rV3NIi2TwdcjLcPn-pg"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

print("--- Available Gemini Models ---")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"Name: {m.name}")