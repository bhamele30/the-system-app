import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Info, Apple, Flame, Droplets, Beef, Cookie, Activity } from "lucide-react";
import nutritionBg from "@/assets/nutrition-bg.png";

export default function Nutrition() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700 relative">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-glow uppercase flex items-center gap-3">
            <Flame className="w-8 h-8 text-primary" />
            Fuel & Macros
          </h1>
          <p className="text-muted-foreground mt-2">Phase 1: Maintenance / Slight Surplus. Fuel the machine, don't feed the fat.</p>
        </div>
        <Button className="font-display uppercase tracking-wider text-xs bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Log Meal
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Macros & Caloric Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-64 h-full bg-cover bg-right opacity-10 pointer-events-none"
              style={{ backgroundImage: `url(${nutritionBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-display font-bold">DAILY TARGETS</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary font-display">2,850</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Kcal Goal</div>
                </div>
              </div>

              <div className="space-y-6">
                <MacroBar icon={Beef} label="PROTEIN" current={120} target={180} unit="g" color="bg-primary" description="Muscle building blocks. Non-negotiable." />
                <MacroBar icon={Cookie} label="CARBS" current={150} target={300} unit="g" color="bg-blue-400" description="Primary energy source. Cycle around workouts." />
                <MacroBar icon={Droplets} label="FATS" current={45} target={80} unit="g" color="bg-cyan-600" description="Hormone regulation. Keep moderate." />
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 rounded-2xl">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Apple className="w-5 h-5 text-primary" />
              APPROVED MEAL TEMPLATES
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Rotate these meals to hit your macros effortlessly. Precision beats variety.</p>
            <div className="grid gap-4">
              <MealCard 
                time="Meal 1: Breakfast" 
                name="Anabolic Oats" 
                macros="P: 45g | C: 60g | F: 15g | 555 kcal"
                desc="80g Oats, 1.5 scoops whey isolate, 50g mixed berries, 15g natural peanut butter."
              />
              <MealCard 
                time="Meal 2: Pre-Workout" 
                name="Power Rice & Chicken" 
                macros="P: 40g | C: 70g | F: 5g | 485 kcal"
                desc="150g Chicken breast, 200g white rice, light soy sauce. Fast digesting carbs."
              />
              <MealCard 
                time="Meal 3: Post-Workout" 
                name="Recovery Shake & Fast Carbs" 
                macros="P: 50g | C: 60g | F: 2g | 458 kcal"
                desc="2 scoops whey isolate, 40g rice krispies or cream of rice, 1 banana."
              />
              <MealCard 
                time="Meal 4: Dinner" 
                name="Steak & Potatoes" 
                macros="P: 55g | C: 60g | F: 20g | 640 kcal"
                desc="200g Lean sirloin steak, 250g sweet potato, 100g asparagus."
              />
            </div>
          </section>
        </div>

        {/* Supplement Stack */}
        <div className="space-y-6">
          <section className="glass-panel p-6 rounded-2xl border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-display font-bold">SUPP STACK</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Supplements are the final 5%. Do not rely on them if your training and diet are not locked in. This is the exact stack for maximum recovery and output.
            </p>

            <div className="space-y-4">
              <SuppItem 
                name="Creatine Monohydrate" 
                dose="5g Daily" 
                timing="Anytime. Hydrate well." 
                essential
              />
              <SuppItem 
                name="Whey Isolate" 
                dose="1-2 Scoops" 
                timing="Post-Workout / Meal Replacement" 
                essential
              />
              <SuppItem 
                name="Fish Oil (Omega-3)" 
                dose="2g EPA/DHA" 
                timing="With meals for joint health" 
              />
              <SuppItem 
                name="Magnesium Glycinate" 
                dose="400mg" 
                timing="30 mins Pre-bed for sleep quality" 
              />
              <SuppItem 
                name="Pre-Workout (Optional)" 
                dose="1 Scoop" 
                timing="30 mins before heavy sessions" 
              />
            </div>
          </section>

          <section className="glass-panel p-6 rounded-2xl border-t-primary/50">
             <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              HYDRATION
            </h2>
            <div className="text-center py-4">
              <div className="text-4xl font-display font-bold text-blue-400 mb-2">1.5</div>
              <div className="text-sm text-muted-foreground uppercase tracking-widest mb-4">Gallons Daily Target</div>
              <Progress value={60} className="h-3 bg-secondary" style={{ '--tw-progress-fill': 'hsl(210 100% 60%)' } as any} />
              <div className="mt-2 text-xs text-muted-foreground">0.9 Gal consumed today</div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function MacroBar({ icon: Icon, label, current, target, unit, color, description }: { icon: any, label: string, current: number, target: number, unit: string, color: string, description: string }) {
  const percent = Math.min(100, Math.round((current / target) * 100));
  
  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-display tracking-widest font-bold flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          {label}
        </span>
        <span className="text-sm">
          <span className="font-bold">{current}</span>
          <span className="text-muted-foreground text-xs"> / {target}{unit}</span>
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
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
    <div className="p-5 rounded-xl bg-secondary/30 border border-white/5 hover:border-primary/30 transition-colors">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
        <span className="text-xs text-primary font-display tracking-widest uppercase">{time}</span>
        <span className="text-xs font-mono text-muted-foreground bg-black/20 px-2 py-1 rounded">{macros}</span>
      </div>
      <h4 className="font-bold text-lg mb-2">{name}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function SuppItem({ name, dose, timing, essential }: { name: string, dose: string, timing: string, essential?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 last:pb-0">
      <div>
        <div className="font-medium text-sm flex items-center gap-2">
          {name}
          {essential && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider">Core</span>}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{timing}</div>
      </div>
      <div className="text-sm font-display font-bold text-primary">{dose}</div>
    </div>
  );
}