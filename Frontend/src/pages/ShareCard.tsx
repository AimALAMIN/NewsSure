// src/pages/ShareCard.tsx
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShareButtons } from '@/components/ShareButtons';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

const ShareCard = () => {
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);

  // --- 🔴 FIX: Robust Data Extraction ---
  const state = location.state || {};
  
  const claim = state.claim || 'No claim text provided';
  const score = state.score !== undefined ? state.score : 0;
  const explanation = state.explanation || 'No explanation available.';
  
  // Handle backend sending sources as objects OR strings
  const rawSources = state.sources || [];
  const sources: string[] = Array.isArray(rawSources) 
    ? rawSources.map((s: any) => {
        if (typeof s === 'string') return s;
        return s.name || s.source || s.domain || "Unknown Source";
      })
    : [];

  const verifiedDate = state.verifiedDate || new Date().toLocaleString();
  // --------------------------------------

  // Determine result text based on score
  const getResultText = (score: number) => {
    if (score >= 75) return 'Verified True';
    if (score >= 50) return 'Mixed / Partial';
    if (score >= 25) return 'Mostly False';
    return 'False / Fake';
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Get icon based on score
  const getScoreIcon = (score: number) => {
     if (score >= 75) return <CheckCircle2 className="w-8 h-8 text-green-500" />;
     if (score >= 50) return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
     return <XCircle className="w-8 h-8 text-red-500" />;
  };

  const resultText = getResultText(score);
  const scoreColor = getScoreColor(score);
  const scoreIcon = getScoreIcon(score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-6">
        
        {/* The Shareable Card */}
        <Card 
          ref={cardRef} 
          className="overflow-hidden shadow-2xl bg-white"
        >
          <CardContent className="p-8 space-y-6">
            
            {/* Header with Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                {/* Use a text fallback if image fails, or keep your img tag */}
                <span className="text-white font-bold text-lg">NS</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">NewsSure</h2>
                <p className="text-xs text-gray-500">Verify News, Trust Facts</p>
              </div>
            </div>

            {/* Claim */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {claim}
              </h3>
            </div>

            {/* Truth Score */}
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">
                  Truth Score: {score}%
                </span>
                {scoreIcon}
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full ${scoreColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className={`text-sm font-bold mt-1 ${scoreColor.replace('bg-', 'text-')}`}>
                Verdict: {resultText}
              </p>
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {explanation}
              </p>
            </div>

            {/* Sources */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sources Analyzed</p>
              <div className="flex items-center gap-2 flex-wrap">
                {sources.length > 0 ? (
                    sources.slice(0, 4).map((sourceName, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          sourceName.toLowerCase().includes('reuters') ? 'bg-red-600' :
                          sourceName.toLowerCase().includes('bbc') ? 'bg-blue-900' :
                          sourceName.toLowerCase().includes('ndtv') ? 'bg-orange-600' :
                          'bg-gray-500'
                        }`}>
                          {sourceName.substring(0, 1)}
                        </div>
                        <span className="font-medium text-xs text-gray-700">{sourceName}</span>
                      </div>
                    ))
                ) : (
                    <span className="text-xs text-gray-400 italic">No specific sources listed</span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-4 border-t pt-2">
                <span>Verified on {verifiedDate}</span>
              </div>
            </div>

            {/* Footer Branding */}
            <div className="pt-4 border-t border-gray-200 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">NewsSure AI</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-600 font-semibold">
                    Truth Score: {score}%
                  </p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Share Buttons */}
        <div className="flex justify-center">
          <ShareButtons
            cardRef={cardRef}
            title="NewsSure Fact Check"
            text={`Fact Check: "${claim}" - ${resultText} (${score}%)`}
            filename={`newssure-factcheck-${Date.now()}.png`}
          />
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold">Ready to share!</p>
                <p>Download the image or share directly to social media.</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ShareCard;