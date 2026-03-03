import { useState } from "wouter";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import React from "react";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = React.useState(1);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else setLocation("/blueprint");
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        
        {step === 1 && (
          <QuestionStep 
            title="What's your current training age?"
            subtitle="Be honest. This sets the foundation of your blueprint."
            options={[
              "Beginner (0-1 years)",
              "Intermediate (1-3 years)",
              "Advanced (3+ years)"
            ]}
          />
        )}

        {step === 2 && (
          <QuestionStep 
            title="What equipment do you have access to?"
            subtitle="The blueprint requires heavy lifting."
            options={[
              "Full Commercial Gym",
              "Home Gym (Rack, Barbell, Dumbbells)",
              "Dumbbells Only"
            ]}
          />
        )}

        {step === 3 && (
          <QuestionStep 
            title="What's your primary obstacle right now?"
            subtitle="Select the biggest hurdle preventing your growth."
            options={[
              "Not gaining strength/muscle despite lifting",
              "Don't know what to eat / skinny fat",
              "Inconsistent routine / lack of structure"
            ]}
          />
        )}

        {step === 4 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <ArrowRight className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4 text-glow">PROTOCOL GENERATED</h2>
            <p className="text-muted-foreground mb-12 max-w-md mx-auto">
              Based on your profile, we've calibrated Phase 1 of The Blueprint. 
              Prepare for 12 weeks of Foundation & Hypertrophy.
            </p>
          </div>
        )}

        <div className="flex w-full justify-between mt-12 pt-8 border-t border-white/10">
          <Button 
            variant="ghost" 
            onClick={prevStep} 
            disabled={step === 1}
            className={step === 1 ? "opacity-0" : ""}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button 
            onClick={nextStep}
            className="font-display uppercase tracking-widest px-8 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {step === 4 ? "Enter Dashboard" : "Continue"} <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  );
}

function QuestionStep({ title, subtitle, options }: { title: string, subtitle: string, options: string[] }) {
  const [selected, setSelected] = React.useState<number | null>(null);

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
      <h2 className="text-3xl md:text-4xl font-bold font-display mb-3">{title}</h2>
      <p className="text-muted-foreground mb-10">{subtitle}</p>

      <div className="space-y-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left p-6 rounded-xl border transition-all duration-200 ${
              selected === i 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-secondary/50 border-white/5 hover:border-white/20 hover:bg-secondary text-foreground"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{opt}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selected === i ? "border-primary" : "border-muted-foreground"
              }`}>
                {selected === i && <div className="w-3 h-3 bg-primary rounded-full" />}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
