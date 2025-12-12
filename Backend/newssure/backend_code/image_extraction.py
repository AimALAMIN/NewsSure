import os
from .model_loader import get_ocr_model

# ... (imports stay the same)

# ... (imports stay the same)

def run_ocr(image_path: str) -> str:
    """
    Extract text from an image using the pre-loaded PaddleOCR model.
    """
    
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return ""

    ocr = get_ocr_model()

    print(f"Running OCR on {image_path}...")
    try:
        # FIX: Removed 'cls=False' entirely. 
        # We just pass the path. This is the safest way.
        results = ocr.ocr(image_path) 
        
    except Exception as e:
        print(f"❌ Internal PaddleOCR Error: {e}")
        return ""

    all_text = []

    # SAFETY CHECK: Ensure results exist
    if not results or results[0] is None:
        print("⚠️ No text detected by OCR.")
        return ""

    # Loop through the detected lines
    for line in results[0]:
        try:
            # Expected format: [[box_coords], ('text', confidence)]
            if isinstance(line, list) and len(line) >= 2:
                text_info = line[1]
                if text_info and len(text_info) > 0:
                    text = text_info[0]
                    confidence = text_info[1] if len(text_info) > 1 else 0
                    
                    if confidence > 0.5:
                        all_text.append(text)
        except Exception:
            continue

    extracted_text = " ".join(all_text).strip()
    
    if not extracted_text:
        extracted_text = "No valid text found."

    print(f"🧾 Extracted text: {extracted_text[:100]}...") 
    return extracted_text