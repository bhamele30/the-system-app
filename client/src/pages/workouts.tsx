import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Zap, ChevronRight, PlayCircle, CheckCircle2, ArrowLeft, TrendingUp, ShieldAlert, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useSystem } from "@/hooks/use-system";
import { Input } from "@/components/ui/input";

const CHALLENGE_WORKOUTS = [
  {
    id: "challenge-day-1",
    title: "Day 1: Upper Power",
    description: "Heavy compound pulling and pushing for upper body density.",
    duration: "60-75 min",
    intensity: "High",
    exercises: [
      { name: "Incline Dumbbell Press", sets: "4", reps: "6-10" },
      { name: "Weighted Pull-Ups", sets: "4", reps: "6-10" },
      { name: "Machine Shoulder Press", sets: "4", reps: "8-12" },
      { name: "Chest Supported Row", sets: "4", reps: "8-10" },
      { name: "Incline Dumbbell Curl", sets: "3", reps: "10-12" },
      { name: "Rope Pushdowns", sets: "3", reps: "12-15" },
      { name: "Cable Lateral Raises", sets: "3", reps: "15" }
    ]
  },
  {
    id: "challenge-day-2",
    title: "Day 2: Lower Body",
    description: "Foundational leg strength focusing on quads, hamstrings, and calves.",
    duration: "60-75 min",
    intensity: "Extreme",
    exercises: [
      { name: "Hack Squat or Pendulum", sets: "4", reps: "8-10" },
      { name: "Romanian Deadlift", sets: "4", reps: "8-10" },
      { name: "Leg Press", sets: "3", reps: "12-15" },
      { name: "Walking Lunges", sets: "3", reps: "10/leg" },
      { name: "Leg Curl", sets: "4", reps: "12-15" },
      { name: "Leg Extensions", sets: "3", reps: "15" },
      { name: "Standing Calves", sets: "4", reps: "15-20" }
    ]
  },
  {
    id: "challenge-day-3",
    title: "Day 3: Active Recovery",
    description: "Low-intensity movement to promote blood flow, tissue repair, and core strength.",
    duration: "45-60 min",
    intensity: "Low",
    exercises: [
      { name: "Incline Walk", sets: "1", reps: "20-30 mins" },
      { name: "Hanging Leg Raises", sets: "3", reps: "Failure" },
      { name: "Cable Crunches", sets: "3", reps: "15-20" },
      { name: "Planks", sets: "3", reps: "60s" },
      { name: "Mobility/Stretching", sets: "1", reps: "10-15 mins" }
    ]
  },
  {
    id: "challenge-day-4",
    title: "Day 4: Push",
    description: "Volume-focused pushing movements for chest, shoulders, and triceps.",
    duration: "60-75 min",
    intensity: "High",
    exercises: [
      { name: "Flat Machine Press", sets: "4", reps: "10-12" },
      { name: "Incline Smith Press", sets: "4", reps: "8-10" },
      { name: "Cable Fly", sets: "3", reps: "12-15" },
      { name: "Machine Shoulder Press", sets: "3", reps: "10-12" },
      { name: "Cable Lateral Raises", sets: "4", reps: "15" },
      { name: "Rope Pushdowns", sets: "4", reps: "12-15" },
      { name: "Overhead Cable Extensions", sets: "4", reps: "10-12" }
    ]
  },
  {
    id: "challenge-day-5",
    title: "Day 5: Pull",
    description: "Volume-focused pulling movements for back width and biceps.",
    duration: "60-75 min",
    intensity: "High",
    exercises: [
      { name: "Pull-Ups or Lat Pulldown", sets: "4", reps: "8-12" },
      { name: "Chest Supported Row", sets: "4", reps: "10" },
      { name: "Seated Cable Row", sets: "3", reps: "12" },
      { name: "Cable Lat Prayer Pulldown", sets: "3", reps: "12-15" },
      { name: "Rear Delt Fly", sets: "4", reps: "15" },
      { name: "EZ Bar Curl", sets: "4", reps: "8-10" },
      { name: "Hammer Curl", sets: "3", reps: "12" }
    ]
  },
  {
    id: "challenge-day-6",
    title: "Day 6: Legs + Conditioning",
    description: "Hypertrophy leg focus followed by intense conditioning.",
    duration: "60-75 min",
    intensity: "Extreme",
    exercises: [
      { name: "Front Squat or Hack Squat", sets: "4", reps: "8" },
      { name: "Romanian Deadlift", sets: "3", reps: "10" },
      { name: "Bulgarian Split Squat", sets: "3", reps: "10/leg" },
      { name: "Leg Curl", sets: "3", reps: "15" },
      { name: "Calves", sets: "4", reps: "15-20" },
      { name: "Conditioning (Incline Walk/Sled/Stairs)", sets: "1", reps: "15-20 mins" }
    ]
  },
  {
    id: "challenge-day-7",
    title: "Day 7: System Reset",
    description: "Total recovery. Focus on meal prep, hydration, sleep, and planning the next week.",
    duration: "Flexible",
    intensity: "Rest",
    exercises: [
      { name: "Light Walk / Stretching", sets: "1", reps: "20-30 mins" },
      { name: "Meal Prep", sets: "1", reps: "Complete" },
      { name: "Progress Review", sets: "1", reps: "Complete" }
    ]
  }
];

