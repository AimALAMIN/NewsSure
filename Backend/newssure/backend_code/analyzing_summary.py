from .model_loader import get_classifier_model
import numpy as np

# ------------------------------------------------------------
# ⚙️ Setup
classifier = get_classifier_model()

# ------------------------------------------------------------
# 🧩 Helper Functions
# ------------------------------------------------------------


def classify_claim_evidence(claim, evidence):
    """
    Determines whether the article evidence supports, refutes, or is neutral to the claim.
    """
    # Flip order: hypothesis first improves clarity in negation detection
    result = classifier(f"Hypothesis: {claim} Premise: {evidence}", top_k=None)

    if isinstance(result, list):
        result = result[0]
    label = result["label"].lower()
    score = result["score"]

    if label == "entailment":
        meaning = "supports"
    elif label == "contradiction":
        meaning = "refutes"
    else:
        meaning = "neutral"

    return meaning, round(score * 100, 2)

# ------------------------------------------------------------
# 🔍 1. Enhanced Analysis Logic (Fixes "Not in Berlin" bug)
# ------------------------------------------------------------
def analyze_claim_vs_summary(claim, summary):
    text = summary.lower()
    
    # 🔴 AGGRESSIVE REFUTE LIST (Added "not in", "instead of", "incorrect")
    refute_keywords = [
        "fake", "false", "denied", "refuted", "clarified", "no such",
        "fabricated", "not true", "incorrect", "contradict", "disprove",
        "debunk", "denies", "myth", "hoax", "isn't", "is not", "wasn't",
        "not in", "instead of", "misleading", "baseless"
    ]
    
    support_keywords = [
        "confirmed", "agreed", "verified", "approved", "affirmed",
        "announced", "declared", "supports", "proves", "true", "confirmed that"
    ]

    # Rule-Based Check
    rule_relation = None
    if any(k in text for k in refute_keywords):
        rule_relation = "refutes"
    elif any(k in text for k in support_keywords):
        rule_relation = "supports"

    # AI Model Check
    model_relation, conf = classify_claim_evidence(claim, summary)

    # ⚡ VETO POWER: If keywords say "REFUTES", we force it, 
    # because AI often misses small words like "not".
    if rule_relation == "refutes":
        final_relation = "refutes"
        final_conf = max(conf, 90) # Force high confidence
    elif rule_relation == "supports" and model_relation == "supports":
        final_relation = "supports"
        final_conf = max(conf, 85)
    else:
        final_relation = model_relation
        final_conf = conf

    return {
        "relation": final_relation,
        "confidence": final_conf,
        "summary": summary
    }

# ------------------------------------------------------------
# 🧮 Aggregation & Final Verdict
# ------------------------------------------------------------
def aggregate_results(results):
    """
    Aggregate individual claim-summaries into one overall truth verdict.
    Now considers:
      - Relation (supports/refutes/neutral)
      - Model confidence
      - Source credibility
      - Semantic similarity
      - Assigned weight
    """
    if not results:
        return "NEUTRAL", 0.0, 0.0

    mapping = {"supports": 1, "neutral": 0, "refutes": -1}

    weighted_scores = []
    total_weight = 0

    for r in results:
        stance = mapping.get(r["relation"], 0)
        confidence = r.get("confidence", 50) / 100
        credibility = r.get("credibility", 50) / 100
        similarity = r.get("similarity", 0.5)
        user_weight = r.get("weight", 0.5)

        # Weighted composite score
        # Gives higher importance to high-credibility + high-confidence sources
        composite_weight = (0.4 * credibility) + (0.3 * confidence) + (0.2 * similarity) + (0.1 * user_weight)
        total_weight += composite_weight
        weighted_scores.append(stance * composite_weight)

    # Compute normalized weighted average stance
    stance_score = sum(weighted_scores) / total_weight if total_weight else 0

    # Weighted average confidence across all results
    avg_conf = round(np.average([r["confidence"] for r in results],
                                weights=[r.get("credibility", 50) for r in results]), 2)

    # Convert stance score to final verdict
    if stance_score > 0.25:
        final = "SUPPORTS"
    elif stance_score < -0.25:
        final = "REFUTES"
    else:
        final = "NEUTRAL"

    return final, avg_conf, round(stance_score, 2)




