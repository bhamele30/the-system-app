import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight, ShieldCheck, Dumbbell, Activity, Target } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-mono text-sm relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      <div className="w-full max-w-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-md group-hover:blur-xl transition-all duration-500"></div>
            <span className="text-3xl font-display font-bold text-primary relative z-10">S</span>
          </div>
          
          <div className="space-y-4">
            <div className="text-primary font-display font-bold tracking-[0.4em] text-[10px] uppercase">
              30 Day Lock In
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-glow uppercase tracking-tighter leading-[0.85]">
              THE SYSTEM
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed border-l-2 border-primary/50 pl-4 py-1 text-left mt-6">
              A rigid, mathematically calibrated protocol designed to rebuild your baseline over 30 days. No negotiation. No deviations.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <div className="glass-panel p-5 border-white/5 border-t-primary/30">
            <Target className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-2">Calibration</h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Precise macro and caloric targeting based on your exact body composition metrics.
            </p>
          </div>
          
          <div className="glass-panel p-5 border-white/5 border-t-primary/30">
            <Dumbbell className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-2">Execution</h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Structured 5-day lifting splits optimized for progressive overload and density.
            </p>
          </div>
          
          <div className="glass-panel p-5 border-white/5 border-t-primary/30">
            <ShieldCheck className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-2">Accountability</h3>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Strict daily check-ins. If you miss a metric, the chain breaks.
            </p>
          </div>
        </div>

        {/* CTA Area */}
        <div className="flex flex-col items-center space-y-6">
          <Link href="/onboarding">
            <Button className="h-16 px-12 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.2em] text-sm shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all group overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-3">
                INITIALIZE CALIBRATION <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
            <Activity className="w-3 h-3 text-primary" /> 
            3-Day Evaluation Phase Active
          </div>
        </div>

      </div>
    </div>
  );
}
