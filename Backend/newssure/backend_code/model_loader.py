import os
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from transformers import pipeline
from paddleocr import PaddleOCR
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# 1. SETUP ENVIRONMENT
# ---------------------------------------------------------------------------
# This points to the .env file.
# logic: current_file (backend_code) -> parent (newssure) -> .env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(env_path)

# ---------------------------------------------------------------------------
# 2. GLOBAL VARIABLES (SINGLETONS)
# We store the loaded models here so we don't reload them on every request.
# ---------------------------------------------------------------------------
_gemini_configured = False
_embedding_model = None
_summarizer_pipeline = None
_ocr_model = None
_classifier_model = None

# ---------------------------------------------------------------------------
# 3. MODEL LOADERS
# ---------------------------------------------------------------------------

def get_gemini_model():
    """Returns the text-only model for summarization."""
    global _gemini_configured
    api_key = os.getenv("GOOGLE_API_KEY")
    if not _gemini_configured and api_key:
        genai.configure(api_key=api_key)
        _gemini_configured = True
    # 'gemini-pro' is best for pure text tasks
    return genai.GenerativeModel('gemini-pro')

# 2. VISION MODEL (For Image Verification) - ADD THIS NEW FUNCTION
def get_gemini_vision_model():
    """Returns the multimodal model for analyzing images."""
    global _gemini_configured
    api_key = os.getenv("GOOGLE_API_KEY")
    if not _gemini_configured and api_key:
        genai.configure(api_key=api_key)
        _gemini_configured = True
    # 'gemini-1.5-flash' handles images perfectly
    return genai.GenerativeModel('gemini-1.5-flash')


def get_embedding_model():
    """
    Loads SentenceTransformer model.
    Used for: Converting news text into numbers for similarity checks.
    """
    global _embedding_model
    if _embedding_model is None:
        print("[INFO] 🧠 Loading Embedding Model (all-MiniLM-L6-v2)...")
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedding_model


def get_summarizer_model():
    """
    Loads HuggingFace Summarization Pipeline.
    Used for: Condensing long news articles into short summaries.
    """
    global _summarizer_pipeline
    if _summarizer_pipeline is None:
        print("[INFO] 📝 Loading Summarizer (distilbart-cnn-12-6)...")
        # distilbart is faster and lighter than the full BART model
        _summarizer_pipeline = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    return _summarizer_pipeline


def get_ocr_model():
    """Loads PaddleOCR."""
    global _ocr_model
    if _ocr_model is None:
        print("[INFO] 👁️ Initializing PaddleOCR...")
        # FIX 2: Removed 'show_log=False' (It caused the crash)
        _ocr_model = PaddleOCR(use_angle_cls=True, lang='en')
    return _ocr_model


def get_classifier_model():
    """
    Loads NLI (Natural Language Inference) Model.
    Used for: The 'Judge' (Verdict) - determines if Evidence supports Claim.
    """
    global _classifier_model
    if _classifier_model is None:
        print("[INFO] ⚖️ Loading Verdict Classifier (roberta-large-mnli)...")
        # RoBERTa-large-mnli is excellent for entailment/contradiction tasks
        _classifier_model = pipeline("text-classification", model="roberta-large-mnli")
    return _classifier_model