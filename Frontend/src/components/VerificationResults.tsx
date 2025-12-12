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
  data: {
    claim: string;
    truthScore: number;
    verdict: 'true' | 'false' | 'mixed';
    sources: Array<{ name: string; credibility: number; url: string }>;
    explanation: string;
    aiGenerated?: boolean;
    timestamp: string;
  };
}

export const VerificationResults = ({ data }: VerificationResultsProps) => {
  const navigate = useNavigate();
  const getVerdictConfig = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: 'success',
          label: 'Verified True',
          bgClass: 'bg-success/10 text-success border-success/20'
        };
      case 'false':
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: 'destructive',
          label: 'Verified False',
          bgClass: 'bg-destructive/10 text-destructive border-destructive/20'
        };
      default:
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
        sources: data.sources.map(s => s.name),
        explanation: data.explanation,
        verifiedDate: new Date(data.timestamp).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Kolkata'
        })
      }
    });
  };

  const handleExpertReview = () => {
    toast.success("Request sent for expert review! You'll receive a verified result in your email shortly.");
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
                This image appears to be AI-generated. Verification results may require additional scrutiny.
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
              {data.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{source.name}</span>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {source.credibility}%
                  </Badge>
                </div>
              ))}
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
