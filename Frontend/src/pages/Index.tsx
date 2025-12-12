import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { VerificationInput } from "@/components/VerificationInput";
import { VerificationResults } from "@/components/VerificationResults";
import { VerificationHistory } from "@/components/VerificationHistory";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// import BookExpertCall from "@/components/BookExpertCall";

const Index = () => {
  const [verificationData, setVerificationData] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

const DJANGO_API_URL = "http://127.0.0.1:8000/api/verify/"; // ✅ Backend endpoint

const handleVerify = async (file: File | string, inputType: 'text' | 'image') => {
  setIsVerifying(true);

  try {
    let response;

    // 🖼️ If the input is an image file
    if (inputType === 'image' && file instanceof File) {
      const formData = new FormData();
      formData.append('inputType', 'image');
      formData.append('file', file); // ✅ Attach actual File

      response = await fetch(DJANGO_API_URL, {
        method: "POST",
        body: formData,
      });
    } 
    // 📝 If the input is plain text
    else {
      response = await fetch(DJANGO_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: file, inputType }),
      });
    }

    // ❌ Handle network errors
    if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);

    // ✅ Parse backend response
    const data = await response.json();

    // 🧠 Update frontend state with API response
    setVerificationData({
      claim: inputType === 'image' && file instanceof File ? file.name : file,
      ...data, // data should include truthScore, verdict, sources, explanation, etc.
    });

  if (user) {
    try {
      // Prepare insert data explicitly
      const historyEntry = {
        user_id: user.id,
        claim: inputType === 'image' && file instanceof File ? file.name : (file as string),
        truth_score: data.truthScore,
        verdict: data.verdict,
        sources: JSON.stringify(data.sources || []), // ✅ store as JSON string
        explanation: data.explanation || '',
      };

      const { error } = await supabase
        .from('verification_history')
        .insert([historyEntry]); // ✅ insert expects an array

      if (error) throw error;
      setRefreshHistory(prev => prev + 1);
    } catch (error) {
      console.error('Error saving to history:', error);
      toast.error("Failed to save verification to history");
    }
  }
  } catch (error) {
    console.error("Verification error:", error);
    toast.error("Verification failed. Please try again.");
  } finally {
    setIsVerifying(false);
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <section className="container mx-auto px-4 py-16 space-y-8">
          <div id="verify" className="scroll-mt-20">
            <VerificationInput onVerify={handleVerify} isVerifying={isVerifying} />
          </div>
          {verificationData && (
            <VerificationResults data={verificationData} />
          )}
          {user && (
            <div id="history" className="scroll-mt-20">
              <div key={refreshHistory}>
                <VerificationHistory />
              </div>
            </div>

          )}

          {/* 👇 Add Coming Soon: Book Expert Call section */}
          <div className="pt-20 border-t border-border mt-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
              Coming Soon: Book an Expert Call 📞
            </h2>
            {/* <BookExpertCall /> */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
