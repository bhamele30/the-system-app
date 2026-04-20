import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dumbbell, Utensils, Bed, Target, Zap, Trophy, ShieldAlert, RefreshCw } from "lucide-react";
import { useSystem } from "@/hooks/use-system";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { state, submitDay, setHasSeenPhase2Celebration, startRecoveryProtocol } = useSystem();
  const [dayType, setDayType] = useState<"PUSH" | "PULL" | "LEGS" | "ARMS" | "UPPER" | "LOWER" | "REST">("PUSH");
  const [focusLine, setFocusLine] = useState("");
  const [showCheckin, setShowCheckin] = useState(false);
  const [showPhaseCelebration, setShowPhaseCelebration] = useState(false);
  const [checks, setChecks] = useState<{train: boolean | null, nutrition: boolean | null, recovery: boolean | null}>({ train: null, nutrition: null, recovery: null });
  const [error, setError] = useState("");

  // Generate daily protocol based on system execution logic
  useEffect(() => {
    // Determine the current cycle step based on the number of completed days.
    // This means the user stays on their current workout until they log a successful execution.
    
    // Check if in phase 1 (first 84 days) or phase 2 (after 84 days)
    const isPhase2 = state.completedDays >= 84;
    
    if (isPhase2 && !state.hasSeenPhase2Celebration) {
      setShowPhaseCelebration(true);
    }
    
    let cycle;
    if (isPhase2) {
      // Phase 2: 5 workouts + 1 rest day = 6 day cycle
      cycle = ["PUSH", "PULL", "LEGS", "UPPER", "LOWER", "REST"][state.completedDays % 6] as any;
    } else {
      // Phase 1: 4 workouts + 1 rest day = 5 day cycle
      cycle = ["PUSH", "PULL", "LEGS", "ARMS", "REST"][state.completedDays % 5] as any;
    }
    
    setDayType(cycle);

    const focusLines = [
      "Do the hard thing now.", 
      "You don't negotiate with weakness.", 
      "No one cares. Execute.", 
      "Feelings are irrelevant.", 
      "Raise your baseline.",
      "Suffer the pain of discipline.",
      "Show up."
    ];
    setFocusLine(focusLines[Math.floor(Math.random() * focusLines.length)]);
  }, [state.completedDays, state.hasSeenPhase2Celebration]);

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
    if (checks.train === null || checks.nutrition === null || checks.recovery === null) {
      setError("YOU MUST REPORT ALL METRICS TO LOG EXECUTION.");
      return;
    }
    
    setError("");
    const result = submitDay(checks.train, checks.nutrition, checks.recovery);
    setShowCheckin(false);
    
    setChecks({ train: null, nutrition: null, recovery: null });
    
    if (result.restored) {
      toast({
        title: "SYSTEM RESTORED",
        description: "REBUILD COMPLETE. RETURN TO STANDARD EXECUTION.",
        variant: "default",
      });
    } else if (result.success) {
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
  const hasLegacyFailureLock = isTodayCompleted && state.totalDays > 0 && state.streak === 0 && state.recoveryState === "idle";
  const isBreached = state.recoveryState === "breached" || hasLegacyFailureLock;
  const isRebuilding = state.recoveryState === "rebuilding";
  const canExecuteToday = !isTodayCompleted || isBreached || isRebuilding;
  const systemStatusLabel = isBreached ? "BREACHED" : isRebuilding ? "REBUILDING" : state.streak > 0 ? "ACTIVE" : "STANDBY";
  const executionButtonLabel = isRebuilding ? "RESTORE SYSTEM" : "EXECUTE DAY";
  const modalTitle = isRebuilding ? "LOG REBUILD EXECUTION" : "DID YOU EXECUTE";

  const handleStartRecovery = () => {
    startRecoveryProtocol();
    toast({
      title: "REBUILD MODE ACTIVE",
      description: "FULL EXECUTION RESTORES SYSTEM INTEGRITY.",
    });
  };

  // Calculate week and day based on current completed days (0-indexed to 1-indexed)
  // We want Week 1 / Day 1 on the very first day.
  const currentWeek = Math.floor((state.completedDays || 0) / 7) + 1;
  const currentDay = ((state.completedDays || 0) % 7) + 1;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6 font-mono text-sm md:pl-20">
      
      {/* Top Bar Stats */}
      <div className="w-full max-w-md flex justify-between items-center mb-12 border-b border-primary/20 pb-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">TIME IN SYSTEM</span>
          <span className="text-xl font-bold text-primary">WEEK {currentWeek} / DAY {currentDay}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">STREAK</span>
          <span className="text-xl font-bold text-primary flex items-center justify-end gap-1">
            <Zap className="w-4 h-4 fill-primary" /> {state.streak}
          </span>
        </div>
      </div>

      {/* Philosophy / Overview */}
      <div className="w-full max-w-md mb-8 p-5 border border-white/10 bg-black/40 rounded-none relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-primary/80"></div>
        <h2 className="font-display text-lg font-bold text-primary uppercase tracking-wider mb-2">Strength Without Noise</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          This is not a workout program. It is a system of consistency, discipline, and execution. You do not negotiate with the protocol. You show up, you execute, and you raise your baseline standards.
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="border border-white/5 p-3 bg-white/5">
            <div className="text-primary font-bold mb-1">PHASE 1 (12 WEEKS)</div>
            <div className="text-muted-foreground">Foundation & Hypertrophy. 4 days on, 1 day off.</div>
          </div>
          <div className="border border-white/5 p-3 bg-white/5">
            <div className="text-primary font-bold mb-1">PHASE 2 (12 WEEKS)</div>
            <div className="text-muted-foreground">Density & Power. 5 days on, 1 day off.</div>
          </div>
        </div>
      </div>

      {/* Main Display */}
      <main className="w-full max-w-md space-y-6">
        
        <div className="text-center mb-10">
          <div className={`inline-block px-3 py-1 text-[10px] uppercase tracking-widest mb-4 border ${
            isBreached
              ? "border-destructive text-destructive animate-pulse"
              : isRebuilding
                ? "border-yellow-400 text-yellow-300"
                : "border-primary text-primary"
          }`}>
            Day Type: {dayType}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-glow">THE SYSTEM</h1>
          <div className={`mt-2 text-sm uppercase tracking-widest font-bold ${
            isBreached ? "text-destructive" : isRebuilding ? "text-yellow-300" : "text-primary"
          }`}>
            SYSTEM STATUS: {systemStatusLabel}
          </div>
        </div>

        {(isBreached || isRebuilding) && (
          <div className={`border px-4 py-3 text-[11px] uppercase tracking-[0.25em] font-bold ${
            isBreached
              ? "border-destructive/50 bg-destructive/10 text-destructive shadow-[0_0_25px_rgba(255,0,0,0.08)]"
              : "border-yellow-400/40 bg-yellow-500/10 text-yellow-200 shadow-[0_0_25px_rgba(250,204,21,0.08)]"
          }`}>
            {isBreached ? "FAILURE REGISTERED — REPAIR REQUIRED" : "REBUILD ACTIVE — NEXT FULL DAY RESTORES INTEGRITY"}
          </div>
        )}

        {/* Protocol Sections */}
        <Card className={`bg-black/50 p-5 space-y-6 rounded-none relative overflow-hidden ${
          isBreached
            ? "border-destructive/40 shadow-[0_0_30px_rgba(255,0,0,0.06)]"
            : isRebuilding
              ? "border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.06)]"
              : "border-white/10"
        }`}>
          
          {dayType === "REST" ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
                  <RefreshCw className="w-3 h-3" /> RECOVERY PROTOCOL
                </div>
                <div className="font-bold text-lg">Active Recovery & Mobility</div>
                <div className="text-muted-foreground text-sm">No heavy lifting. Allow the nervous system to reset.</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
                  <Utensils className="w-3 h-3" /> RECOVERY NUTRITION
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>- Maintain protein target (1g/lb)</li>
                  <li>- Lower carbohydrates (no training fuel needed)</li>
                  <li>- Hydration focus (1 gallon minimum)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
                  <Bed className="w-3 h-3" /> REGENERATION TASKS
                </div>
                <ul className="text-muted-foreground space-y-1">
                  <li>- 45 minute light walk (Zone 1 heart rate)</li>
                  <li>- 15-20 minutes dedicated mobility/stretching</li>
                  <li>- Absolute minimum 8 hours of sleep</li>
                </ul>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}

          <div className="bg-primary/5 border border-primary/20 p-4 text-center mt-6">
            <div className="text-[10px] text-primary uppercase tracking-widest mb-1 flex justify-center items-center gap-1">
              <Target className="w-3 h-3" /> NO NEGOTIATION
            </div>
            <div className="font-bold text-xl uppercase tracking-widest text-glow">{focusLine}</div>
          </div>
        </Card>

        {isBreached && (
          <Card className="border border-destructive/40 bg-destructive/5 p-5 rounded-none space-y-5 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-destructive animate-pulse" />
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <div className="text-destructive text-[10px] uppercase tracking-[0.3em] font-bold">System Breach Detected</div>
                <h3 className="text-2xl font-bold text-destructive mt-1">REBUILD REQUIRED</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Failure is now on record. You do not hide from it. You move through a repair sequence and earn your way back into system integrity.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.2em]">
              <div className="border border-destructive/40 bg-destructive/10 px-2 py-3 text-destructive">Breach Logged</div>
              <div className="border border-white/10 px-2 py-3 text-foreground/60">Rebuild Mode</div>
              <div className="border border-white/10 px-2 py-3 text-foreground/60">Integrity Restored</div>
            </div>
            <div className="grid gap-2 text-[11px] uppercase tracking-widest text-foreground/80">
              <div className="border border-white/10 px-3 py-2">1. Acknowledge the breach</div>
              <div className="border border-white/10 px-3 py-2">2. Enter rebuild mode</div>
              <div className="border border-white/10 px-3 py-2">3. Win the next full day without compromise</div>
            </div>
            <div className="border border-destructive/20 bg-black/30 px-3 py-3 text-xs uppercase tracking-widest text-destructive/90">
              No reset. No excuse. Only repair.
            </div>
            <Button 
              onClick={handleStartRecovery}
              data-testid="button-begin-rebuild"
              className="w-full rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold uppercase tracking-widest h-12 shadow-[0_0_20px_rgba(255,0,0,0.18)]"
            >
              BEGIN REBUILD PROTOCOL
            </Button>
          </Card>
        )}

        {isRebuilding && (
          <Card className="border border-yellow-500/40 bg-yellow-500/5 p-5 rounded-none space-y-5 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-yellow-400" />
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-yellow-400 mt-0.5 animate-spin [animation-duration:3s]" />
              <div>
                <div className="text-yellow-400 text-[10px] uppercase tracking-[0.3em] font-bold">Rebuild Mode Active</div>
                <h3 className="text-2xl font-bold text-yellow-300 mt-1">SYSTEM RECOVERY IN PROGRESS</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You are inside the repair window now. One complete day restores the system. Anything less keeps the breach active.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-[0.2em]">
              <div className="border border-yellow-500/30 bg-yellow-500/10 px-2 py-3 text-yellow-200">Breach Logged</div>
              <div className="border border-yellow-500/50 bg-yellow-500/15 px-2 py-3 text-yellow-100 shadow-[0_0_16px_rgba(250,204,21,0.12)]">Rebuild Active</div>
              <div className="border border-white/10 px-2 py-3 text-foreground/60">Integrity Restored</div>
            </div>
            <div className="border border-yellow-500/30 bg-black/30 px-3 py-3 text-xs uppercase tracking-widest text-yellow-200 leading-relaxed">
              Recovery condition: train, nutrition, and recovery must all be marked YES on the next log. One weak link keeps the system damaged.
            </div>
            <Button 
              onClick={() => setShowCheckin(true)}
              data-testid="button-open-rebuild-log"
              className="w-full rounded-none bg-yellow-400 text-black hover:bg-yellow-300 font-bold uppercase tracking-widest h-12 shadow-[0_0_20px_rgba(250,204,21,0.18)]"
            >
              OPEN REBUILD LOG
            </Button>
          </Card>
        )}

        {!canExecuteToday ? (
          <div className={`w-full py-4 text-center border font-bold uppercase tracking-widest text-xs ${
            state.lastOutcome === "restored"
              ? "border-primary bg-primary/10 text-primary"
              : state.streak > 0 
                ? "border-primary bg-primary/10 text-primary" 
                : "border-destructive bg-destructive/10 text-destructive"
          }`}>
            {state.lastOutcome === "restored"
              ? "SYSTEM RESTORED"
              : state.streak > 0
                ? "SYSTEM MAINTAINED"
                : "SYSTEM BROKEN"}
          </div>
        ) : (
          <div className="space-y-2">
            <div className={`text-center uppercase tracking-widest text-xs font-bold flex flex-col gap-1 ${
              isRebuilding ? "text-yellow-300" : isBreached ? "text-destructive animate-pulse" : "text-destructive animate-pulse"
            }`}>
              <span>{isRebuilding ? "REBUILD WINDOW ACTIVE" : isBreached ? "SYSTEM DAMAGE DETECTED" : "DAY INCOMPLETE"}</span>
              <span>{isRebuilding ? "RESTORATION REQUIRED" : isBreached ? "REBUILD REQUIRED" : "EXECUTION REQUIRED"}</span>
            </div>
            <Button 
              onClick={() => setShowCheckin(true)}
              data-testid="button-execute-day"
              className={`w-full h-14 rounded-none font-bold uppercase tracking-widest text-sm ${
                isRebuilding
                  ? "bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.18)]"
                  : isBreached
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_24px_rgba(255,0,0,0.18)]"
                    : "bg-primary text-black hover:bg-primary/90"
              }`}
            >
              {isBreached ? "BEGIN REPAIR" : executionButtonLabel}
            </Button>
          </div>
        )}

      </main>

      {/* Check-in Modal */}
      <Dialog open={showCheckin} onOpenChange={setShowCheckin}>
        <DialogContent className="bg-black border-primary/20 rounded-none sm:max-w-md hide-close max-h-[92vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className={`font-mono uppercase tracking-widest text-xl text-center border-b pb-4 mb-4 text-glow ${
              isRebuilding ? "border-yellow-500/20 text-yellow-300" : "border-white/10"
            }`}>
              {modalTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="space-y-4 py-2">
              {isRebuilding && (
                <div className="border border-yellow-500/30 bg-yellow-500/10 p-3 text-[11px] font-bold text-center uppercase tracking-widest text-yellow-200">
                  Full compliance clears rebuild mode.
                </div>
              )}
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive p-3 text-xs font-bold text-center animate-pulse uppercase tracking-widest">
                  {error}
                </div>
              )}
              <div className="flex items-center justify-between bg-white/5 p-4 border border-white/5">
                <div className="font-mono text-base uppercase font-medium">TRAIN</div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="train" 
                      checked={checks.train === true} 
                      onChange={() => {
                        setChecks(p => ({...p, train: true}));
                        setError("");
                      }} 
                      className="accent-primary w-4 h-4"
                    /> YES
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="train" 
                      checked={checks.train === false} 
                      onChange={() => {
                        setChecks(p => ({...p, train: false}));
                        setError("");
                      }} 
                      className="accent-primary w-4 h-4"
                    /> NO
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-white/5 p-4 border border-white/5">
                <div className="font-mono text-base uppercase font-medium">NUTRITION</div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="nutrition" 
                      checked={checks.nutrition === true} 
                      onChange={() => {
                        setChecks(p => ({...p, nutrition: true}));
                        setError("");
                      }} 
                      className="accent-primary w-4 h-4"
                    /> YES
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="nutrition" 
                      checked={checks.nutrition === false} 
                      onChange={() => {
                        setChecks(p => ({...p, nutrition: false}));
                        setError("");
                      }} 
                      className="accent-primary w-4 h-4"
                    /> NO
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/5 p-4 border border-white/5">
                <div className="font-mono text-base uppercase font-medium">RECOVERY</div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="recovery" 
                      checked={checks.recovery === true} 
                      onChange={() => {
                        setChecks(p => ({...p, recovery: true}));
                        setError("");
                      }} 
                      className="accent-primary w-4 h-4"
                    /> YES
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input 
                      type="radio" 
                      name="recovery" 
                      checked={checks.recovery === false} 
                      onChange={() => {
                        setChecks(p => ({...p, recovery: false}));
                        setError("");
                      }} 
                      className="accent-primary w-4 h-4"
                    /> NO
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className={`pt-4 mt-4 border-t sticky bottom-0 bg-black ${isRebuilding ? "border-yellow-500/20" : "border-white/10"}`}>
            <Button 
              onClick={handleCheckinSubmit}
              className={`w-full h-12 rounded-none font-bold uppercase tracking-widest text-sm ${
                isRebuilding
                  ? "bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.18)]"
                  : "bg-primary text-black hover:bg-primary/90"
              }`}
            >
              {isRebuilding ? "LOG RESTORATION" : "LOG EXECUTION"}
            </Button>
          </div>
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
              You have executed the foundation for 12 weeks. Your physical and mental baseline has been elevated. 
              <br/><br/>
              <strong className="text-foreground">Phase 2: Density & Power</strong> begins now. 
              The protocol escalates to 5 lifting days per week.
            </p>
            
            <Button 
              onClick={() => {
                setHasSeenPhase2Celebration();
                setShowPhaseCelebration(false);
              }}
              className="w-full mt-4 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold uppercase tracking-widest text-sm shadow-[0_0_30px_hsl(var(--primary)/0.3)] transition-all"
            >
              ACCEPT NEW PROTOCOL
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
