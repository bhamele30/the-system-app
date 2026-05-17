import { useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Info, Apple, Flame, Droplets, Beef, Cookie, Activity, CheckCircle2, ChevronRight, Trash2 } from "lucide-react";
import nutritionBg from "@/assets/nutrition-bg.png";

import { useSystem } from "@/hooks/use-system";

// Dynamic Daily Targets based on selected mode
const getTargets = (mode: string) => {
  switch (mode) {
    case "Operator Lean":
      return { kcal: 2400, protein: 200, carbs: 200, fats: 80 };
    case "Athletic Build":
      return { kcal: 2800, protein: 180, carbs: 320, fats: 85 };
    case "Elite Conditioning":
      return { kcal: 3200, protein: 170, carbs: 450, fats: 80 };
    case "Lean Mass Phase":
      return { kcal: 3100, protein: 220, carbs: 350, fats: 90 };
    case "Performance Build":
      return { kcal: 3500, protein: 200, carbs: 450, fats: 100 };
    case "Recomp Phase":
      return { kcal: 2650, protein: 210, carbs: 250, fats: 80 };
    default:
      return { kcal: 2850, protein: 180, carbs: 300, fats: 80 };
  }
};

const getPhaseDescription = (mode: string) => {
  switch (mode) {
    case "Operator Lean":
      return "Slight Deficit. Strip fat, maintain output. Keep carbs moderate around training.";
    case "Athletic Build":
      return "Maintenance. Fuel performance, prioritize protein synthesis.";
    case "Elite Conditioning":
      return "High Energy Demand. Carbs are king to fuel intense work capacity.";
    case "Lean Mass Phase":
      return "Slight Surplus. Gradual tissue accumulation. Do not get sloppy.";
    case "Performance Build":
      return "Heavy Surplus. Maximal strength and size gain. Eat to grow.";
    case "Recomp Phase":
      return "Strict Maintenance. Burn fat, build muscle. Protein must stay high.";
    default:
      return "Phase 1: Maintenance / Slight Surplus. Fuel the machine, don't feed the fat.";
  }
};

const MEALS: { id: string, time: string, name: string, macros: { p: number, c: number, f: number, kcal: number }, desc: string, isCustom?: boolean }[] = [
  {
    id: "m1",
    time: "Meal 1: Breakfast",
    name: "Anabolic Oats",
    macros: { p: 45, c: 60, f: 15, kcal: 555 },
    desc: "80g Oats, 1.5 scoops whey isolate, 50g mixed berries, 15g natural peanut butter."
  },
  {
    id: "m2",
    time: "Meal 1: Breakfast (Alt)",
    name: "Steak & Eggs",
    macros: { p: 50, c: 5, f: 25, kcal: 445 },
    desc: "150g Lean flank steak, 3 whole eggs, spinach."
  },
  {
    id: "m3",
    time: "Meal 2: Pre-Workout",
    name: "Power Rice & Chicken",
    macros: { p: 40, c: 70, f: 5, kcal: 485 },
    desc: "150g Chicken breast, 200g white rice, light soy sauce. Fast digesting carbs."
  },
  {
    id: "m4",
    time: "Meal 2: Pre-Workout (Alt)",
    name: "Cream of Rice & Whey",
    macros: { p: 50, c: 60, f: 2, kcal: 458 },
    desc: "60g Cream of rice, 2 scoops whey isolate, 1/2 banana, cinnamon."
  },
  {
    id: "m5",
    time: "Meal 3: Post-Workout",
    name: "Recovery Shake & Fast Carbs",
    macros: { p: 50, c: 60, f: 2, kcal: 458 },
    desc: "2 scoops whey isolate, 40g rice krispies or cream of rice, 1 banana."
  },
  {
    id: "m6",
    time: "Meal 3: Post-Workout (Alt)",
    name: "Lean Beef & Potato",
    macros: { p: 45, c: 65, f: 10, kcal: 530 },
    desc: "200g 95/5 Lean ground beef, 300g sweet potato, asparagus."
  },
  {
    id: "m7",
    time: "Meal 4: Dinner",
    name: "Salmon & Greens",
    macros: { p: 40, c: 10, f: 22, kcal: 398 },
    desc: "200g Wild caught salmon, massive spinach salad, 1 tbsp olive oil."
  },
  {
    id: "m8",
    time: "Meal 4: Dinner (Alt)",
    name: "Steak & Potatoes",
    macros: { p: 55, c: 60, f: 20, kcal: 640 },
    desc: "200g Lean sirloin steak, 250g sweet potato, 100g asparagus."
  },
  {
    id: "m9",
    time: "Snack / Anytime",
    name: "Greek Yogurt Bowl",
    macros: { p: 35, c: 20, f: 5, kcal: 265 },
    desc: "300g Non-fat plain greek yogurt, 100g berries, 15g almonds."
  },
  {
    id: "m10",
    time: "Snack / Anytime",
    name: "Cottage Cheese & Almonds",
    macros: { p: 30, c: 15, f: 10, kcal: 270 },
    desc: "250g Low-fat cottage cheese, 20g almonds, cinnamon."
  }
];

