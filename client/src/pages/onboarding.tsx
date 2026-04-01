import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

const SCREENS = [
  {
    text: "You are not here for motivation.",
    button: "CONTINUE"
  },
  {
    text: "You are entering a system.",
    button: "ENTER"
  },
  {
    text: "Once you begin, you execute daily.",
    button: "I UNDERSTAND"
  },
  {
    text: "No negotiation. No excuses.",
    button: "START"
  },
  {
    text: "YOU ARE IN",
    button: "EXECUTE"
  }
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < SCREENS.length - 1) {
      setStep(step + 1);
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="max-w-md w-full space-y-12 animate-in fade-in zoom-in duration-1000">
        
        <h1 className={`text-3xl md:text-5xl font-bold uppercase tracking-widest text-glow leading-tight transition-opacity duration-500 ${step === SCREENS.length - 1 ? 'text-primary' : 'text-foreground'}`}>
          {SCREENS[step].text}
        </h1>

        <Button 
          onClick={handleNext}
          className="w-full h-16 rounded-none bg-primary text-black hover:bg-primary/90 font-bold uppercase tracking-[0.3em] text-sm border border-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)] transition-all"
        >
          {SCREENS[step].button}
        </Button>
        
      </div>
    </div>
  );
}
