// src/pages/ShareCard.tsx
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ShareButtons } from '@/components/ShareButtons';
import { CheckCircle2 } from 'lucide-react';

const ShareCard = () => {
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);

  // Get data from navigation state or use defaults
  const {
    score = 82,
    claim = 'NASA confirms alien life on Mars!',
    sources = ['Reuters', 'BBC', 'NDTV'],
    credibility = [95, 92, 88],
    verifiedDate = new Date().toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }),
    explanation = 'Verified by Reuters and NDTV – no credible NASA report found.'
  } = location.state || {};

  // Determine result text based on score
  const getResultText = (score: number) => {
    if (score >= 75) return 'Mostly True';
    if (score >= 50) return 'Partially True';
    if (score >= 25) return 'Mostly False';
    return 'False';
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const resultText = getResultText(score);
  const scoreColor = getScoreColor(score);

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
              <div className="w-12 h-12 bg-gradient-to-br rounded-lg flex items-center justify-center">
                <img src="/favicon.ico" alt="NewsSure Logo" className="w-7 h-7 text-white" />
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
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full ${scoreColor} transition-all duration-500 rounded-full`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {explanation}
              </p>
            </div>

            {/* Sources */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {sources.map((source, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-full px-4 py-2"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      source.toLowerCase().includes('reuters') ? 'bg-red-600' :
                      source.toLowerCase().includes('bbc') ? 'bg-blue-900' :
                      source.toLowerCase().includes('ndtv') ? 'bg-orange-600' :
                      'bg-gray-600'
                    }`}>
                      {source.substring(0, 1)}
                    </div>
                    <span className="font-medium text-gray-700">{source}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Verified {verifiedDate}</span>
              </div>
            </div>

            {/* Footer Branding */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">NewsSure</p>
                    <p className="text-xs text-gray-500">Detect Truth, Defy Lies.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    This claim was fact checked by
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    NewsSure AI - Truth Score: {score}%
                  </p>
                  <p className="text-xs text-gray-500">
                    See full analysis → [link]
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
                <p>Download the image or share directly to WhatsApp, Instagram, or other platforms.</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ShareCard;