# ------------------------------------------------------------
# 🔗 Main Integration – Multi-URL Summary Handling
# ------------------------------------------------------------
           
def verify_claim_from_text(claim_text: str, summarized_output: dict):
    # 🔴 DEBUG PRINT: If you don't see this in terminal, YOU ARE EDITING THE WRONG FILE
    print(f"--- ⚡ RUNNING NEW LOGIC FOR: {claim_text} ---")

    if not summarized_output or not summarized_output.get("summaries"):
        return {"error": "No summaries to analyze."}

    results = []
    
    # Analyze all summaries
    for art in summarized_output["summaries"]:
        summary = art.get("summary", "")
        if not summary.strip(): continue

        analysis = analyze_claim_vs_summary(claim_text, summary)
        analysis.update({
            "url": art.get("url"),
            "credibility": art.get("credibility", 50),
            "similarity": art.get("similarity", 0.0),
            "weight": art.get("weight", 0.5)
        })
        results.append(analysis)

    final_verdict, avg_conf, stance_score = aggregate_results(results)
    avg_conf = float(avg_conf)

    # --- 🧮 TRUTH SCORE CALCULATION ---
    
    # Base Score (Content Quality)
    raw_score = np.mean([
        (0.7 * r["confidence"] + 0.2 * r["credibility"] + 0.1 * (r["similarity"] * 100))
        for r in results
    ]) if results else 0
    raw_score = float(round(min(raw_score, 100), 2))

    # 🚀 LOGIC FOR "FALSE" CLAIMS
    if final_verdict == "REFUTES":
        # If verdict is REFUTES, the Truth Score must be LOW.
        # We invert the confidence: 90% Confident False = 10% Truth Score.
        # We use avg_conf because raw_score might be low due to credibility.
        base_confidence = max(raw_score, avg_conf)
        truth_score = max(0, 100 - base_confidence)
        
    # 🚀 LOGIC FOR "TRUE" CLAIMS
    elif final_verdict == "SUPPORTS":
        # If AI is super sure (>85%), ignore low credibility blogs
        if avg_conf > 85:
            truth_score = max(raw_score, avg_conf)
        else:
            truth_score = raw_score
            
    # NEUTRAL
    else:
        truth_score = 50

    return {
        "claim": claim_text,
        "final_verdict": final_verdict,
        "truthScore": float(round(truth_score, 2)),
        "average_confidence": avg_conf,
        "reliable_sources": results,
        # Pass explanation from the first reliable source
        "explanation": results[0]["summary"] if results else "Analysis complete."
    }  

# ------------------------------------------------------------
# 🧪 Example Test
# ------------------------------------------------------------
if __name__ == "__main__":
    claim_example = "The Eiffel Tower is located in Berlin."
    summaries_example = {
        "summaries": [
            {
                "url": "https://bbc.com/news/abc",
                "summary": "The article clarifies that the Eiffel Tower is in Paris, not Berlin.",
                "credibility": 90,
                "trust_label": "Trusted",
                "weight": 1.0,
                "similarity": 0.85
            },
            {
                "url": "https://randomblog.net/eiffel",
                "summary": "Some sources falsely claimed it was in Berlin, but official reports confirm it is in Paris.",
                "credibility": 60,
                "trust_label": "Mostly Reliable",
                "weight": 0.7,
                "similarity": 0.8
            }
        ]
    }

    result = verify_claim_from_text(claim_example, summaries_example)
    print("\n🧠 Final Claim Analysis:")
    print(result)
