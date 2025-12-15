from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import NewsQuery
import time
import os
import json

# --- IMPORT PIPELINE SCRIPTS ---
try:
    from newssure.backend_code.image_extraction import run_ocr
    from newssure.backend_code.image_verification import check_fake_image
    from newssure.backend_code.serp_searching import finding_related_article
    from newssure.backend_code.finding_credibility import simulate_domain_check
    from newssure.backend_code.embedding_filtering import find_semantic_matches
    from newssure.backend_code.scrapping_content import extract_article
    
    from newssure.backend_code.analyzing_summary import verify_claim_from_text 
except ImportError as e:
    print(f"⚠️ PIPELINE IMPORT ERROR: {e}")

class CheckNewsView(APIView):
    def post(self, request):
        start_time = time.time()
        data = request.data
        
        user_text = data.get('text', '')
        user_url = data.get('url', '')
        user_image = request.FILES.get('image')

        # --- STEP 0: IMAGE PROCESSING ---
        extracted_text = ""
        image_analysis = None
        temp_image_path = None

        if user_image:
            try:
                print(f"--- [0] Processing Image: {user_image.name} ---")
                path = default_storage.save(f"temp/{user_image.name}", ContentFile(user_image.read()))
                temp_image_path = os.path.join(default_storage.location, path)
                
                extracted_text = run_ocr(temp_image_path)
                image_analysis = check_fake_image(temp_image_path)
            except Exception as e:
                print(f"❌ IMAGE ERROR: {e}")

        # --- DETERMINE CLAIM ---
        final_claim = ""

        # 1. Try User Text First (Manual Input)
        if user_text:
            final_claim = user_text
        
        # 2. If no user text, try OCR Text
        elif extracted_text and "No valid text found" not in extracted_text:
            final_claim = extracted_text

        # 3. If neither, try URL
        elif user_url:
            final_claim = user_url

        # 4. If STILL nothing, stop here.
        if not final_claim:
             return Response({
                 "error": "Could not find any text. Please type the claim manually or upload a clearer image.",
                 "ocr_debug": extracted_text 
             }, status=400)
        

        # Save to DB
        query_obj = NewsQuery.objects.create(url=user_url, text_content=final_claim[:500])

        try:
            # --- STEP 1: SEARCH ---
            print(f"--- [1] Searching: {final_claim[:30]}... ---")
            serp_results = finding_related_article(final_claim)
            
            if serp_results['status'] != 'success':
                 return Response({"status": "no_results", "message": "No news found."}, status=200)

            # --- STEP 2: CREDIBILITY ---
            print("--- [2] Credibility Check ---")
            credibility_output = simulate_domain_check(serp_results['articles'])
            credible_articles = credibility_output['filtered_articles']
            if not credible_articles: credible_articles = serp_results['articles'][:5]

            # --- STEP 3: SEMANTIC FILTER ---
            print("--- [3] Semantic Filter ---")
            relevant_articles = find_semantic_matches(final_claim, credible_articles, top_k=3)
            if not relevant_articles:
                 return Response({"status": "irrelevant", "message": "No relevant articles."}, status=200)

            # --- STEP 4: SCRAPING ---
            print("--- [4] Scraping ---")
            scraped_data = extract_article(final_claim, relevant_articles)

            # --- STEP 5: SUMMARIZING ---
            print("--- [5] Summarizing ---")
            from newssure.backend_code.summarizing_content import summarize_all_articles
            summary_analysis = summarize_all_articles(final_claim, scraped_data)

            # --- STEP 6: FINAL VERDICT (The Logic You Just Added) ---
            print("--- [6] Generating Verdict ---")
            final_verdict_data = verify_claim_from_text(final_claim, summary_analysis)

            # Cleanup
            if temp_image_path and os.path.exists(temp_image_path):
                os.remove(temp_image_path)

            total_time = round(time.time() - start_time, 2)
            print(f"--- DONE in {total_time}s ---")

            # Update DB with Final Verdict
            query_obj.verdict = final_verdict_data.get("final_verdict", "Unknown")
            query_obj.credibility_score = final_verdict_data.get("truthScore", 0)
            query_obj.summary = f"Verdict: {query_obj.verdict}. Sources: {len(summary_analysis['summaries'])}"
            query_obj.save()

            return Response({
                "status": "success",
                "id": query_obj.id,
                "claim_analyzed": final_claim,
                "verdict": final_verdict_data, # <--- The full detailed result
                "image_analysis": image_analysis,
                "time_taken": total_time,
            }, status=200)

        except Exception as e:
            print(f"❌ PIPELINE ERROR: {e}")
            return Response({"error": str(e)}, status=500)