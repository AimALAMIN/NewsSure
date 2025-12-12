import PIL.Image
from .model_loader import get_gemini_model
from .model_loader import get_gemini_vision_model

def check_fake_image(image_path: str):
    """
    Uses Gemini Vision to detect if an image is AI-generated or manipulated.
    """
    try:
        model = get_gemini_vision_model()
        img = PIL.Image.open(image_path)

        prompt = """
        Analyze this image for signs of AI generation or manipulation.
        Look for:
        1. Inconsistent lighting or shadows.
        2. Warped hands, fingers, or text.
        3. Unnatural textures or 'glazes'.
        
        Is this image likely Real or Fake/AI-Generated?
        Provide a JSON response:
        {
            "verdict": "Real" or "Fake",
            "confidence": 0-100,
            "reason": "Short explanation why."
        }
        """
        
        response = model.generate_content([prompt, img])
        
        # Simple parsing (Gemini returns text, we assume it follows the structure)
        result_text = response.text.strip()
        
        # Clean up markdown if Gemini adds it
        if "```json" in result_text:
            result_text = result_text.replace("```json", "").replace("```", "")
        
        return result_text

    except Exception as e:
        print(f"Image Verification Failed: {e}")
        return {"verdict": "Error", "reason": str(e)}