export default function Nutrition() {
  const { state, logNutrition, toggleMealId, removeNutritionLog } = useSystem();
  
  const today = new Date().toISOString().split('T')[0];
  const loggedMeals = state.loggedMealIds?.[today] || [];
  
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    p: "", c: "", f: "", kcal: ""
  });
  
  // Custom meals from logs
  const customMeals = (state.nutritionLogs[today] || []).map(log => ({
    id: log.id,
    time: "Custom Meal",
    name: log.food,
    desc: "Manually entered meal.",
    macros: {
        p: log.protein,
        c: log.carbs,
        f: log.fat,
        kcal: log.calories
    },
    isCustom: true
  }));

  // Calculate current macros
  const allMeals = [...MEALS, ...customMeals];
  
  // Create currentMacros via useMemo to avoid re-renders during render phase
  const currentMacros = useMemo(() => {
    return loggedMeals.reduce((acc, mealId) => {
      const meal = allMeals.find(m => m.id === mealId);
      if (meal) {
        acc.p += meal.macros.p;
        acc.c += meal.macros.c;
        acc.f += meal.macros.f;
        acc.kcal += meal.macros.kcal;
      }
      return acc;
    }, { p: 0, c: 0, f: 0, kcal: 0 });
  }, [loggedMeals, allMeals]);

  const toggleMeal = (mealId: string) => {
    toggleMealId(mealId);
  };

  const handleAddCustomMeal = () => {
    if (!newMeal.name) return;
    
    logNutrition(
      newMeal.name,
      parseInt(newMeal.kcal) || 0,
      parseInt(newMeal.p) || 0,
      parseInt(newMeal.c) || 0,
      parseInt(newMeal.f) || 0
    );

    setShowCustomModal(false);
    setNewMeal({ name: "", p: "", c: "", f: "", kcal: "" });
  };

  const targets = getTargets(state.mode);
  const phaseDesc = getPhaseDescription(state.mode);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700 relative">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-glow uppercase flex items-center gap-3">
            <Flame className="w-8 h-8 text-primary" />
            Fuel & Macros
          </h1>
          <p className="text-primary font-bold tracking-widest uppercase text-xs mt-4 mb-1">{state.mode}</p>
          <p className="text-muted-foreground text-sm">{phaseDesc}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-display uppercase tracking-wider text-xs bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> Quick Log
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-primary/20 bg-background/95 backdrop-blur-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold text-primary mb-2">
                QUICK LOG MEAL
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              {[...MEALS, ...customMeals].map((meal) => (
                <div 
                  key={`quick-${meal.id}`}
                  onClick={() => toggleMeal(meal.id)}
                  className={`p-4 rounded-none border cursor-pointer transition-all ${
                    loggedMeals.includes(meal.id) 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-secondary/30 border-white/5 hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{meal.name}</span>
                    {loggedMeals.includes(meal.id) ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <div className="text-xs mt-1 opacity-70">
                    {meal.macros.kcal} kcal | {meal.macros.p}g P
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Macros & Caloric Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-panel p-6 rounded-none relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-64 h-full bg-cover bg-right opacity-10 pointer-events-none"
              style={{ backgroundImage: `url(${nutritionBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-display font-bold">DAILY TARGETS</h2>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className={`text-3xl font-bold font-display ${currentMacros.kcal >= targets.kcal ? 'text-green-500 text-glow' : 'text-primary'}`}>
                      {currentMacros.kcal}
                    </span>
                    <span className="text-xl text-muted-foreground font-display">/ {targets.kcal}</span>
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Kcal Logged</div>
                </div>
              </div>

              <div className="space-y-6">
                <MacroBar icon={Beef} label="PROTEIN" current={currentMacros.p} target={targets.protein} unit="g" color="bg-primary" description="Muscle building blocks. Non-negotiable." />
                <MacroBar icon={Cookie} label="CARBS" current={currentMacros.c} target={targets.carbs} unit="g" color="bg-blue-400" description="Primary energy source. Cycle around workouts." />
                <MacroBar icon={Droplets} label="FATS" current={currentMacros.f} target={targets.fats} unit="g" color="bg-cyan-600" description="Hormone regulation. Keep moderate." />
              </div>
            </div>
          </section>

          <section className="glass-panel p-6 rounded-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <Apple className="w-5 h-5 text-primary" />
                MEALS
              </h2>
              <Button size="sm" variant="secondary" className="border-white/10" onClick={() => setShowCustomModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Custom
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Click to log your meals. Rotate these templates or add your own.</p>
            <div className="grid gap-4">
              {[...MEALS, ...customMeals].map((meal) => (
                <MealCard 
                  key={meal.id}
                  meal={meal}
                  isLogged={loggedMeals.includes(meal.id)}
                  onToggle={() => toggleMeal(meal.id)}
                  onRemove={meal.isCustom ? (e) => {
                    e.stopPropagation();
                    removeNutritionLog(meal.id);
                  } : undefined}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Supplement Stack */}
        <div className="space-y-6">
          <section className="glass-panel p-6 rounded-none border-primary/20 bg-primary/5">
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
                name="Essential Amino Acids (EAAs)" 
                dose="10g" 
                timing="Intra-Workout for muscle preservation" 
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

          <section className="glass-panel p-6 rounded-none border-t-primary/50">
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

      <Dialog open={showCustomModal} onOpenChange={setShowCustomModal}>
        <DialogContent className="glass-panel border-primary/20 bg-background/95 backdrop-blur-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-primary mb-2">
              ADD CUSTOM MEAL
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Meal Name</Label>
              <Input 
                value={newMeal.name} 
                onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                placeholder="e.g., Protein Shake"
                className="bg-black/50 border-white/10 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Calories</Label>
                <Input 
                  type="number" 
                  value={newMeal.kcal} 
                  onChange={e => setNewMeal({...newMeal, kcal: e.target.value})}
                  className="bg-black/50 border-white/10 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Protein (g)</Label>
                <Input 
                  type="number" 
                  value={newMeal.p} 
                  onChange={e => setNewMeal({...newMeal, p: e.target.value})}
                  className="bg-black/50 border-white/10 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Carbs (g)</Label>
                <Input 
                  type="number" 
                  value={newMeal.c} 
                  onChange={e => setNewMeal({...newMeal, c: e.target.value})}
                  className="bg-black/50 border-white/10 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Fats (g)</Label>
                <Input 
                  type="number" 
                  value={newMeal.f} 
                  onChange={e => setNewMeal({...newMeal, f: e.target.value})}
                  className="bg-black/50 border-white/10 font-mono"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddCustomMeal}
              className="w-full mt-4 font-display font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add to Log
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
      <div className="h-3 w-full bg-secondary rounded-none overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function MealCard({ meal, isLogged, onToggle, onRemove }: { meal: any, isLogged: boolean, onToggle: () => void, onRemove?: (e: React.MouseEvent) => void }) {
  return (
    <div 
      onClick={onToggle}
      className={`p-5 rounded-none border cursor-pointer transition-all duration-300 relative overflow-hidden group ${
        isLogged 
          ? 'bg-primary/5 border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.1)]' 
          : 'bg-secondary/30 border-white/5 hover:border-primary/30'
      }`}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
        <span className="text-xs text-primary font-display tracking-widest uppercase flex items-center gap-2">
          {meal.time}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground bg-black/40 px-2 py-1 rounded border border-white/5">
            P: {meal.macros.p}g | C: {meal.macros.c}g | F: {meal.macros.f}g | {meal.macros.kcal} kcal
          </span>
          {meal.isCustom && onRemove && (
            <button 
              onClick={onRemove}
              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <h4 className={`font-bold text-lg transition-colors ${isLogged ? 'text-primary' : 'group-hover:text-primary/80'}`}>
          {meal.name}
        </h4>
        <div className={`w-6 h-6 rounded-none border flex items-center justify-center transition-colors ${
          isLogged ? 'bg-primary border-primary text-black' : 'border-white/20 text-transparent'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed pr-8">{meal.desc}</p>
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