import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dumbbell, Utensils, Bed, Target, Zap, Trophy, ShieldAlert, RefreshCw } from "lucide-react";
import { useSystem } from "@/hooks/use-system";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const { state, submitDay, setHasSeenPhase2Celebration, startRecoveryProtocol, setMode } = useSystem();
  const [dayType, setDayType] = useState<"PUSH" | "PULL" | "LEGS" | "ARMS" | "UPPER" | "LOWER" | "REST" | "UPPER_POWER" | "LOWER_BODY" | "ACTIVE_RECOVERY" | "PUSH_VOLUME" | "PULL_VOLUME" | "LEGS_COND" | "SYSTEM_RESET" | "PUSH_P2" | "PULL_P2" | "LEGS_P2" | "FULL_BODY_P2">("UPPER_POWER");
  const [focusLine, setFocusLine] = useState("");
  const [showCheckin, setShowCheckin] = useState(false);
  const [showPhaseCelebration, setShowPhaseCelebration] = useState(false);
  const [checks, setChecks] = useState<{train: boolean | null, nutrition: boolean | null, recovery: boolean | null}>({ train: null, nutrition: null, recovery: null });
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate daily protocol based on system execution logic
  useEffect(() => {
    // Determine the current cycle step based on the number of completed days.
    // This means the user stays on their current workout until they log a successful execution.
    
    // Check if in phase 1 (first 30 days) or phase 2 (after 30 days)
    const isPhase2 = state.completedDays >= 30;
    const phaseDays = state.completedDays % 30;
    
    if (isPhase2 && !state.hasSeenPhase2Celebration) {
      setShowPhaseCelebration(true);
    }
    
    let cycle;
    if (isPhase2) {
      // Phase 2: 4 workouts + 1 active recovery + 2 rest days = 7 day cycle
      cycle = ["PUSH_P2", "PULL_P2", "REST", "LEGS_P2", "FULL_BODY_P2", "ACTIVE_RECOVERY", "REST"][phaseDays % 7] as any;
    } else {
      // Phase 1 (30 Day Challenge): 5 workouts + 1 rest + 1 reset = 7 day cycle
      cycle = ["UPPER_POWER", "LOWER_BODY", "ACTIVE_RECOVERY", "PUSH_VOLUME", "PULL_VOLUME", "LEGS_COND", "SYSTEM_RESET"][state.completedDays % 7] as any;
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
    if (dayType === "UPPER_POWER") return "Upper Power";
    if (dayType === "LOWER_BODY") return "Lower Body";
    if (dayType === "ACTIVE_RECOVERY") return "Active Recovery";
    if (dayType === "PUSH_VOLUME") return "Push";
    if (dayType === "PULL_VOLUME") return "Pull";
    if (dayType === "LEGS_COND") return "Legs + Conditioning";
    if (dayType === "SYSTEM_RESET") return "System Reset";
    
    // Phase 2 fallbacks
    if (dayType === "PUSH_P2") return "Push (Phase 2)";
    if (dayType === "PULL_P2") return "Pull (Phase 2)";
    if (dayType === "LEGS_P2") return "Legs (Phase 2)";
    if (dayType === "FULL_BODY_P2") return "Full Body Power (Phase 2)";
    return "Active Recovery";
  };

  const getModeSpecificAdvice = () => {
    switch (state.mode) {
      case "cut":
        return {
          train: "Push hard. Keep intensity high. No drop in weight.",
          nutrition: "Deficit active. Strict adherence. Zero negotiation.",
          recovery: "Fatigue will hit. Sleep is mandatory."
        };
      case "build":
        return {
          train: "Push volume. Chase overload. Leave nothing.",
          nutrition: "Surplus active. Fuel the machine. Eat to grow.",
          recovery: "Tissue repair required. Hydrate and sleep."
        };
      case "lock-in":
        return {
          train: "Absolute focus. No distractions. Execute.",
          nutrition: "100% adherence. Zero deviations allowed.",
          recovery: "Total isolation. Disconnect and repair."
        };
      default:
        return {
          train: "Execute standard protocol. Form over ego.",
          nutrition: "Maintenance calories. Hit protein targets.",
          recovery: "Standard recovery protocols active."
        };
    }
  };

  const modeAdvice = getModeSpecificAdvice();

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
        title: "SYSTEM LOCKED IN",
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
  const hasLegacyFailureLock = isTodayCompleted && state.totalDays > 0 && state.streak === 0 && state.recoveryState === "idle";
  const isBreached = state.recoveryState === "breached" || hasLegacyFailureLock;
  const isRebuilding = state.recoveryState === "rebuilding";
  const canExecuteToday = !isTodayCompleted || isBreached || isRebuilding;
  
  let statusColor = "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]";
  let statusIcon = "🔴";
  let systemStatusLabel = "NOT STARTED";

  if (isBreached) {
    statusColor = "text-destructive drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]";
    statusIcon = "🔴";
    systemStatusLabel = "BREACHED";
  } else if (isRebuilding) {
    statusColor = "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]";
    statusIcon = "🟡";
    systemStatusLabel = "REBUILDING";
  } else if (isTodayCompleted) {
    statusColor = "text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    statusIcon = "🟢";
    systemStatusLabel = "COMPLETE";
  } else if (state.streak > 0) {
    // If they have a streak but haven't executed today
    statusIcon = "🔴";
    systemStatusLabel = "NOT STARTED";
  }

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
  const isPhase2 = state.completedDays >= 84;
  const phaseDays = state.completedDays % 84;
  
  const currentWeek = Math.floor((phaseDays || 0) / 7) + 1;
  const currentDay = ((phaseDays || 0) % 7) + 1;

  const displayDay = state.completedDays + 1;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6 font-mono text-sm md:pl-20">
      
      <div className="w-full max-w-md mb-8 flex justify-center">
        <h2 className="font-display text-2xl font-black text-white uppercase tracking-[0.4em] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">THE SYSTEM</h2>
      </div>

      {/* Top Bar Stats */}
      <div className="w-full max-w-md flex justify-between items-end mb-8 border-b-2 border-white/10 pb-4">
        <div className="flex flex-col">
          <span className="text-white/40 uppercase tracking-[0.3em] text-[9px] mb-1 font-bold">
            {displayDay <= 30 ? "PHASE 1: LOCK IN" : "PHASE 2: EXECUTION"}
          </span>
          <span className="text-2xl font-black text-white tracking-tighter">
            {displayDay <= 30 ? `DAY ${displayDay} / 30` : `WEEK ${Math.floor((displayDay - 1) / 7) + 1} / 12`}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-white/40 uppercase tracking-[0.3em] text-[9px] mb-1 font-bold">Unbroken Chain</span>
          <span className="text-2xl font-black text-primary flex items-center justify-end tracking-tighter">
            {state.streak} DAYS
          </span>
          <span className="text-destructive uppercase tracking-[0.2em] text-[9px] font-bold mt-1">MISS = RESET TO 0</span>
        </div>
      </div>

      <div className="w-full max-w-md mb-8">
        <div className="bg-black/50 p-4 border border-white/10">
          <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mb-3">Operating Mode</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(["cut", "build"] as const).map((modeOption) => (
              <Button
                key={modeOption}
                variant="outline"
                size="sm"
                onClick={() => setMode(modeOption)}
                className={`font-display uppercase tracking-widest text-[10px] h-10 rounded-none border ${
                  state.mode === modeOption 
                    ? "bg-white text-black hover:bg-white/90 border-white" 
                    : "bg-black border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
              >
                {modeOption} (GOAL)
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setMode("lock-in")}
            className={`w-full font-display font-black uppercase tracking-[0.3em] text-xs h-12 rounded-none border-2 transition-all relative overflow-hidden group ${
              state.mode === "lock-in" 
                ? "bg-primary text-black hover:bg-primary/90 border-primary shadow-[0_0_25px_hsl(var(--primary)/0.4)]" 
                : "bg-primary/5 border-primary/50 text-primary hover:bg-primary/20 hover:border-primary shadow-[0_0_10px_hsl(var(--primary)/0.1)]"
            }`}
          >
            {state.mode === "lock-in" && <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay pointer-events-none"></div>}
            <span className="relative z-10 flex items-center justify-center gap-2 w-full">
              <span className="text-sm">🔥</span> LOCK IN (IDENTITY)
            </span>
          </Button>
        </div>
      </div>

      {/* Main Display */}
      <main className="w-full max-w-md space-y-6">

        <div className="text-center mb-10 border border-white/10 py-10 bg-black/80 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black opacity-50 pointer-events-none"></div>
          
          <div className={`relative z-10 inline-block px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-bold mb-6 border ${
            isBreached
              ? "border-destructive text-destructive bg-destructive/10 animate-pulse"
              : isRebuilding
                ? "border-yellow-400 text-yellow-300 bg-yellow-400/10"
                : "border-primary text-primary bg-primary/10"
          }`}>
            PROTOCOL: {dayType}
          </div>
          
          <h1 className="relative z-10 text-6xl md:text-7xl font-black uppercase tracking-tighter text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            EXECUTE
          </h1>
          
          <div className="relative z-10 text-xs uppercase tracking-[0.4em] font-bold">
            <span className={`${statusColor}`}>STATUS: {statusIcon} {systemStatusLabel}</span>
            {!isTodayCompleted && !isBreached && !isRebuilding && (
              <span className="ml-4 text-white/50 border-l border-white/20 pl-4 flex-inline items-center">
                TIME REMAINING: <span className="text-white font-mono tracking-widest">{timeLeft}</span>
              </span>
            )}
            {isTodayCompleted && !isRebuilding && !isBreached && (
              <span className="ml-4 text-green-500 border-l border-white/20 pl-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                CHAIN: +1 DAY
              </span>
            )}
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
        <Card className={`bg-black/50 p-6 space-y-8 rounded-none relative overflow-hidden ${
          isBreached
            ? "border-destructive/40 shadow-[0_0_30px_rgba(255,0,0,0.06)]"
            : isRebuilding
              ? "border-yellow-400/30 shadow-[0_0_30px_rgba(250,204,21,0.06)]"
              : "border-white/10"
        }`}>
          
          {["REST", "ACTIVE_RECOVERY", "SYSTEM_RESET"].includes(dayType) ? (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-primary uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" /> DIRECTIVE 01 // RECOVERY
                  </span>
                </div>
                <div className="font-bold text-lg uppercase tracking-wider">{getWorkout()}</div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">No heavy lifting. Nervous system reset.</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-primary uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
                    <Utensils className="w-3 h-3" /> DIRECTIVE 02 // FUEL
                  </span>
                </div>
                <div className="font-bold text-lg uppercase tracking-wider">MAINTENANCE CALORIES</div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">Target: 1g Protein / lb bodyweight.</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-primary uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
                    <Bed className="w-3 h-3" /> DIRECTIVE 03 // REGENERATION
                  </span>
                </div>
                <div className="font-bold text-lg uppercase tracking-wider">8+ HOURS SLEEP</div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">Hydration: 1 Gallon strict.</div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-primary uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
                    <Dumbbell className="w-3 h-3" /> DIRECTIVE 01 // TRAINING
                  </span>
                </div>
                <div className="font-bold text-lg uppercase tracking-wider">{getWorkout()}</div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">Execute protocol. Zero deviations.</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-primary uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
                    <Utensils className="w-3 h-3" /> DIRECTIVE 02 // FUEL
                  </span>
                </div>
                <div className="font-bold text-lg uppercase tracking-wider">MACROS LOCKED</div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">Hit daily targets. Fuel the machine.</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                  <span className="text-primary uppercase tracking-widest text-[10px] font-bold flex items-center gap-2">
                    <Bed className="w-3 h-3" /> DIRECTIVE 03 // REGENERATION
                  </span>
                </div>
                <div className="font-bold text-lg uppercase tracking-wider">SYSTEM RECOVERY</div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">Hydrate & Sleep. Prepare for next cycle.</div>
              </div>
            </>
          )}

          <div className="border border-primary/20 bg-primary/5 p-3 text-center mt-8">
            <div className="font-bold text-sm uppercase tracking-widest text-primary">{focusLine}</div>
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
              onClick={() => {["REST", "ACTIVE_RECOVERY", "SYSTEM_RESET"].includes(dayType) ? setShowCheckin(true) : setLocation('/workouts')}}
              data-testid="button-open-rebuild-log"
              className="w-full rounded-none bg-yellow-400 text-black hover:bg-yellow-300 font-bold uppercase tracking-widest h-12 shadow-[0_0_20px_rgba(250,204,21,0.18)]"
            >
              {["REST", "ACTIVE_RECOVERY", "SYSTEM_RESET"].includes(dayType) ? "OPEN REBUILD LOG" : "BEGIN REPAIR PROTOCOL (WORKOUTS)"}
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
                ? "SYSTEM LOCKED IN"
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
              onClick={() => {["REST", "ACTIVE_RECOVERY", "SYSTEM_RESET"].includes(dayType) ? setShowCheckin(true) : setLocation('/workouts')}}
              data-testid="button-execute-day"
              className={`w-full h-16 rounded-none font-black uppercase tracking-[0.2em] text-base border-2 ${
                isRebuilding
                  ? "bg-yellow-400 text-black hover:bg-yellow-500 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.2)]"
                  : isBreached
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive shadow-[0_0_30px_rgba(255,0,0,0.2)]"
                    : "bg-primary text-black hover:bg-primary/90 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.2)]"
              }`}
            >
              {isBreached ? "INITIATE REPAIR SEQUENCE" : (["REST", "ACTIVE_RECOVERY", "SYSTEM_RESET"].includes(dayType) ? "LOG RECOVERY COMPLIANCE" : "ENTER TRAINING PROTOCOL")}
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
            <div className="w-20 h-20 bg-primary/10 rounded-none flex items-center justify-center border border-primary/30 mb-2 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-none"></div>
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
