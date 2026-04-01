import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dumbbell, Utensils, Bed, Target, Zap, Clock, CalendarDays, Crosshair } from "lucide-react";
import { useSystem } from "@/hooks/use-system";

export default function Home() {
  const { state, submitDay } = useSystem();
  const [dayType, setDayType] = useState<"PUSH" | "PULL" | "LEGS" | "REST">("PUSH");
  const [focusLine, setFocusLine] = useState("");
  const [showCheckin, setShowCheckin] = useState(false);
  const [checks, setChecks] = useState({ train: false, nutrition: false, recovery: false });

  // Generate daily protocol based on system execution logic
  useEffect(() => {
    // Simple cycle based on day of year for demo purposes
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const cycle = ["PUSH", "PULL", "LEGS", "REST"][dayOfYear % 4] as any;
    setDayType(cycle);

    const focusLines = ["Execute.", "No negotiation.", "Stay consistent.", "Repeat.", "No thinking."];
    setFocusLine(focusLines[Math.floor(Math.random() * focusLines.length)]);
  }, []);

  const getWorkout = () => {
    if (dayType === "PUSH") return "Chest & Triceps";
    if (dayType === "PULL") return "Back & Biceps";
    if (dayType === "LEGS") return "Shoulders & Legs";
    return "Active Recovery";
  };

  const handleCheckinSubmit = () => {
    submitDay(checks.train, checks.nutrition, checks.recovery);
    setShowCheckin(false);
  };

  const isTodayCompleted = state.lastCompletedDate === new Date().toISOString().split('T')[0];
  const systemScore = state.totalDays > 0 ? Math.round((state.completedDays / state.totalDays) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6 font-mono text-sm md:pl-20">
      
      {/* Top Bar Stats */}
      <div className="w-full max-w-md flex justify-between items-center mb-12 border-b border-primary/20 pb-4">
        <div className="flex flex-col">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">System Score</span>
          <span className="text-xl font-bold text-primary">{systemScore}%</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Active Streak</span>
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
        </div>

        {/* Protocol Sections */}
        <Card className="bg-black/50 border-white/10 p-5 space-y-6 rounded-none relative overflow-hidden">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
              <Dumbbell className="w-3 h-3" /> Train
            </div>
            <div className="font-bold text-lg">{getWorkout()}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
              <Utensils className="w-3 h-3" /> Nutrition
            </div>
            <ul className="text-muted-foreground space-y-1">
              <li>- Protein priority</li>
              <li>- Moderate carbs</li>
              <li>- No excess calories</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary uppercase tracking-widest text-[10px] border-b border-white/5 pb-2">
              <Bed className="w-3 h-3" /> Recovery
            </div>
            <ul className="text-muted-foreground space-y-1">
              <li>- Walk 20 minutes</li>
              <li>- Sleep 7-8 hours</li>
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 text-center mt-6">
            <div className="text-[10px] text-primary uppercase tracking-widest mb-1 flex justify-center items-center gap-1">
              <Target className="w-3 h-3" /> Focus
            </div>
            <div className="font-bold text-xl uppercase tracking-widest text-glow">{focusLine}</div>
          </div>
        </Card>

        {isTodayCompleted ? (
          <div className="w-full py-4 text-center border border-white/10 bg-white/5 text-muted-foreground uppercase tracking-widest text-xs">
            Day Locked. See you tomorrow.
          </div>
        ) : (
          <Button 
            onClick={() => setShowCheckin(true)}
            className="w-full h-14 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-widest text-sm"
          >
            Complete Day
          </Button>
        )}

      </main>

      {/* Check-in Modal */}
      <Dialog open={showCheckin} onOpenChange={setShowCheckin}>
        <DialogContent className="bg-black border-primary/20 rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono uppercase tracking-widest text-xl text-center border-b border-white/10 pb-4 mb-4 text-glow">
              DID YOU EXECUTE?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-3 bg-white/5 p-4 border border-white/5">
              <Checkbox 
                id="check-train" 
                checked={checks.train} 
                onCheckedChange={(c) => setChecks(p => ({...p, train: c as boolean}))} 
                className="w-6 h-6 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black rounded-none"
              />
              <Label htmlFor="check-train" className="font-mono text-base uppercase cursor-pointer">Training Protocol</Label>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/5 p-4 border border-white/5">
              <Checkbox 
                id="check-nut" 
                checked={checks.nutrition} 
                onCheckedChange={(c) => setChecks(p => ({...p, nutrition: c as boolean}))} 
                className="w-6 h-6 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black rounded-none"
              />
              <Label htmlFor="check-nut" className="font-mono text-base uppercase cursor-pointer">Nutrition Ruleset</Label>
            </div>

            <div className="flex items-center space-x-3 bg-white/5 p-4 border border-white/5">
              <Checkbox 
                id="check-rec" 
                checked={checks.recovery} 
                onCheckedChange={(c) => setChecks(p => ({...p, recovery: c as boolean}))} 
                className="w-6 h-6 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black rounded-none"
              />
              <Label htmlFor="check-rec" className="font-mono text-base uppercase cursor-pointer">Recovery Baseline</Label>
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

    </div>
  );
}
