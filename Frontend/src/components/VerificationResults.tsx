import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TruthScoreGauge } from "@/components/TruthScoreGauge";
import { AlertTriangle, CheckCircle, XCircle, Share2, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

interface VerificationResultsProps {
  data: any;
}

export const VerificationResults = ({ data: rawData }: VerificationResultsProps) => {
  const navigate = useNavigate();

  // 1. Safety Check: If no data at all
  if (!rawData) {
    return (
      <Card className="p-8 mt-12 text-center text-muted-foreground animate-in fade-in">
        <p>No verification data available.</p>
      </Card>
    );
  }

  // 2. Semantic Filter Check
  // If we have a 'message' but NO 'verdict' object, it was likely blocked.
  if ((rawData.message || rawData.detail) && !rawData.verdict) {
    const isGreeting = rawData.message?.toLowerCase().includes("greeting");
    const isTooShort = rawData.message?.toLowerCase().includes("short");

    return (
    <Card className="p-8 mt-12 text-center border-blue-200 bg-blue-50 animate-in fade-in">
        <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
                {isGreeting ? <span className="text-2xl">👋</span> : <AlertCircle className="h-8 w-8 text-blue-600" />}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-blue-900">
                    {isGreeting ? "Hello there!" : "Could not verify that text"}
                </h3>
                <p className="text-blue-800 mt-2">
                    {isGreeting 
                        ? "I am NewsSure, your AI Fact Checker. Paste a news headline or rumor above to start!" 
                        : "That text didn't look like a factual claim I can check."}
                </p>
                
                {!isGreeting && (
                    <div className="mt-4 p-4 bg-white/60 rounded-lg text-sm text-left">
                        <p className="font-semibold text-blue-900 mb-2">Try rephrasing like this:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-800">
                            <li>"Is it true that [Event] happened?"</li>
                            <li>"NASA discovers new planet" (Statement)</li>
                            <li>"[Politician] signed a new law"</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    </Card>
    );
  }

  // --- 🔴 THE FIX: CORRECT MAPPING FOR NESTED DATA ---
  // Your data is inside rawData.verdict.*
  
  const verdictObj = rawData.verdict || {};
  
  const data = {
    // Sources are inside the verdict object as 'reliable_sources'
    sources: verdictObj.reliable_sources || rawData.sources || [],
    
    // Score is inside the verdict object
    truthScore: verdictObj.truthScore ?? rawData.truthScore ?? 0,
    
    // Verdict string is inside verdict.final_verdict
    verdict: String(verdictObj.final_verdict || rawData.verdict || 'mixed'),
    
    claim: rawData.claim_analyzed || rawData.claim || "Analyzed Content",
    
    // Use the first source's summary as explanation if no main explanation exists
    explanation: rawData.explanation || 
                 (verdictObj.reliable_sources && verdictObj.reliable_sources[0]?.summary) || 
                 "Analysis complete based on available sources.",
                 
    timestamp: rawData.timestamp || new Date().toISOString(),
    aiGenerated: rawData.image_analysis?.ai_generated || false
  };
  // ----------------------------------------------------

  const getVerdictConfig = (verdictStr: string) => {
    const v = String(verdictStr).toLowerCase();
    
    // 1. Check for True/Supports
    if (v.includes('true') || v.includes('supports') || v.includes('supported') || v.includes('verified')) {
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'success',
          label: 'Verified True',
          bgClass: 'bg-success/10 text-success border-success/20'
        };
    } 
    // 2. Check for False/Refutes (Added 'refutes' and 'not')
    else if (v.includes('false') || v.includes('refuted') || v.includes('refutes') || v.includes('fake') || v.includes('debunk')) {
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: 'destructive',
          label: 'Verified False',
          bgClass: 'bg-destructive/10 text-destructive border-destructive/20'
        };
    } 
    // 3. Default to Mixed
    else {
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          color: 'warning',
          label: 'Mixed / Uncertain',
          bgClass: 'bg-warning/10 text-warning border-warning/20'
        };
    }
  };

  const verdictConfig = getVerdictConfig(data.verdict);

  const handleShare = () => {
    navigate('/share-card', {
      state: {
        score: data.truthScore,
        claim: data.claim,
        // Safely extract names from your source objects
        sources: data.sources.map((s: any) => s.name || s.source || (new URL(s.url)).hostname.replace('www.','') || "Source"),
        explanation: data.explanation,
        verifiedDate: new Date(data.timestamp).toLocaleString('en-IN')
      }
    });
  };

  const handleExpertReview = () => {
    toast.success("Request sent for expert review!");
  };

  return (
    <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {data.aiGenerated && (
        <Card className="p-4 bg-warning/10 border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h4 className="font-semibold text-warning">AI-Generated Content Detected</h4>
              <p className="text-sm text-warning/80 mt-1">
                This image appears to be AI-generated. Results may require additional scrutiny.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-8 shadow-lg-custom">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <Badge className={`${verdictConfig.bgClass} border mb-4`}>
              <span className="flex items-center gap-2">
                {verdictConfig.icon}
                {verdictConfig.label}
              </span>
            </Badge>
            <h3 className="text-lg font-medium text-foreground mb-2">Claim Analysis</h3>
            <p className="text-muted-foreground">{data.claim}</p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Truth Score</h4>
            <TruthScoreGauge score={data.truthScore} />
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Source Credibility</h4>
            <div className="space-y-3">
              {data.sources.length > 0 ? (
                data.sources.map((source: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                       {/* Try to show domain name if 'name' is missing */}
                      <span className="font-medium text-sm truncate max-w-[150px]">
                        {source.name || (source.url ? new URL(source.url).hostname.replace('www.','') : `Source ${index + 1}`)}
                      </span>
                      {source.url && (
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {Math.round(source.credibility || source.confidence || 0)}%
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 bg-muted/50 rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">
                        No specific web sources found.
                    </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="explanation">
            <AccordionTrigger className="text-lg font-semibold">
              Detailed Explanation
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {data.explanation}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-wrap gap-3 mt-6">
          <Button onClick={handleShare} variant="default" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Verification Card
          </Button>
          <Button onClick={handleExpertReview} variant="outline" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Request Expert Review
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Verified on {new Date(data.timestamp).toLocaleString()}
        </p>
      </Card>
    </div>
  );
};