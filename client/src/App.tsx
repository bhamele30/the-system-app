import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dumbbell, LayoutDashboard, Target, Apple, HeartPulse, ShieldCheck } from "lucide-react";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Blueprint from "@/pages/blueprint";
import Onboarding from "@/pages/onboarding";
import Nutrition from "@/pages/nutrition";
import Workouts from "@/pages/workouts";
import Recovery from "@/pages/recovery";
import { useSystem } from "@/hooks/use-system";

function Navigation() {
  const [location] = useLocation();

  if (location === "/onboarding") return null;

  const navItems = [
    { href: "/", icon: ShieldCheck, label: "System" },
    { href: "/blueprint", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/workouts", icon: Dumbbell, label: "Workouts" },
    { href: "/nutrition", icon: Apple, label: "Fuel" },
    { href: "/recovery", icon: HeartPulse, label: "Recovery" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel md:bottom-auto md:top-0 md:h-screen md:w-20 md:border-r md:border-t-0 md:flex md:flex-col md:items-center md:py-8 bg-black/90">
      <div className="flex md:flex-col items-center justify-around md:justify-start md:gap-8 h-16 md:h-full w-full">
        <div className="hidden md:flex flex-col items-center gap-1 mb-8">
          <div className="w-10 h-10 bg-primary/20 rounded-none flex items-center justify-center border border-primary/50 text-primary font-display font-bold">
            B
          </div>
        </div>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span className={`flex flex-col items-center gap-1 p-2 rounded-none transition-colors cursor-pointer ${
              location.startsWith(item.href) 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] uppercase font-display hidden md:block mt-1">{item.label}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div className="min-h-screen md:pl-20 pb-16 md:pb-0 blueprint-grid">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/blueprint" component={Blueprint} />
        <Route path="/nutrition" component={Nutrition} />
        <Route path="/workouts" component={Workouts} />
        <Route path="/recovery" component={Recovery} />
        {/* Placeholder for missing routes mapping back to blueprint for demo */}
        <Route path="/progress" component={Blueprint} />
        <Route path="/profile" component={Blueprint} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  const { state } = useSystem();
  const isFailing = state.recoveryState === "breached";
  const isRebuilding = state.recoveryState === "rebuilding";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={`${isFailing ? "system-failing" : ""} ${isRebuilding ? "system-rebuilding" : ""} min-h-screen w-full`}>
          <Navigation />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