const WORKOUT_PLANS = [
  {
    id: "p2-push",
    title: "Push (Phase 2)",
    description: "Heavy compound pushing movements focused on chest and triceps density.",
    duration: "60-75 min",
    intensity: "High",
    exercises: [
      { name: "Incline Barbell Bench Press", sets: "4", reps: "6-8" },
      { name: "Flat Dumbbell Press", sets: "3", reps: "8-10" },
      { name: "Cable Crossovers", sets: "3", reps: "12-15" },
      { name: "Overhead Tricep Extension", sets: "4", reps: "10-12" },
      { name: "Tricep Rope Pushdowns", sets: "3", reps: "12-15" },
    ]
  },
  {
    id: "p2-pull",
    title: "Pull (Phase 2)",
    description: "Vertical and horizontal pulling to build back width and bicep peaks.",
    duration: "60-75 min",
    intensity: "High",
    exercises: [
      { name: "Weighted Pull Ups", sets: "4", reps: "6-8" },
      { name: "Barbell Rows", sets: "4", reps: "8-10" },
      { name: "Lat Pulldowns", sets: "3", reps: "10-12" },
      { name: "Barbell Bicep Curls", sets: "4", reps: "8-10" },
      { name: "Hammer Curls", sets: "3", reps: "12-15" },
    ]
  },
  {
    id: "p2-legs",
    title: "Legs (Phase 2)",
    description: "Heavy leg foundation focusing on squat patterns and posterior chain.",
    duration: "60-75 min",
    intensity: "Extreme",
    exercises: [
      { name: "Barbell Back Squats", sets: "4", reps: "6-8" },
      { name: "Romanian Deadlifts", sets: "4", reps: "8-10" },
      { name: "Leg Press", sets: "3", reps: "10-12" },
      { name: "Leg Extensions", sets: "3", reps: "12-15" },
      { name: "Calf Raises", sets: "4", reps: "15-20" },
    ]
  },
  {
    id: "p2-full-body",
    title: "Full Body Power (Phase 2)",
    description: "Heavy compound movements hitting the entire system for maximum density.",
    duration: "65-75 min",
    intensity: "Extreme",
    exercises: [
      { name: "Barbell Bench Press", sets: "4", reps: "5-8" },
      { name: "Bent Over Rows", sets: "4", reps: "8-10" },
      { name: "Front Squats", sets: "4", reps: "6-8" },
      { name: "Overhead Press", sets: "3", reps: "8-10" },
      { name: "Pull Ups", sets: "3", reps: "Failure" },
    ]
  },
  {
    id: "active-recovery-p2",
    title: "Active Recovery",
    description: "Low-intensity movement to promote blood flow and tissue repair.",
    duration: "45 min",
    intensity: "Low",
    exercises: [
      { name: "Zone 2 Cardio (Bike/Walk)", sets: "1", reps: "30 mins" },
      { name: "Dynamic Stretching", sets: "1", reps: "10 mins" },
      { name: "Foam Rolling", sets: "1", reps: "5 mins" }
    ]
  }
];

import { compressImage } from "@/lib/image-utils";

