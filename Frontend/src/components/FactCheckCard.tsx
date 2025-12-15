import { Shield, CheckCircle2, ExternalLink, MessageCircle, Instagram, Facebook, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import newssureLogo from "@/assets/newssure_logo.jpg";

interface VerificationSource {
  name: string;
  initial: string;
  bgColor: string;
}

const FactCheckCard = () => {
  const truthScore = 82;
  
  const verification: VerificationSource[] = [
    { name: "Reuters", initial: "R", bgColor: "#ef4444" },
    { name: "BBC", initial: "B", bgColor: "#1e3a8a" },
    { name: "NDTV", initial: "N", bgColor: "#ea580c" },
  ];

  const socialPlatforms = [
    { name: "WhatsApp", Icon: MessageCircle, bgColor: "#25D366" },
    { name: "Instagram", Icon: Instagram, bgGradient: "linear-gradient(135deg, #833AB4, #E1306C, #F77737)" },
    { name: "Facebook", Icon: Facebook, bgColor: "#1877F2" },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '28rem', margin: '0 auto' }}>
      {/* Outer animated glow */}
      <div 
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '24px',
          background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)',
          backgroundSize: '300% 300%',
          filter: 'blur(20px)',
          opacity: 0.3,
          animation: 'gradientShift 4s ease infinite',
          zIndex: 0
        }}
      />
      
      <Card style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        border: '2px solid',
        borderColor: 'hsl(var(--primary) / 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        background: 'hsl(var(--card))',
        zIndex: 1
      }}>
        {/* Background effects */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        <div 
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '1s',
            pointerEvents: 'none'
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, padding: '2rem' }}>
          {/* Verified Badge */}
          <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 20 }}>
            <div style={{
              padding: '6px 12px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <Shield style={{ width: '16px', height: '16px', color: 'white' }} strokeWidth={3} />
              <span style={{ fontSize: '11px', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Verified</span>
            </div>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              padding: '4px',
              background: 'linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                <img src={newssureLogo} alt="NewsSure Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, hsl(var(--primary)), #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '2px'
              }}>
                NewsSure
              </h3>
              <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                <Sparkles style={{ width: '12px', height: '12px' }} />
                AI-Powered Fact Checker
              </p>
            </div>
          </div>

          {/* False Claim Badge */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'hsl(var(--destructive) / 0.1)',
              border: '1px solid hsl(var(--destructive) / 0.3)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'hsl(var(--destructive))',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'hsl(var(--destructive))', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                False Claim
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '30px',
            fontWeight: 900,
            color: 'hsl(var(--foreground))',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            NASA confirms alien life on Mars!
          </h1>

          {/* Truth Score */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                  Truth Score
                </span>
                <span style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1'
                }}>
                  {truthScore}%
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }} />
                <div style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
                }}>
                  <CheckCircle2 style={{ width: '40px', height: '40px', color: 'white' }} strokeWidth={3} />
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{
              height: '24px',
              borderRadius: '999px',
              overflow: 'hidden',
              background: 'hsl(var(--muted))',
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                width: `${truthScore}%`,
                background: 'linear-gradient(90deg, #10b981, #059669, #10b981)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
                position: 'relative',
                borderRadius: '999px',
                transition: 'width 1s ease-out'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  animation: 'shimmer 2s linear infinite'
                }} />
              </div>
            </div>
          </div>

          {/* Verification Text */}
          <div style={{
            padding: '1rem',
            borderRadius: '16px',
            background: 'hsl(var(--muted) / 0.5)',
            border: '1px solid hsl(var(--border) / 0.5)',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '14px', color: 'hsl(var(--foreground))', lineHeight: '1.5', fontWeight: 500 }}>
              ✓ Verified by Reuters and NDTV - no credible NASA report found.
            </p>
          </div>

          {/* Verification  */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Verified 
            </p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              {verification.map((source, index) => (
                <div
                  key={index}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: source.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 700,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1) rotate(-6deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  }}
                >
                  {source.initial}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', fontWeight: 600 }}>
              🕐 Verified 13 Oct 2025, 08:54 am
            </p>
          </div>

          {/* Separator */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, hsl(var(--border)), transparent)',
            marginBottom: '1.5rem'
          }} />

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                padding: '4px',
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden', background: 'white' }}>
                  <img src={newssureLogo} alt="NewsSure" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'hsl(var(--foreground))' }}>NewsSure</p>
                <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Detect Truth, Defy Lies.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socialPlatforms.map((platform, index) => {
                const Icon = platform.Icon;
                return (
                  <div
                    key={index}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: platform.bgGradient || platform.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(-12deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    }}
                  >
                    <Icon style={{ width: '20px', height: '20px', color: 'white' }} strokeWidth={2.5} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div>
            <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', lineHeight: '1.5', fontWeight: 500, marginBottom: '12px' }}>
              This claim was fact checked by{" "}
              <span style={{ color: 'hsl(var(--primary))', fontWeight: 700 }}>NewsSure AI</span> – Truth Score: {truthScore}%
            </p>
            <button 
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, hsl(var(--primary)), #8b5cf6, hsl(var(--primary)))',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 3s ease infinite',
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
              }}
            >
              See Full Analysis
              <ExternalLink style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* Keyframe animations */}
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </Card>
    </div>
  );
};

export default FactCheckCard;