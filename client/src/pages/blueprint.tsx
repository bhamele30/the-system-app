import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Flame, Target, Trophy, Clock, CheckCircle2, Circle, Quote, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import transformImg from "@/assets/transformation-placeholder.png";
import { useSystem } from "@/hooks/use-system";

export default function Blueprint() {
  const { state } = useSystem();
  // Calculate current week and day based on completed days
  // e.g., if completedDays is 0, week is 1 and day is 1.
  const isPhase2 = state.completedDays >= 30;
  const phaseDays = state.completedDays % 30;
  const currentWeek = Math.floor(state.completedDays / 7) + 1;
  const currentDay = (state.completedDays % 7) + 1;
  const phaseCompletion = Math.min(100, Math.round((state.completedDays / 30) * 100)); // Phase 1 is 30 days
  
  let cycleName = "";
  let cycleDuration = "";
  let cycleType = "";
  
  if (isPhase2) {
    const p2Cycle = ["Push: Chest & Triceps", "Pull: Back & Biceps", "Shoulders & Legs", "Upper Body Power", "Lower Body Power", "Active Recovery"][state.completedDays % 6];
    cycleName = p2Cycle;
    cycleDuration = p2Cycle === "Active Recovery" ? "45 Min" : "65-75 Min";
    cycleType = p2Cycle === "Active Recovery" ? "Recovery" : "Hypertrophy / Power";
  } else {
    const p1Cycle = ["Push: Chest & Triceps", "Pull: Back & Biceps", "Shoulders & Legs", "Strict Arms", "Active Recovery"][state.completedDays % 5];
    cycleName = p1Cycle;
    cycleDuration = p1Cycle === "Active Recovery" || p1Cycle === "Strict Arms" ? "45 Min" : "60-75 Min";
    cycleType = p1Cycle === "Active Recovery" ? "Recovery" : "Foundation";
  }

  const [metrics, setMetrics] = useState({
    bodyweight: "174.5",
    fat: "14",
    bench: "225",
    squat: "315"
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [tempMetrics, setTempMetrics] = useState(metrics);

  const handleUpdateMetrics = () => {
    setMetrics(tempMetrics);
    setIsUpdating(false);
    toast({
      title: "Metrics Updated",
      description: "Your new baseline has been recorded.",
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-primary font-display font-medium tracking-widest text-xs mb-2">
            {isPhase2 ? "PHASE 2: THE DEEPER PROTOCOL" : "30 DAY LOCK IN CHALLENGE"}
          </div>
          <h1 className="text-4xl font-bold text-glow mb-4">COMMAND CENTER</h1>
          <Link href="/onboarding">
            <Button variant="outline" className="h-10 rounded-none border-primary/50 text-primary hover:text-primary-foreground hover:bg-primary uppercase tracking-widest font-bold text-xs flex items-center gap-2 shadow-[0_0_10px_hsl(var(--primary)/0.2)]">
              <Target className="w-4 h-4" /> System Body Calibration
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-none border border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold uppercase">SYSTEM STATUS: {state.streak > 0 ? 'ACTIVE' : 'FAILING'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-none border border-white/5">
          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${state.streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            <span className="font-display font-bold">STREAK: {state.streak} DAYS</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-none border border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold uppercase">CONSISTENCY: {state.totalDays > 0 ? Math.round((state.completedDays / state.totalDays) * 100) : 0}%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Action */}
          <section className="glass-panel p-6 rounded-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-none pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> TODAY'S PROTOCOL
              </h2>
              <span className="text-sm text-muted-foreground">Week {currentWeek} / Day {currentDay}</span>
            </div>

            <Link href="/workouts">
              <div className="bg-secondary/80 border border-white/5 rounded-none p-5 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{cycleName}</h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-3">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {cycleDuration}</span>
                  <span className="flex items-center gap-1"><DumbbellIcon /> {cycleType}</span>
                </p>
              </div>
            </Link>
          </section>

          {/* System Calibration Output */}
          {state.targets && state.profile && (
            <section className="glass-panel p-6 rounded-none mt-6 border border-primary/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold text-glow">SYSTEM PROFILE</h2>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Current Status</div>
                  <div className="text-primary font-bold uppercase tracking-widest text-sm">{state.mode}</div>
                </div>
              </div>
              
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Classification</div>
                <div className="text-xl font-bold uppercase text-white">{state.profile.classification} Operator</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Calories</div>
                  <div className="text-2xl font-bold font-display text-white">{state.targets.kcal}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Protein</div>
                  <div className="text-2xl font-bold font-display text-white">{state.targets.protein}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Carbs</div>
                  <div className="text-2xl font-bold font-display text-white">{state.targets.carbs}g</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Fats</div>
                  <div className="text-2xl font-bold font-display text-white">{state.targets.fats}g</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Recovery Priority</div>
                  <div className={`font-bold uppercase text-sm ${state.targets.recoveryPriority.includes('High') || state.targets.recoveryPriority.includes('Critical') ? 'text-primary' : 'text-white'}`}>{state.targets.recoveryPriority}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Hydration Target</div>
                  <div className="font-bold uppercase text-sm text-blue-400">{state.targets.hydration}</div>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Phase Progress */}
          <section className="glass-panel p-6 rounded-none">
            <h2 className="text-xl font-display font-bold mb-4">PHASE PROGRESS</h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-bold text-primary">{phaseCompletion}%</span>
            </div>
            <Progress value={phaseCompletion} className="h-2 mb-6" />
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="mt-1"><Trophy className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="font-bold text-sm">{isPhase2 ? "Current Objective" : "Next Objective"}</h4>
                  <p className="text-xs text-muted-foreground">
                    {isPhase2 
                      ? "Increase compound lifts by 5% this block. Maintain tight form." 
                      : "Execute current training block consistently to unlock Phase 2."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Protocol Rules */}
          <Dialog>
            <DialogTrigger asChild>
              <section className="rounded-none overflow-hidden relative border border-white/10 group cursor-pointer bg-black/50 hover:bg-black/80 transition-colors">
                <div className="p-6 relative z-10">
                  <div className="text-xs font-display text-primary tracking-widest mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> THE PROTOCOL
                  </div>
                  <h3 className="font-bold text-xl leading-tight text-glow mb-2 uppercase">30 DAY LOCK IN CHALLENGE</h3>
                  <p className="text-sm text-muted-foreground">Review the daily non-negotiables and system parameters.</p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Flame className="w-24 h-24" />
                </div>
              </section>
            </DialogTrigger>
            <DialogContent className="glass-panel border-primary/20 bg-background/95 backdrop-blur-xl sm:max-w-md max-h-[85vh] overflow-y-auto hide-scrollbar">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-black text-white flex flex-col gap-1 mb-4 border-b border-white/10 pb-4">
                  <span className="text-primary text-xs tracking-[0.3em] uppercase">The System</span>
                  30 DAY LOCK IN CHALLENGE
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 text-sm font-mono mt-2">
                
                <div className="space-y-3">
                  <h4 className="font-bold text-primary uppercase tracking-widest text-xs border-b border-primary/20 pb-2">Objective: Rebuild</h4>
                  <ul className="list-none space-y-1.5 text-muted-foreground uppercase tracking-widest text-[11px] font-bold">
                    <li>• Discipline</li>
                    <li>• Structure</li>
                    <li>• Consistency</li>
                    <li>• Physical Momentum</li>
                    <li>• Mental Control</li>
                  </ul>
                  <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-[10px] uppercase tracking-[0.2em] font-bold leading-relaxed">
                    NOT: Extreme transformation in 30 days
                  </div>
                </div>

                <div className="space-y-5 pt-4">
                  <h4 className="font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-primary" /> DAILY NON-NEGOTIABLES
                  </h4>
                  
                  <div className="space-y-1">
                    <div className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2"><span className="text-primary">1.</span> TRAIN</div>
                    <div className="text-muted-foreground text-xs leading-relaxed pl-5">Minimum: 45–75 mins. No skipped sessions unless recovery day assigned.</div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2"><span className="text-primary">2.</span> HIT MACROS</div>
                    <div className="text-muted-foreground text-xs leading-relaxed pl-5">Daily: Protein, Calorie, and Hydration targets. Compliance tracked in app.</div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2"><span className="text-primary">3.</span> SLEEP STANDARD</div>
                    <div className="text-muted-foreground text-xs leading-relaxed pl-5">In bed before 11 PM. No chaos sleep schedule.</div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2"><span className="text-primary">4.</span> NO NEGOTIATION</div>
                    <div className="text-muted-foreground text-xs italic border-l-2 border-primary/50 pl-3 ml-5 py-1 space-y-1">
                      <div>"I'll start tomorrow"</div>
                      <div>"I don't feel like it"</div>
                      <div>"One day off won't matter"</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2"><span className="text-primary">5.</span> DAILY CHECK-IN</div>
                    <div className="text-muted-foreground text-xs leading-relaxed pl-5">Track energy, mood, recovery, bodyweight, and execution score.</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>

      </div>
    </div>
  );
}

function MetricBox({ label, value, unit, trend, positive = false }: { label: string, value: string, unit: string, trend: string, positive?: boolean }) {
  return (
    <div className="bg-secondary/50 rounded-none p-4 border border-white/5 flex flex-col justify-center">
      <span className="text-[10px] font-display text-muted-foreground tracking-widest mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold font-display">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <span className={`text-xs mt-1 font-medium ${positive ? 'text-green-400' : 'text-primary'}`}>
        {trend} {unit}
      </span>
    </div>
  );
}

function DumbbellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m14.5 9.5 5 5"></path><path d="m10.5 5.5 5 5"></path><path d="m9.5 14.5 5 5"></path><path d="m5.5 10.5 5 5"></path><path d="M18 12a2.83 2.83 0 0 0 4-4 2.83 2.83 0 0 0-4-4 2.83 2.83 0 0 0-4 4 2.83 2.83 0 0 0 4 4"></path><path d="M6 22a2.83 2.83 0 0 0 4-4 2.83 2.83 0 0 0-4-4 2.83 2.83 0 0 0-4 4 2.83 2.83 0 0 0 4 4"></path>
    </svg>
  );
}
