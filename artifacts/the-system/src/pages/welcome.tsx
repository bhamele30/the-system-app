import { useLocation } from "wouter";

export default function Welcome() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm text-center space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

        <div className="space-y-3">
          <div className="text-primary font-display font-medium tracking-[0.4em] text-xs uppercase mb-4">
            Operator Protocol
          </div>

          <h1 className="text-6xl font-black font-display tracking-tighter text-white text-glow leading-none">
            THE<br />SYSTEM
          </h1>

          <div className="w-16 h-px bg-primary/50 mx-auto mt-6" />
        </div>

        <p className="text-muted-foreground text-sm tracking-wide leading-relaxed max-w-xs mx-auto font-mono">
          You've tried the apps. You've done the challenges. None of it stuck because none of it was built around you. This is different. Your numbers. Your protocol. Phase 1 locks you in. Phase 2 builds you up. The system doesn't end — it evolves.
        </p>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => setLocation("/onboarding")}
            className="w-full h-14 bg-primary text-black font-bold font-display uppercase tracking-widest text-sm hover:bg-primary/90 transition-all relative overflow-hidden group border-none outline-none"
          >
            <span className="relative z-10">BEGIN CALIBRATION</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-mono">
            3-day free trial — then $19/mo
          </div>
        </div>
      </div>
    </div>
  );
}
