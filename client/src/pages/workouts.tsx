import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Zap, ChevronRight, PlayCircle, CheckCircle2, ArrowLeft, TrendingUp, ShieldAlert, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useSystem } from "@/hooks/use-system";
import { Input } from "@/components/ui/input";

const WORKOUT_PLANS = [
  {
    id: "chest-triceps",
    title: "Push: Chest & Triceps",
    description: "Heavy compound pushing movements focused on chest and triceps development.",
    duration: "60 min",
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
    id: "back-biceps",
    title: "Pull: Back & Biceps",
    description: "Vertical and horizontal pulling to build back width and bicep peaks.",
    duration: "65 min",
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
    id: "shoulders-legs",
    title: "Shoulders & Legs",
    description: "Lower body foundation combined with shoulder pressing.",
    duration: "75 min",
    intensity: "Extreme",
    exercises: [
      { name: "Barbell Back Squats", sets: "4", reps: "6-8" },
      { name: "Romanian Deadlifts", sets: "4", reps: "8-10" },
      { name: "Leg Extensions", sets: "3", reps: "12-15" },
      { name: "Seated Dumbbell Press", sets: "4", reps: "8-10" },
      { name: "Lateral Raises", sets: "4", reps: "15-20" },
    ]
  },
  {
    id: "strict-arms",
    title: "Strict Arms",
    description: "Dedicated arm day for maximum isolation and pump.",
    duration: "45 min",
    intensity: "Medium",
    exercises: [
      { name: "Close Grip Bench Press", sets: "4", reps: "8-10" },
      { name: "Preacher Curls", sets: "4", reps: "10-12" },
      { name: "Skull Crushers", sets: "4", reps: "12-15" },
      { name: "Incline Dumbbell Curls", sets: "4", reps: "10-12" },
    ]
  },
  {
    id: "upper-power",
    title: "Upper Body Power (Phase 2)",
    description: "Heavy compound movements for maximum strength and density.",
    duration: "65 min",
    intensity: "High",
    exercises: [
      { name: "Barbell Bench Press", sets: "4", reps: "5-8" },
      { name: "Bent Over Rows", sets: "4", reps: "8-10" },
      { name: "Overhead Press", sets: "3", reps: "8-10" },
      { name: "Pull Ups", sets: "3", reps: "Failure" },
    ]
  },
  {
    id: "lower-power",
    title: "Lower Body Power (Phase 2)",
    description: "Foundational leg strength focusing on the posterior chain.",
    duration: "70 min",
    intensity: "Extreme",
    exercises: [
      { name: "Back Squats", sets: "5", reps: "5" },
      { name: "Romanian Deadlifts", sets: "4", reps: "10-12" },
      { name: "Leg Press", sets: "3", reps: "12-15" },
      { name: "Calf Raises", sets: "4", reps: "15-20" },
    ]
  },
  {
    id: "active-recovery",
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

export default function Workouts() {
  const { state, logExerciseWeight, submitDay } = useSystem();
  const [activeWorkout, setActiveWorkout] = useState<typeof WORKOUT_PLANS[0] | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [activeWeights, setActiveWeights] = useState<Record<string, string>>({});
  
  const [showCheckin, setShowCheckin] = useState(false);
  const [checks, setChecks] = useState<{train: boolean | null, nutrition: boolean | null, recovery: boolean | null}>({ train: null, nutrition: null, recovery: null });
  const [error, setError] = useState("");

  const isRebuilding = state.recoveryState === "rebuilding";
  const modalTitle = isRebuilding ? "LOG REBUILD EXECUTION" : "DID YOU EXECUTE";

  const handleCheckinSubmit = () => {
    if (checks.train === null || checks.nutrition === null || checks.recovery === null) {
      setError("YOU MUST REPORT ALL METRICS TO LOG EXECUTION.");
      return;
    }
    
    setError("");
    const result = submitDay(checks.train, checks.nutrition, checks.recovery);
    setShowCheckin(false);
    
    setChecks({ train: null, nutrition: null, recovery: null });
    setActiveWorkout(null);
    setCompletedSets({});
    setActiveWeights({});
    
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKOUT_PLANS.map((plan) => (
          <Card key={plan.id} className="glass-panel overflow-hidden border-white/5 hover:border-primary/30 transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-none text-primary">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="bg-secondary/50 text-[10px] font-display uppercase tracking-wider">
                  {plan.intensity}
                </Badge>
              </div>
              
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{plan.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                {plan.description}
              </p>

              <div className="flex gap-4 mb-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {plan.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {plan.exercises.length} Exercises
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {plan.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                    <span className="text-foreground/80">{ex.name}</span>
                    <span className="font-display text-primary text-xs">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => setActiveWorkout(plan)}
                className="w-full font-display uppercase tracking-widest text-xs py-6 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300 shadow-[0_0_0px_hsl(var(--primary)/0)] hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 mr-2" /> Start Workout
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

