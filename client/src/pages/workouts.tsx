import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, Zap, ChevronRight, PlayCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const WORKOUT_PLANS = [
  {
    id: "upper-power",
    title: "Upper Body Power",
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
    title: "Lower Body Power",
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
    id: "push-hypertrophy",
    title: "Push Hypertrophy",
    description: "High volume chest, shoulders, and triceps isolation.",
    duration: "60 min",
    intensity: "Medium-High",
    exercises: [
      { name: "Incline DB Press", sets: "3", reps: "10-12" },
      { name: "Lateral Raises", sets: "4", reps: "15-20" },
      { name: "Cable Flyes", sets: "3", reps: "12-15" },
      { name: "Tricep Pushdowns", sets: "3", reps: "12-15" },
    ]
  }
];

export default function Workouts() {
  const [activeWorkout, setActiveWorkout] = useState<typeof WORKOUT_PLANS[0] | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  const toggleSet = (exerciseName: string, setIndex: number) => {
    const key = `${exerciseName}-${setIndex}`;
    setCompletedSets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const finishWorkout = () => {
    toast({
      title: "Workout Complete!",
      description: `Great job finishing ${activeWorkout?.title}. Progression logged.`,
    });
    setActiveWorkout(null);
    setCompletedSets({});
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
          {activeWorkout.exercises.map((ex, i) => (
            <section key={i} className="glass-panel p-6 rounded-2xl border-white/5">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                {ex.name}
                <Badge variant="outline" className="text-[10px] font-display uppercase tracking-widest">
                  {ex.sets} Sets × {ex.reps}
                </Badge>
              </h3>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {Array.from({ length: parseInt(ex.sets) }).map((_, setIdx) => {
                  const isDone = completedSets[`${ex.name}-${setIdx}`];
                  return (
                    <button
                      key={setIdx}
                      onClick={() => toggleSet(ex.name, setIdx)}
                      className={`h-12 rounded-lg border font-display text-sm transition-all duration-200 ${
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
          ))}
        </div>

        <Button 
          onClick={finishWorkout}
          className="w-full mt-12 py-8 font-display font-bold uppercase tracking-widest text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
        >
          Complete Workout & Log Progress
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10">
        <div className="text-primary font-display font-medium tracking-widest text-xs mb-2 uppercase">Training Library</div>
        <h1 className="text-4xl font-bold text-glow">WORKOUT PLANS</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          The exact lifting protocols used in the 3-year blueprint. Focus on progressive overload and perfect form.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORKOUT_PLANS.map((plan) => (
          <Card key={plan.id} className="glass-panel overflow-hidden border-white/5 hover:border-primary/30 transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
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

