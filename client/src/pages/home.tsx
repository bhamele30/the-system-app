import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, Dumbbell, ShieldCheck, Target } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 z-0 bg-background/80 backdrop-blur-[2px]" />
      
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 z-0 blueprint-grid opacity-30 pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-16 max-w-4xl mx-auto w-full text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-display font-medium tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ShieldCheck className="w-4 h-4" />
          <span>The Proven 3-Year Transformation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-glow animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          REBUILD <br className="md:hidden" />YOUR FRAME
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          For men 30+. Stop guessing. Follow the exact blueprint that took me from skinny to a solid, muscular frame with visible abs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
          <Link href="/onboarding">
            <Button size="lg" className="w-full sm:w-auto font-display font-bold uppercase tracking-widest text-sm h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
              Start The Blueprint <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="w-full sm:w-auto font-display font-bold uppercase tracking-widest text-sm h-14 border-primary/50 hover:bg-primary/10">
            View Transformation
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in duration-1000 delay-700">
          <FeatureCard 
            icon={Dumbbell} 
            title="Lifting Focused" 
            desc="Structured weekly splits designed for hypertrophy and progressive overload." 
          />
          <FeatureCard 
            icon={Target} 
            title="Macro Mastery" 
            desc="Exact nutrition protocols and supplement timing to fuel growth without fat gain." 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Zero Fluff" 
            desc="No BS. Just the required daily inputs to forge an elite physique after 30." 
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass-panel p-6 rounded-xl text-left border-t-primary/20">
      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
