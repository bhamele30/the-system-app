import { Button } from "@/components/ui/button";
import { useSystem } from "@/hooks/use-system";
import { ShieldAlert, Lock, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Paywall() {
  const { authorizePayment } = useSystem();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');

    if (payment === 'success') {
      authorizePayment();
      setLocation('/');
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const resp = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { url } = await resp.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-mono text-sm">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/10 rounded-none flex items-center justify-center border border-primary/30 mx-auto relative mb-6">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-none"></div>
            <Lock className="w-10 h-10 text-primary relative z-10" />
          </div>
          
          <div className="text-primary font-display font-medium tracking-widest text-xs mb-2 uppercase">
            TRIAL CONCLUDED
          </div>
          <h1 className="text-3xl font-bold text-glow uppercase tracking-tighter">
            SYSTEM ACCESS RESTRICTED
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            You have completed the 3-day evaluation phase. Total commitment is now required to proceed.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-none border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-none pointer-events-none" />
          
          <div className="text-center mb-6">
            <div className="text-5xl font-black font-display tracking-tighter mb-2 text-white">
              $14<span className="text-xl text-muted-foreground">/mo</span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Cancel anytime. No excuses.
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "Unrestricted access to all training protocols",
              "Customized nutrition and macro tracking",
              "Advanced recovery and hydration analytics",
              "Permanent execution archive",
              "Zero compromise."
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide leading-tight">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs uppercase tracking-wide">
              {error}
            </div>
          )}

          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full h-14 bg-primary text-black hover:bg-primary/90 rounded-none font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all relative overflow-hidden group"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                REDIRECTING TO CHECKOUT...
              </span>
            ) : (
              <span className="flex items-center gap-2 relative z-10">
                AUTHORIZE PAYMENT <span className="opacity-70">($14/mo)</span>
              </span>
            )}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-muted-foreground uppercase tracking-widest">
            <ShieldAlert className="w-3 h-3" /> Secured by Stripe
          </div>
        </div>
      </div>
    </div>
  );
}
