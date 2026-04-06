import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dumbbell, Utensils, Bed, Target, Zap, Clock, CalendarDays, Crosshair, Trophy } from "lucide-react";
import { useSystem } from "@/hooks/use-system";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { state, submitDay, setHasSeenPhase2Celebration } = useSystem();
  const [dayType, setDayType] = useState<"PUSH" | "PULL" | "LEGS" | "ARMS" | "UPPER" | "LOWER" | "REST">("PUSH");
  const [focusLine, setFocusLine] = useState("");
  const [showCheckin, setShowCheckin] = useState(false);
  const [showPhaseCelebration, setShowPhaseCelebration] = useState(false);
  const [checks, setChecks] = useState({ train: false, nutrition: false, recovery: false });

  // Generate daily protocol based on system execution logic
  useEffect(() => {
    // Simple cycle based on day of year for demo purposes
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    
    // Check if in phase 1 (first 84 days) or phase 2 (after 84 days)
    const isPhase2 = state.totalDays >= 84;
    
    if (isPhase2 && !state.hasSeenPhase2Celebration) {
      setShowPhaseCelebration(true);
    }
    
    let cycle;
    if (isPhase2) {
      // Phase 2: Hypertrophy Focus (Push/Pull/Legs/Upper/Lower/Rest)
      cycle = ["PUSH", "PULL", "LEGS", "UPPER", "LOWER", "REST"][dayOfYear % 6] as any;
    } else {
      // Phase 1: Foundation (Push/Pull/Legs/Arms/Rest)
      cycle = ["PUSH", "PULL", "LEGS", "ARMS", "REST"][dayOfYear % 5] as any;
    }
    
    setDayType(cycle);

    const focusLines = ["Execute.", "No negotiation.", "Stay consistent.", "Repeat.", "No thinking."];
    setFocusLine(focusLines[Math.floor(Math.random() * focusLines.length)]);
  }, [state.totalDays]);

  const getWorkout = () => {
    if (dayType === "PUSH") return "Chest & Triceps";
    if (dayType === "PULL") return "Back & Biceps";
    if (dayType === "LEGS") return "Shoulders & Legs";
    if (dayType === "ARMS") return "Strict Arms";
    if (dayType === "UPPER") return "Upper Body Power";
    if (dayType === "LOWER") return "Lower Body Power";
    return "Active Recovery";
  };

  const handleCheckinSubmit = () => {
    const result = submitDay(checks.train, checks.nutrition, checks.recovery);
    setShowCheckin(false);
    
    if (result.success) {
      toast({
        title: "SYSTEM MAINTAINED",
        description: "STAY IN THE SYSTEM.",
        variant: "default",
      });
    } else {
      toast({
        title: "SYSTEM BROKEN",
        description: "YOU BROKE THE SYSTEM. ZERO TOLERANCE.",
        variant: "destructive",
      });
    }
  };

  const isTodayCompleted = state.lastCompletedDate === new Date().toISOString().split('T')[0];
  const allChecked = checks.train && checks.nutrition && checks.recovery;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6 font-mono text-sm md:pl-20">
      
      {/* Top Bar Stats */}
      <div className="w-full max-w-md flex justify-between items-center mb-12 border-b border-primary/20 pb-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">CONSISTENCY</span>
          <span className="text-xl font-bold text-primary">{state.totalDays > 0 ? Math.round((state.completedDays / state.totalDays) * 100) : 0}%</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">STREAK</span>
          <span className="text-xl font-bold text-primary flex items-center justify-end gap-1">
            <Zap className="w-4 h-4 fill-primary" /> {state.streak}
          </span>
        </div>
      </div>

      {/* Main Display */}
      <main className="w-full max-w-md space-y-6">
        
        <div className="text-center mb-10">
          <div className="inline-block border border-primary text-primary px-3 py-1 text-[10px] uppercase tracking-widest mb-4">
            Day Type: {dayType}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-glow">THE SYSTEM</h1>
          <div className="text-primary mt-2 text-sm uppercase tracking-widest font-bold">SYSTEM STATUS: {state.streak > 0 ? "ACTIVE" : "FAILING"}</div>
        </div>

        {/* Protocol Sections */}
        <Card className="bg-black/50 border-white/10 p-5 space-y-6 rounded-none relative overflow-hidden">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
              <Dumbbell className="w-3 h-3" /> ACTION REQUIRED
            </div>
            <div className="font-bold text-lg">{getWorkout()}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
              <Utensils className="w-3 h-3" /> FOLLOW PROTOCOL
            </div>
            <ul className="text-muted-foreground space-y-1">
              <li>- Protein priority</li>
              <li>- Moderate carbs</li>
              <li>- No excess calories</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
              <Bed className="w-3 h-3" /> COMPLETE REQUIREMENTS
            </div>
            <ul className="text-muted-foreground space-y-1">
              <li>- Walk 20 minutes</li>
              <li>- Sleep 7-8 hours</li>
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 text-center mt-6">
            <div className="text-[10px] text-primary uppercase tracking-widest mb-1 flex justify-center items-center gap-1">
              <Target className="w-3 h-3" /> NO NEGOTIATION
            </div>
            <div className="font-bold text-xl uppercase tracking-widest text-glow">{focusLine}</div>
          </div>
        </Card>

        {isTodayCompleted ? (
          <div className="w-full py-4 text-center border border-primary bg-primary/10 text-primary font-bold uppercase tracking-widest text-xs">
            SYSTEM MAINTAINED
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-center text-destructive uppercase tracking-widest text-xs font-bold animate-pulse flex flex-col gap-1">
              <span>DAY INCOMPLETE</span>
              <span>EXECUTION REQUIRED</span>
            </div>
            <Button 
              onClick={() => setShowCheckin(true)}
              className="w-full h-14 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest text-sm"
            >
              EXECUTE DAY
            </Button>
          </div>
        )}

      </main>

      {/* Check-in Modal */}
      <Dialog open={showCheckin} onOpenChange={setShowCheckin}>
        <DialogContent className="bg-black border-primary/20 rounded-none sm:max-w-md hide-close">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase tracking-widest text-xl text-center border-b border-white/10 pb-4 mb-4 text-glow">
              DID YOU EXECUTE
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between bg-white/5 p-4 border border-white/5">
              <Label className="font-mono text-base uppercase">TRAIN</Label>
              <div className="flex gap-4">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="train" 
                    checked={checks.train === true} 
                    onChange={() => setChecks(p => ({...p, train: true}))} 
                    className="accent-primary w-4 h-4"
                  /> YES
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="train" 
                    checked={checks.train === false} 
                    onChange={() => setChecks(p => ({...p, train: false}))} 
                    className="accent-primary w-4 h-4"
                  /> NO
                </Label>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white/5 p-4 border border-white/5">
              <Label className="font-mono text-base uppercase">NUTRITION</Label>
              <div className="flex gap-4">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="nutrition" 
                    checked={checks.nutrition === true} 
                    onChange={() => setChecks(p => ({...p, nutrition: true}))} 
                    className="accent-primary w-4 h-4"
                  /> YES
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="nutrition" 
                    checked={checks.nutrition === false} 
                    onChange={() => setChecks(p => ({...p, nutrition: false}))} 
                    className="accent-primary w-4 h-4"
                  /> NO
                </Label>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-4 border border-white/5">
              <Label className="font-mono text-base uppercase">RECOVERY</Label>
              <div className="flex gap-4">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="recovery" 
                    checked={checks.recovery === true} 
                    onChange={() => setChecks(p => ({...p, recovery: true}))} 
                    className="accent-primary w-4 h-4"
                  /> YES
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="recovery" 
                    checked={checks.recovery === false} 
                    onChange={() => setChecks(p => ({...p, recovery: false}))} 
                    className="accent-primary w-4 h-4"
                  /> NO
                </Label>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCheckinSubmit}
            className="w-full h-12 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest text-sm mt-4"
          >
            Submit Data
          </Button>
        </DialogContent>
      </Dialog>

      {/* Phase 2 Celebration Modal */}
      <Dialog open={showPhaseCelebration} onOpenChange={() => {}}>
        <DialogContent className="bg-black border-primary/50 shadow-[0_0_50px_hsl(var(--primary)/0.2)] rounded-none sm:max-w-lg overflow-hidden hide-close">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 mb-2 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <Trophy className="w-10 h-10 text-primary relative z-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display text-primary text-sm uppercase tracking-[0.3em] font-bold">Foundation Complete</h2>
              <h3 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-glow leading-none">
                PHASE 1<br/>CONQUERED
              </h3>
            </div>
            
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed border-y border-white/5 py-6 my-2">
              You showed up for 84 days. You executed the protocol. You built the discipline required to transform. 
              <br/><br/>
              Welcome to Phase 2. The training wheels are off. New programming has been unlocked in your Training Library.
            </p>
            
            <Button 
              onClick={() => {
                setHasSeenPhase2Celebration();
                setShowPhaseCelebration(false);
              }}
              className="w-full h-14 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
            >
              Enter Phase 2
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
