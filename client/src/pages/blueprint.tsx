import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Flame, Target, Trophy, Clock, CheckCircle2, Circle } from "lucide-react";
import transformImg from "@/assets/transformation-placeholder.png";

export default function Blueprint() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-primary font-display font-medium tracking-widest text-xs mb-2">PHASE 1: FOUNDATION</div>
          <h1 className="text-4xl font-bold text-glow">COMMAND CENTER</h1>
        </div>
        <div className="flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-lg border border-white/5">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-display font-bold">12 DAY STREAK</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Action */}
          <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> TODAY'S PROTOCOL
              </h2>
              <span className="text-sm text-muted-foreground">Week 3 / Day 2</span>
            </div>

            <div className="bg-secondary/80 border border-white/5 rounded-xl p-5 mb-4 hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Upper Body Power (Push/Pull)</h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-3">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 65 Min</span>
                <span className="flex items-center gap-1"><DumbbellIcon /> Heavy Compounds</span>
              </p>
            </div>

            <div className="space-y-3">
              <TaskItem text="Log Morning Fasted Weight" completed={true} />
              <TaskItem text="Complete Lifting Session" completed={false} />
              <TaskItem text="Hit Protein Target (180g)" completed={false} />
            </div>
          </section>

          {/* Progress Overview */}
          <section className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">CURRENT METRICS</h2>
              <Button variant="ghost" size="sm" className="text-primary h-8">Update</Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox label="BODYWEIGHT" value="174.5" unit="lbs" trend="+1.2" />
              <MetricBox label="EST. FAT" value="14" unit="%" trend="-0.5" positive={true} />
              <MetricBox label="BENCH PR" value="225" unit="lbs" trend="+5.0" positive={true} />
              <MetricBox label="SQUAT PR" value="315" unit="lbs" trend="+10.0" positive={true} />
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Phase Progress */}
          <section className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-display font-bold mb-4">PHASE PROGRESS</h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-bold text-primary">25%</span>
            </div>
            <Progress value={25} className="h-2 mb-6" />
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="mt-1"><Trophy className="w-5 h-5 text-primary" /></div>
                <div>
                  <h4 className="font-bold text-sm">Next Milestone</h4>
                  <p className="text-xs text-muted-foreground">Hit 150g protein consistently for 14 days.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Vision/Why */}
          <section className="rounded-2xl overflow-hidden relative border border-white/10 group">
            <img 
              src={transformImg} 
              alt="Goal Physique" 
              className="w-full h-64 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="text-xs font-display text-primary tracking-widest mb-1">THE VISION</div>
              <h3 className="font-bold text-lg leading-tight text-glow">REMEMBER WHY YOU STARTED</h3>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}

function TaskItem({ text, completed }: { text: string, completed: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${completed ? 'bg-primary/5 border-primary/20 text-muted-foreground' : 'bg-secondary/30 border-white/5 hover:border-white/10'}`}>
      {completed ? (
        <CheckCircle2 className="w-5 h-5 text-primary" />
      ) : (
        <Circle className="w-5 h-5 text-muted-foreground" />
      )}
      <span className={completed ? "line-through opacity-70" : "font-medium"}>{text}</span>
    </div>
  );
}

function MetricBox({ label, value, unit, trend, positive = false }: { label: string, value: string, unit: string, trend: string, positive?: boolean }) {
  return (
    <div className="bg-secondary/50 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
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