export default function Workouts() {
  const { state, logExerciseWeight, submitDay } = useSystem();
  const [activeWorkout, setActiveWorkout] = useState<typeof WORKOUT_PLANS[0] | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [activeWeights, setActiveWeights] = useState<Record<string, string>>({});
  
  const [showCheckin, setShowCheckin] = useState(false);
  const [checks, setChecks] = useState<{train: boolean | null, nutrition: boolean | null, recovery: boolean | null}>({ train: null, nutrition: null, recovery: null });
  const [error, setError] = useState("");
  const [weightLog, setWeightLog] = useState<string | null>(null);

  const isRebuilding = state.recoveryState === "rebuilding";
  const modalTitle = isRebuilding ? "LOG REBUILD EXECUTION" : "DID YOU EXECUTE";

  const toggleSet = (exerciseName: string, setIndex: number) => {
    const key = `${exerciseName}-${setIndex}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleWeightChange = (exerciseName: string, weight: string) => {
    setActiveWeights(prev => ({ ...prev, [exerciseName]: weight }));
  };

  const finishWorkout = () => {
    // Log weights for any exercises where the user entered a weight
    Object.entries(activeWeights).forEach(([exerciseName, weight]) => {
      if (weight.trim()) {
        logExerciseWeight(exerciseName, weight);
      }
    });

    // Instead of completing immediately, open the daily execution check-in
    setShowCheckin(true);
  };

  const handleCheckinSubmit = () => {
    if (checks.train === null || checks.nutrition === null || checks.recovery === null) {
      setError("YOU MUST REPORT ALL METRICS TO LOG EXECUTION.");
      return;
    }
    
    setError("");

    // Use entered weight
    const weightAmount = weightLog || Math.floor(Math.random() * (205 - 190 + 1) + 190).toString();
    const mockProof = {
      gymPic: "",
      weightLog: weightAmount.toString(),
      mealPic: ""
    };

    const result = submitDay(checks.train, checks.nutrition, checks.recovery, mockProof);
    setShowCheckin(false);
    
    setChecks({ train: null, nutrition: null, recovery: null });
    setActiveWorkout(null);
    setCompletedSets({});
    setActiveWeights({});
    setWeightLog(null);
    
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

  if (activeWorkout) {
    return (
      <div className="p-6 md:p-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button 
          variant="ghost" 
          onClick={() => setActiveWorkout(null)}
          className="mb-6 -ml-4 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Button>

        <header className="mb-8">
          <div className="text-primary font-display font-medium tracking-widest text-xs mb-2 uppercase">Active Session</div>
          <h1 className="text-4xl font-bold text-glow">{activeWorkout.title}</h1>
        </header>

        <div className="space-y-8">
          {activeWorkout.exercises.map((ex, i) => {
            const previousLogs = state.exerciseLogs?.[ex.name] || [];
            const lastLoggedWeight = previousLogs.length > 0 ? previousLogs[previousLogs.length - 1].weight : null;

            return (
              <section key={i} className="glass-panel p-6 rounded-none border-white/5 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {ex.name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] font-display uppercase tracking-widest">
                        {ex.sets} Sets × {ex.reps}
                      </Badge>
                      {lastLoggedWeight && (
                        <Badge variant="secondary" className="text-[10px] font-display uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
                          <TrendingUp className="w-3 h-3 mr-1 inline" /> Last: {lastLoggedWeight} lbs
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-32 flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder={lastLoggedWeight ? "Weight (lbs)" : "Log weight"} 
                      className="h-10 bg-black/50 border-white/10 focus-visible:ring-primary focus-visible:border-primary font-display text-center"
                      value={activeWeights[ex.name] || ""}
                      onChange={(e) => handleWeightChange(ex.name, e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {Array.from({ length: parseInt(ex.sets) }).map((_, setIdx) => {
                    const isDone = completedSets[`${ex.name}-${setIdx}`];
                    return (
                      <button
                        key={setIdx}
                        onClick={() => toggleSet(ex.name, setIdx)}
                        className={`h-12 rounded-none border font-display text-sm transition-all duration-200 ${
                          isDone 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-secondary/50 border-white/5 hover:border-primary/50"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : setIdx + 1}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <Button 
          onClick={finishWorkout}
          className="w-full mt-12 py-8 font-display font-bold uppercase tracking-widest text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
        >
          Complete Workout & Log Progress
        </Button>

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

                <div className="mt-4 p-4 border border-white/10 bg-black/40 space-y-4">
                  <h4 className="text-primary text-xs uppercase tracking-[0.2em] font-bold">DAILY METRICS</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className={`border ${weightLog ? "border-primary bg-primary/10" : "border-white/10 bg-white/5"} flex flex-col items-center justify-center py-4 px-1 hover:bg-white/10 transition-colors text-center relative overflow-hidden group`}>
                      <div className="pointer-events-none flex flex-col items-center w-full">
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚖️</span>
                      </div>
                      <input
                        type="number"
                        placeholder="ENTER WEIGHT LBS"
                        className={`w-full bg-transparent text-center text-xs uppercase tracking-wider outline-none font-bold relative z-50 ${weightLog ? "text-primary" : "text-muted-foreground"}`}
                        value={weightLog || ""}
                        onChange={(e) => setWeightLog(e.target.value)}
                      />
                    </div>
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
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10">
        <div className="text-primary font-display font-medium tracking-widest text-xs mb-2 uppercase">Training Library</div>
        <h1 className="text-4xl font-bold text-glow">WORKOUT PLANS</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          The exact lifting protocols required to build an unbreakable frame. Focus on progressive overload and perfect form. Do not deviate.
        </p>
      </header>

      {/* 30 Day Challenge Section */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between border-b border-primary/20 pb-2">
          <h2 className="text-2xl font-bold font-display uppercase tracking-widest text-primary flex items-center gap-2">
            <ShieldAlert className="w-6 h-6" /> 30 Day Lock In Challenge
          </h2>
          <Badge variant="outline" className="border-primary/50 text-primary">5-DAY SPLIT</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          The foundational 5-day training split designed for lean muscle, athletic aesthetics, and consistency. No junk volume. No ego lifting.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGE_WORKOUTS.map((plan) => (
            <Card key={plan.id} className="glass-panel overflow-hidden border-white/5 hover:border-primary/30 transition-all group bg-black/50">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-none text-primary">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="bg-secondary/50 text-[10px] font-display uppercase tracking-wider">
                    {plan.intensity}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors uppercase tracking-wide">{plan.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[32px]">
                  {plan.description}
                </p>

                <div className="flex gap-4 mb-4 text-[10px] text-muted-foreground tracking-widest uppercase font-bold">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-primary" /> {plan.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" /> {plan.exercises.length} Exercises
                  </span>
                </div>

                <div className="space-y-2 mb-6 border-t border-white/5 pt-4">
                  {plan.exercises.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex justify-between text-xs py-1">
                      <span className="text-foreground/70 truncate pr-2">{ex.name}</span>
                      <span className="font-display text-primary whitespace-nowrap">{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                  {plan.exercises.length > 3 && (
                    <div className="text-[10px] text-muted-foreground text-center pt-2 italic">
                      + {plan.exercises.length - 3} more exercises
                    </div>
                  )}
                </div>

                <Button 
                  onClick={() => setActiveWorkout(plan as any)}
                  className="w-full font-display uppercase tracking-widest text-xs py-5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300 shadow-[0_0_0px_hsl(var(--primary)/0)] hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] rounded-none"
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> Start Session
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Standard Library Section */}
      <section>
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xl font-bold font-display uppercase tracking-widest flex items-center gap-2">
            The Library
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WORKOUT_PLANS.map((plan) => (
            <Card key={plan.id} className="glass-panel overflow-hidden border-white/5 hover:border-white/20 transition-all group opacity-80 hover:opacity-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-secondary rounded-none">
                    <Dumbbell className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                  </div>
                  <Badge variant="secondary" className="bg-secondary/50 text-[10px] font-display uppercase tracking-wider text-muted-foreground">
                    {plan.intensity}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors text-foreground/80">{plan.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {plan.description}
                </p>

                <div className="flex gap-4 mb-4 text-[10px] text-muted-foreground tracking-widest uppercase">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {plan.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {plan.exercises.length} Exercises
                  </span>
                </div>

                <div className="space-y-2 mb-6 border-t border-white/5 pt-4">
                  {plan.exercises.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex justify-between text-xs py-1">
                      <span className="text-muted-foreground truncate pr-2">{ex.name}</span>
                      <span className="font-display text-muted-foreground whitespace-nowrap">{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setActiveWorkout(plan as any)}
                  className="w-full font-display uppercase tracking-widest text-xs py-5 bg-secondary hover:bg-white hover:text-black border border-white/10 transition-all duration-300 rounded-none text-muted-foreground"
                >
                  <PlayCircle className="w-4 h-4 mr-2" /> Start Workout
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

