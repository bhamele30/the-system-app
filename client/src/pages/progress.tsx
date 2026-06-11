import { useSystem } from "@/hooks/use-system";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Camera, Scale, Utensils } from "lucide-react";

export default function Progress() {
  const { state } = useSystem();
  
  const entries = Object.entries(state.proofs || {}).sort((a, b) => {
    return new Date(b[0]).getTime() - new Date(a[0]).getTime();
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in duration-700">
      <header className="mb-10">
        <div className="text-primary font-display font-medium tracking-widest text-xs mb-2 uppercase">The Archive</div>
        <h1 className="text-4xl font-bold text-glow uppercase tracking-tighter">Execution Proof</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Visual documentation of your progression. The evidence of the work put in. Numbers and images don't lie.
        </p>
      </header>

      {entries.length === 0 ? (
        <div className="border border-dashed border-white/10 p-12 flex flex-col items-center justify-center text-center">
          <Camera className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-bold uppercase tracking-widest text-foreground/50">No Proof Logged</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            You haven't logged any proof yet. Complete your daily execution and upload your gym pics, weight logs, and meals to build your archive.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {entries.map(([date, proof]) => (
            <div key={date} className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/20 text-primary font-display uppercase tracking-widest text-sm py-1 px-4 border border-primary/30">
                  {format(parseISO(date), "MMM dd, yyyy")}
                </div>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gym Pic */}
                <Card className="glass-panel overflow-hidden border-white/10 bg-black/40">
                  <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-white/5">
                    <Camera className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-display uppercase tracking-widest text-foreground/80">Gym Pic</span>
                  </div>
                  <div className="aspect-square bg-black/60 relative flex items-center justify-center overflow-hidden">
                    {proof.gymPic ? (
                      <img src={proof.gymPic} alt="Gym Proof" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-muted-foreground/30 text-[10px] uppercase tracking-widest">No Image</span>
                    )}
                  </div>
                </Card>

                {/* Weight Log */}
                <Card className="glass-panel overflow-hidden border-white/10 bg-black/40">
                  <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-white/5">
                    <Scale className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-display uppercase tracking-widest text-foreground/80">Weight Log</span>
                  </div>
                  <div className="aspect-square bg-black/60 relative flex flex-col items-center justify-center p-6 text-center">
                    {proof.weightLog ? (
                      <>
                        <div className="text-5xl font-display font-bold text-glow text-primary">{proof.weightLog}</div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">LBS</div>
                      </>
                    ) : (
                      <span className="text-muted-foreground/30 text-[10px] uppercase tracking-widest">No Log</span>
                    )}
                  </div>
                </Card>

                {/* Meal Pic */}
                <Card className="glass-panel overflow-hidden border-white/10 bg-black/40">
                  <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-white/5">
                    <Utensils className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-display uppercase tracking-widest text-foreground/80">Meal Pic</span>
                  </div>
                  <div className="aspect-square bg-black/60 relative flex items-center justify-center overflow-hidden">
                    {proof.mealPic ? (
                      <img src={proof.mealPic} alt="Meal Proof" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-muted-foreground/30 text-[10px] uppercase tracking-widest">No Image</span>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}