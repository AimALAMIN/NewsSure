import nltk
from nltk.tokenize import sent_tokenize
import time  # <--- Essential for Rate Limiting
from .model_loader import get_summarizer_model, get_gemini_model
import google.generativeai as genai
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from deep_translator import GoogleTranslator
from langdetect import detect

# --- 🟢 FIX: Ensure NLTK resources are present ---
def download_nltk_resources():
    resources = ['punkt', 'punkt_tab']
    for resource in resources:
        try:
            nltk.data.find(f'tokenizers/{resource}')
        except LookupError:
            print(f"Downloading missing NLTK resource: {resource}")
            nltk.download(resource)

download_nltk_resources()
# -------------------------------------------------

local_summarizer = get_summarizer_model()
gemini_model = get_gemini_model()

# List of domains we trust more than random blogs
# These get priority in the "Smart Sort"
TRUSTED_DOMAINS = [
    "wikipedia.org", "bbc.com", "reuters.com", "apnews.com", 
    "gov", "edu", "cnn.com", "nytimes.com", "toureiffel.paris",
    "official", "nasa.gov", "who.int", "un.org", "europa.eu"
]

def ensure_english(text):
    try:
        lang = detect(text)
        if lang != "en":
            text = GoogleTranslator(source="auto", target="en").translate(text)
        return text
    except Exception:
        return text

def filter_relevant_sentences(claim, text, top_k=5):
    if not text.strip():
        return ""
    claim_keywords = [w.lower() for w in claim.split() if len(w) > 3]
    
    sentences = sent_tokenize(text) 
    
    relevant = [s for s in sentences if any(k in s.lower() for k in claim_keywords)]
    if len(relevant) < top_k:
        relevant = sentences[:top_k]
    return " ".join(relevant)

def summarize_local(text):
    try:
        if len(text.split()) > 900:
            text = " ".join(text.split()[:900])
        return local_summarizer(text, max_length=200, min_length=50, do_sample=False)[0]["summary_text"].strip()
    except Exception:
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        s = LexRankSummarizer()
        return " ".join(str(x) for x in s(parser.document, 3))

def summarize_with_gemini(claim: str, text: str) -> str:
    """
    Uses Gemini to create a claim-focused summary.
    """
    try:
        if not text.strip():
            return ""

        # Limit text length for efficiency (~1000–1200 words)
        text = " ".join(text.split())[:7000]

        prompt = f"""
        You are an expert fact-checking assistant.

        Claim: "{claim}"

        Your task:
        1. Summarize the article **only in relation to this claim** — focus on parts that directly agree, deny, refute, or contradict the claim.
        2. Even if the article is short or vague, you must still determine whether the article overall:
           - Supports the claim
           - Refutes (contradicts/disputes) the claim
           - Or is Neutral / Unclear
        3. At the end, clearly include one sentence like:
           "Overall, the article supports the claim."
           OR
           "Overall, the article refutes the claim."
           OR
           "Overall, the article is neutral toward the claim."
        4. Write the summary in 3-6 concise sentences, keeping key facts, entities, and stance indicators.

        Article:
        {text}
        """

        response = gemini_model.generate_content(prompt)
        if not response or not getattr(response, "text", "").strip():
            raise ValueError("Empty Gemini response")

        return response.text.strip()

    except Exception as e:
        print(f"⚠️ Gemini summarization failed: {e}")
        # Only fallback if it's NOT a quota error. If it is quota, we want to know.
        if "429" in str(e):
             print("❌ Quota Exceeded. Please check API limits.")
             return "Error: API Quota Exceeded."
        return summarize_local(text)

def summarize_article(claim, text):
    text = ensure_english(text)
    relevant_text = filter_relevant_sentences(claim, text, top_k=5)
    
    # Check if relevant_text is empty or just whitespace
    if not relevant_text or not relevant_text.strip():
        print("⚠️ Semantic filter removed all text. Using raw text fallback.")
        relevant_text = text[:2000]  # Fallback to first 2000 chars

    summary = summarize_with_gemini(claim, relevant_text)
    return summary

def summarize_all_articles(claim, extracted_data):
    summarized_articles = []
    articles = extracted_data.get("articles", [])

    print(f"📉 Found {len(articles)} total articles. Filtering for quality...")

    # --- 🧠 SMART SORT: Push Trusted Sites to the Top ---
    # This prioritizes Wikipedia, BBC, etc. so we use our quota on good sources first.
    articles.sort(key=lambda x: any(d in x.get("url", "").lower() for d in TRUSTED_DOMAINS), reverse=True)

    # --- ⚡ RATE LIMIT PROTECTION: Only take Top 4 ---
    # Gemini 2.0 Flash allows 15 requests/min.
    # Processing 4 articles with a delay ensures we never crash.
    top_articles = articles[:4]

    for art in top_articles:
        url = art.get("url")
        title = art.get("title", "Untitled")
        text = art.get("text", "")
        credibility = art.get("credibility", 50)
        trust_label = art.get("trust_label", "Unknown")
        weight = art.get("weight", 0.5)
        similarity = art.get("similarity", 0.0)

        if not text.strip():
            print(f"⚠️ Skipping empty article: {url}")
            continue

        try:
            print(f"🔍 Analyzing: {url}")
            summary_text = summarize_article(claim, text)

            summarized_articles.append({
                "url": url,
                "title": title,
                "summary": summary_text,
                "length": len(text),
                "credibility": credibility,
                "trust_label": trust_label,
                "weight": weight,
                "similarity": similarity
            })

            # 🛑 CRITICAL PAUSE
            # We wait 4 seconds between requests to stay safe (15 RPM limit).
            print("Waiting 4 seconds to respect API rate limits...")
            time.sleep(4)

        except Exception as e:
            print(f"Skipping article {url} due to error: {e}")
            continue

    print(f"[INFO] ✅ Generated {len(summarized_articles)} summaries.")

    return {
        "stage": "summarization",
        "total_summaries": len(summarized_articles),
        "summaries": summarized_articles
    }

if __name__ == "__main__":
    # Test Block
    claim_example = "The Eiffel Tower is located in Berlin."
    extracted_example = {
        "articles": [
            {
                "url": "http://example.com/article1",
                "title": "Facts about the Eiffel Tower",
                "text": "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.",
                "method": "scraping"
            }
        ]
    }
    summary_results = summarize_all_articles(claim_example, extracted_example)
    for summary in summary_results["summaries"]:
        print(f"URL: {summary['url']}\nSummary: {summary['summary']}\n")