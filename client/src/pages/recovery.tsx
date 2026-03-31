import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Moon, Battery, Zap, ActivitySquare, Wind } from "lucide-react";
import recoveryBg from "@/assets/recovery-bg.png";

export default function Recovery() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-primary font-display font-medium tracking-widest text-xs mb-2 uppercase">Rest & Repair</div>
          <h1 className="text-4xl font-bold text-glow uppercase flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-primary" />
            Recovery Protocol
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            You don't grow in the gym; you grow outside of it. Master these protocols to accelerate muscle repair and central nervous system recovery.
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-10 border border-white/10 group">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-700 group-hover:opacity-50"
          style={{ backgroundImage: `url(${recoveryBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-64 md:h-80">
          <Badge className="w-fit bg-primary text-primary-foreground mb-4 uppercase tracking-widest text-[10px]">Priority 1</Badge>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 text-glow">SLEEP ARCHITECTURE</h2>
          <p className="text-lg text-white/80 max-w-xl">7-9 hours of quality sleep is the ultimate performance enhancer. No supplement can outwork sleep deprivation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sleep Rules */}
        <Card className="glass-panel p-6 border-t-primary/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Moon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold">Sleep Hygiene</h3>
          </div>
          <ul className="space-y-4">
            <RuleItem title="Room Temp" desc="Keep it cold. Target 65-68°F (18-20°C)." />
            <RuleItem title="Light Exposure" desc="Pitch black room. Blackout curtains are essential." />
            <RuleItem title="Digital Curfew" desc="No screens 60 mins before bed. Blue light blocks melatonin." />
            <RuleItem title="Consistency" desc="Wake up at the same time every day, even weekends." />
          </ul>
        </Card>

        {/* Active Recovery */}
        <Card className="glass-panel p-6 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <ActivitySquare className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold">Active Recovery</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">On rest days, keep blood flowing without taxing the nervous system.</p>
          <ul className="space-y-4">
            <RuleItem title="Zone 2 Cardio" desc="30-45 mins of light cycling or brisk walking. Heart rate 120-130bpm." />
            <RuleItem title="Step Count" desc="Target 8,000 - 10,000 steps daily baseline." />
            <RuleItem title="Mobility Flow" desc="15 mins dynamic stretching focusing on hips, shoulders, ankles." />
          </ul>
        </Card>

        {/* Tissue Prep & Repair */}
        <Card className="glass-panel p-6 relative overflow-hidden">
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-bold">Tissue Repair</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Tools to manage stiffness and improve tissue sliding surfaces.</p>
          <ul className="space-y-4">
            <RuleItem title="Foam Rolling" desc="Pre-workout: 5 mins on tight areas (lats, quads, upper back)." />
            <RuleItem title="Massage Gun" desc="Post-workout: Flush out muscles used in session. Avoid joints." />
            <RuleItem title="Heat Exposure" desc="Sauna 15-20 mins, 2-3x a week. Enhances cardiovascular adaptations." />
          </ul>
        </Card>
      </div>

      <div className="mt-10 glass-panel p-6 md:p-8 rounded-2xl border-dashed border-white/20 text-center flex flex-col items-center">
        <Battery className="w-10 h-10 text-primary mb-4" />
        <h3 className="text-2xl font-display font-bold mb-2">Listen To Your Body</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          If grip strength drops, resting heart rate spikes, or sleep is broken for consecutive days, take an extra rest day. 
          The blueprint is a guide, but your central nervous system dictates the pace.
        </p>
      </div>

    </div>
  );
}

function RuleItem({ title, desc }: { title: string, desc: string }) {
  return (
    <li className="flex flex-col gap-1">
      <span className="font-bold text-sm text-foreground/90">{title}</span>
      <span className="text-sm text-muted-foreground">{desc}</span>
    </li>
  );
}