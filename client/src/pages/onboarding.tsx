import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useSystem } from "@/hooks/use-system";
import { Crosshair, ShieldCheck, Target, Activity, ChevronRight, User } from "lucide-react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { setMode } = useSystem();
  
  const [step, setStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<"lock-in" | "cut" | "build" | null>(null);
  
  // Step 1: Body Profile
  const [profile, setProfile] = useState({
    age: 30,
    sex: "M",
    height: 70, // inches
    weight: 185,
    bf: 15,
    waist: 32,
    activity: "active",
    trainingDays: 4
  });
  
  // Step 2: Performance Profile
  const [performance, setPerformance] = useState({
    bench: "",
    squat: "",
    deadlift: "",
    cardio: "moderate",
    experience: "1-3 years"
  });
  
  const [processingState, setProcessingState] = useState(0);

  useEffect(() => {
    if (step === 5) {
      // Fake processing animation
      const timer1 = setTimeout(() => setProcessingState(1), 800);
      const timer2 = setTimeout(() => setProcessingState(2), 1800);
      const timer3 = setTimeout(() => setProcessingState(3), 2800);
      const timer4 = setTimeout(() => setStep(6), 4000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); }
    }
  }, [step]);

  // Calculate classification
  const getClassification = () => {
    const bw = profile.weight || 1;
    const b = parseInt(performance.bench) || 0;
    const s = parseInt(performance.squat) || 0;
    const d = parseInt(performance.deadlift) || 0;
    
    if (!b || !s) return "Uncalibrated";
    
    let score = 0;
    if (d) {
      score = (b + s + d) / bw;
      if (score < 2.5) return "Beginner";
      if (score < 3.5) return "Intermediate";
      if (score < 4.5) return "Advanced";
      return "Elite";
    } else {
      score = (b + s) / bw;
      if (score < 1.5) return "Beginner";
      if (score < 2.2) return "Intermediate";
      if (score < 3.0) return "Advanced";
      return "Elite";
    }
  };

  const classification = getClassification();

  const handleNext = () => {
    if (step === 1 && (!profile.weight || !profile.height)) return;
    if (step === 2 && (!performance.bench || !performance.squat)) return;
    if (step === 3 && !selectedMode) return;
    
    setStep(s => s + 1);
  };

  const handleFinish = () => {
    if (selectedMode) {
      setMode(selectedMode);
    }
    setLocation("/");
  };

  const formatHeight = (inches: number) => {
    const ft = Math.floor(inches / 12);
    const inRem = inches % 12;
    return `${ft}'${inRem}"`;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-mono relative overflow-hidden">
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-black to-black pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="max-w-xl w-full relative z-10 py-12">
        
        {step === 0 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-center">
            <div className="w-20 h-20 mx-auto border border-primary/30 flex items-center justify-center bg-primary/5 text-primary mb-8 relative">
                <div className="absolute inset-0 border border-primary animate-pulse opacity-50"></div>
                <Activity className="w-10 h-10" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-primary text-sm tracking-[0.3em] font-bold">SYSTEM INITIATION</h2>
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-glow leading-tight">
                SYSTEM<br/>CALIBRATION
              </h1>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto text-sm">
              You are not here for motivation. You are here to build a personalized performance system. Data input is required to calibrate your protocols.
            </p>

            <Button 
              onClick={() => setStep(1)}
              className="w-full h-16 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.3em] text-sm border border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all mt-10"
            >
              COMMENCE CALIBRATION
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <h2 className="text-primary text-xs tracking-[0.2em] font-bold">STEP 1/3</h2>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">BODY PROFILE</span>
            </div>

            <div className="space-y-8">
              {/* Sex & Age */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                    Sex <span className="text-primary font-bold">{profile.sex}</span>
                  </label>
                  <div className="flex border border-white/10">
                    <button 
                      onClick={() => setProfile({...profile, sex: "M"})}
                      className={`flex-1 py-3 text-sm font-bold transition-colors ${profile.sex === "M" ? "bg-primary/20 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-white/5"}`}
                    >M</button>
                    <button 
                      onClick={() => setProfile({...profile, sex: "F"})}
                      className={`flex-1 py-3 text-sm font-bold transition-colors ${profile.sex === "F" ? "bg-primary/20 text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-white/5"}`}
                    >F</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                    Age <span className="text-primary font-bold">{profile.age} yrs</span>
                  </label>
                  <div className="pt-3 pb-2">
                    <Slider 
                      value={[profile.age]} 
                      min={18} max={80} step={1}
                      onValueChange={([val]) => setProfile({...profile, age: val})}
                    />
                  </div>
                </div>
              </div>

              {/* Height & Weight */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                    Height <span className="text-primary font-bold">{formatHeight(profile.height)}</span>
                  </label>
                  <div className="pt-3 pb-2">
                    <Slider 
                      value={[profile.height]} 
                      min={60} max={84} step={1}
                      onValueChange={([val]) => setProfile({...profile, height: val})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                    Weight <span className="text-primary font-bold">{profile.weight} lbs</span>
                  </label>
                  <Input 
                    type="number" 
                    value={profile.weight}
                    onChange={e => setProfile({...profile, weight: parseInt(e.target.value) || 0})}
                    className="bg-black/50 border-white/10 h-10 text-center font-bold font-mono focus-visible:ring-primary rounded-none"
                  />
                </div>
              </div>

              {/* BF% & Waist */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                    Est. Body Fat <span className="text-primary font-bold">{profile.bf}%</span>
                  </label>
                  <div className="pt-3 pb-2">
                    <Slider 
                      value={[profile.bf]} 
                      min={5} max={40} step={1}
                      onValueChange={([val]) => setProfile({...profile, bf: val})}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                    Waist <span className="text-primary font-bold">{profile.waist}"</span>
                  </label>
                  <div className="pt-3 pb-2">
                    <Slider 
                      value={[profile.waist]} 
                      min={24} max={50} step={1}
                      onValueChange={([val]) => setProfile({...profile, waist: val})}
                    />
                  </div>
                </div>
              </div>

              {/* Activity Level & Training Days */}
              <div className="space-y-3 mt-4">
                <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                  Activity Level <span className="text-primary font-bold capitalize">{profile.activity}</span>
                </label>
                <div className="grid grid-cols-3 gap-2 border border-white/10 p-1 bg-black/50">
                  {["sedentary", "active", "intense"].map(act => (
                    <button 
                      key={act}
                      onClick={() => setProfile({...profile, activity: act})}
                      className={`py-2 text-xs font-bold transition-all uppercase tracking-wider ${profile.activity === act ? "bg-primary/20 text-primary border border-primary/50" : "text-muted-foreground hover:bg-white/5 border border-transparent"}`}
                    >{act}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                  Training Days / Week <span className="text-primary font-bold">{profile.trainingDays} Days</span>
                </label>
                <div className="pt-3 pb-2">
                  <Slider 
                    value={[profile.trainingDays]} 
                    min={0} max={7} step={1}
                    onValueChange={([val]) => setProfile({...profile, trainingDays: val})}
                  />
                </div>
              </div>

            </div>

            <Button 
              onClick={handleNext}
              className="w-full h-14 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.2em] text-sm mt-8"
            >
              RECORD PROFILE <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h2 className="text-primary text-xs tracking-[0.2em] font-bold">STEP 2/3</h2>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">Performance Profile</span>
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-widest text-white">Baseline Output</h3>
            <p className="text-sm text-muted-foreground">Input your current bests. The system classifies your level based on relative strength metrics.</p>
            
            <div className="space-y-6 mt-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Bench (LBS)</label>
                  <Input 
                    type="number" 
                    value={performance.bench}
                    onChange={e => setPerformance({...performance, bench: e.target.value})}
                    className="bg-black/50 border-white/10 h-14 text-center font-bold font-mono focus-visible:ring-primary focus-visible:border-primary rounded-none"
                    placeholder="225"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Squat (LBS)</label>
                  <Input 
                    type="number" 
                    value={performance.squat}
                    onChange={e => setPerformance({...performance, squat: e.target.value})}
                    className="bg-black/50 border-white/10 h-14 text-center font-bold font-mono focus-visible:ring-primary focus-visible:border-primary rounded-none"
                    placeholder="315"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Deadlift (OPT)</label>
                  <Input 
                    type="number" 
                    value={performance.deadlift}
                    onChange={e => setPerformance({...performance, deadlift: e.target.value})}
                    className="bg-black/50 border-white/10 h-14 text-center font-bold font-mono focus-visible:ring-primary focus-visible:border-primary rounded-none"
                    placeholder="405"
                  />
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                  Cardio Level <span className="text-primary font-bold capitalize">{performance.cardio}</span>
                </label>
                <div className="grid grid-cols-3 gap-2 border border-white/10 p-1 bg-black/50">
                  {["poor", "moderate", "excellent"].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setPerformance({...performance, cardio: lvl})}
                      className={`py-2 text-xs font-bold transition-all uppercase tracking-wider ${performance.cardio === lvl ? "bg-primary/20 text-primary border border-primary/50" : "text-muted-foreground hover:bg-white/5 border border-transparent"}`}
                    >{lvl}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <label className="text-xs uppercase tracking-widest text-muted-foreground flex justify-between">
                  Experience Level <span className="text-primary font-bold uppercase">{performance.experience}</span>
                </label>
                <div className="grid grid-cols-3 gap-2 border border-white/10 p-1 bg-black/50">
                  {["< 1 year", "1-3 years", "3+ years"].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setPerformance({...performance, experience: lvl})}
                      className={`py-2 text-[10px] font-bold transition-all uppercase tracking-wider ${performance.experience === lvl ? "bg-primary/20 text-primary border border-primary/50" : "text-muted-foreground hover:bg-white/5 border border-transparent"}`}
                    >{lvl}</button>
                  ))}
                </div>
              </div>

              <div className="p-4 border border-primary/20 bg-primary/5 flex items-center justify-between mt-6">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Classified As</span>
                <span className="font-bold text-primary tracking-widest uppercase text-glow">{classification}</span>
              </div>
            </div>

            <Button 
              onClick={handleNext}
              disabled={!performance.bench || !performance.squat}
              className="w-full h-14 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.2em] text-sm mt-8 disabled:opacity-50 disabled:bg-secondary disabled:text-muted-foreground disabled:border-none"
            >
              RECORD METRICS <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h2 className="text-primary text-xs tracking-[0.2em] font-bold">STEP 3/3</h2>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">Directives</span>
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-widest text-white">Identify Primary Directive</h3>
            <p className="text-sm text-muted-foreground">Select your operational objective. This dictates your caloric intake and training parameters.</p>
            
            <div className="space-y-4 mt-8">
              {[
                { id: "lock-in", title: "LOCK IN", desc: "Maintain current mass. Recompose and harden.", icon: ShieldCheck },
                { id: "cut", title: "CUT", desc: "Strip body fat. Preserve lean tissue. Deficit protocol.", icon: Target },
                { id: "build", title: "BUILD", desc: "Accumulate lean mass. Surplus protocol.", icon: Activity }
              ].map(mode => (
                <div 
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id as any)}
                  className={`p-5 flex items-start gap-4 cursor-pointer border transition-all ${selectedMode === mode.id ? 'border-primary bg-primary/10 shadow-[0_0_15px_hsl(var(--primary)/0.15)]' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                >
                  <mode.icon className={`w-6 h-6 mt-1 ${selectedMode === mode.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <h4 className={`font-bold uppercase tracking-widest ${selectedMode === mode.id ? 'text-primary' : 'text-white'}`}>{mode.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{mode.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleNext}
              disabled={!selectedMode}
              className="w-full h-14 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:bg-secondary disabled:text-muted-foreground disabled:border-none"
            >
              CONFIRM DIRECTIVE <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <h2 className="text-primary text-xs tracking-[0.2em] font-bold">FINAL REVIEW</h2>
                <span className="text-xs text-muted-foreground tracking-widest uppercase">System Check</span>
            </div>

            <h3 className="text-2xl font-bold uppercase tracking-widest text-white">Acknowledge Terms</h3>
            <p className="text-sm text-muted-foreground">This system requires absolute compliance. Verify your data.</p>
            
            <div className="space-y-4 mt-8 bg-white/5 border border-white/10 p-6">
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-xs text-muted-foreground uppercase tracking-widest">Weight</span>
                 <span className="text-xs text-white font-bold uppercase tracking-widest">{profile.weight} LBS</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-xs text-muted-foreground uppercase tracking-widest">Strength</span>
                 <span className="text-xs text-primary font-bold uppercase tracking-widest">{classification}</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-xs text-muted-foreground uppercase tracking-widest">Directive</span>
                 <span className="text-xs text-white font-bold uppercase tracking-widest">{selectedMode}</span>
               </div>
            </div>

            <Button 
              onClick={handleNext}
              className="w-full h-14 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.2em] text-sm mt-8"
            >
              INITIALIZE CALIBRATION <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 text-center animate-in fade-in duration-500 py-10">
            <Crosshair className="w-16 h-16 mx-auto text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <h3 className="text-2xl font-bold uppercase tracking-widest text-primary text-glow">CALIBRATING SYSTEM</h3>
            
            <div className="space-y-2 mt-8 text-left max-w-xs mx-auto font-mono text-sm">
                <p className="text-white">&gt; Analyzing {profile.weight}lbs @ {profile.bf}% BF...</p>
                {processingState >= 1 && <p className="text-white animate-in fade-in">&gt; Scaling output parameters: {classification} level...</p>}
                {processingState >= 2 && <p className="text-white animate-in fade-in">&gt; Setting caloric baseline: {selectedMode === 'cut' ? 'DEFICIT' : selectedMode === 'build' ? 'SURPLUS' : 'MAINTENANCE'}...</p>}
                {processingState >= 3 && <p className="text-primary animate-in fade-in font-bold">&gt; PROTOCOLS LOCKED.</p>}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-10 animate-in fade-in zoom-in duration-1000 text-center">
            
            <div className="space-y-4">
              <h2 className="text-primary text-sm tracking-[0.3em] font-bold">CALIBRATION COMPLETE</h2>
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-glow leading-tight">
                YOU ARE IN.
              </h1>
            </div>
            
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto text-sm">
              The system is built. The only variable left is your execution. No negotiation. No excuses.
            </p>

            <Button 
              onClick={handleFinish}
              className="w-full h-16 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.3em] text-sm border border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all mt-10"
            >
              ENTER DASHBOARD
            </Button>
          </div>
        )}
        
      </div>
    </div>
  );
}

