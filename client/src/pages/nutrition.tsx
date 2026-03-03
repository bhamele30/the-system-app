import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Info, Apple } from "lucide-react";

export default function Nutrition() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-glow uppercase">Fuel & Macros</h1>
          <p className="text-muted-foreground mt-2">Phase 1: Maintenance / Slight Surplus</p>
        </div>
        <Button className="font-display uppercase tracking-wider text-xs">
          <Plus className="w-4 h-4 mr-2" /> Log Meal
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Macros */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-panel p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-display font-bold">DAILY TARGETS</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary font-display">2,850</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Kcal Goal</div>
              </div>
            </div>

            <div className="space-y-6">
              <MacroBar label="PROTEIN" current={120} target={180} unit="g" color="bg-primary" />
              <MacroBar label="CARBS" current={150} target={300} unit="g" color="bg-blue-400" />
              <MacroBar label="FATS" current={45} target={80} unit="g" color="bg-cyan-600" />
            </div>
          </section>

          <section className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-display font-bold mb-6">MEAL TEMPLATES</h2>
            <div className="grid gap-4">
              <MealCard 
                time="Breakfast" 
                name="Anabolic Oats" 
                macros="P: 45g | C: 60g | F: 15g"
                desc="Oats, whey isolate, berries, peanut butter."
              />
              <MealCard 
                time="Post-Workout" 
                name="Recovery Shake" 
                macros="P: 50g | C: 40g | F: 2g"
                desc="2 scoops whey, rice krispies, banana."
              />
              <MealCard 
                time="Dinner" 
                name="Steak & Rice" 
                macros="P: 55g | C: 80g | F: 20g"
                desc="Lean sirloin, white rice, asparagus."
              />
            </div>
          </section>
        </div>

        {/* Supplement Stack */}
        <div className="space-y-6">
          <section className="glass-panel p-6 rounded-2xl border-primary/20">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">SUPP STACK</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Supplements are the final 5%. Do not rely on them if your training and diet are not locked in.
            </p>

            <div className="space-y-4">
              <SuppItem 
                name="Creatine Monohydrate" 
                dose="5g Daily" 
                timing="Anytime" 
              />
              <SuppItem 
                name="Whey Isolate" 
                dose="1-2 Scoops" 
                timing="Post-Workout" 
              />
              <SuppItem 
                name="Fish Oil" 
                dose="2g EPA/DHA" 
                timing="With Meals" 
              />
              <SuppItem 
                name="Magnesium" 
                dose="400mg" 
                timing="Pre-bed" 
              />
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function MacroBar({ label, current, target, unit, color }: { label: string, current: number, target: number, unit: string, color: string }) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-display tracking-widest font-bold">{label}</span>
        <span className="text-sm">
          <span className="font-bold">{current}</span>
          <span className="text-muted-foreground text-xs"> / {target}{unit}</span>
        </span>
      </div>
      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function MealCard({ time, name, macros, desc }: { time: string, name: string, macros: string, desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-primary font-display tracking-widest uppercase">{time}</span>
        <span className="text-xs text-muted-foreground">{macros}</span>
      </div>
      <h4 className="font-bold text-lg mb-1">{name}</h4>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function SuppItem({ name, dose, timing }: { name: string, dose: string, timing: string }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
      <div>
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{timing}</div>
      </div>
      <div className="text-sm font-display font-bold text-primary">{dose}</div>
    </div>
  );
}
