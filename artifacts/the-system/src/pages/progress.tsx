import { useMemo } from "react";
import { Flame, Lock, CheckCircle2, Circle, Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import { useSystem } from "@/hooks/use-system";

const TOTAL_DAYS = 30;

const MILESTONES: Record<number, { label: string; icon: string; description: string }> = {
  7: {
    label: "WEEK 1 COMPLETE",
    icon: "🔥",
    description: "First week locked in. Momentum is building.",
  },
  14: {
    label: "HALFWAY MARK",
    icon: "⚡",
    description: "Two weeks of execution. The system is taking hold.",
  },
  21: {
    label: "ONE WEEK LEFT",
    icon: "🏆",
    description: "21 days sets a habit. You are the system now.",
  },
  30: {
    label: "PHASE 1 COMPLETE",
    icon: "💎",
    description: "Phase 1 complete. Foundation built. Phase 2 begins now.",
  },
};

export default function Progress() {
  const { state } = useSystem();

  const today = new Date().toISOString().split("T")[0];
  const hasLoggedToday = state.lastCompletedDate === today;
  const daysRemaining = Math.max(0, TOTAL_DAYS - state.completedDays);
  const consistencyPct =
    state.totalDays > 0
      ? Math.round((state.completedDays / state.totalDays) * 100)
      : 0;

  const activeDayIndex = useMemo(() => {
    if (state.completedDays >= TOTAL_DAYS) return -1;
    if (hasLoggedToday) return -1;
    return state.completedDays;
  }, [state.completedDays, hasLoggedToday]);

  const unlockedMilestones = useMemo(
    () =>
      Object.entries(MILESTONES)
        .filter(([day]) => state.completedDays >= Number(day))
        .map(([day, m]) => ({ day: Number(day), ...m })),
    [state.completedDays]
  );

  const nextMilestone = useMemo(() => {
    const upcoming = Object.entries(MILESTONES)
      .filter(([day]) => state.completedDays < Number(day))
      .sort(([a], [b]) => Number(a) - Number(b));
    return upcoming.length > 0
      ? { day: Number(upcoming[0][0]), ...upcoming[0][1] }
      : null;
  }, [state.completedDays]);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-in fade-in duration-700">
      {/* Header */}
      <header className="mb-10">
        <div className="text-primary font-display font-medium tracking-widest text-xs mb-2 uppercase">
          Phase 1: Lock In
        </div>
        <h1 className="text-4xl font-bold text-glow mb-2">PROGRESS REPORT</h1>
        <p className="text-muted-foreground text-sm">
          Your execution record. Every day counts.
        </p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={<Flame className={`w-5 h-5 ${state.streak > 0 ? "text-orange-400" : "text-muted-foreground"}`} />}
          label="CURRENT STREAK"
          value={state.streak.toString()}
          unit="days"
          highlight={state.streak > 0}
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-primary" />}
          label="DAYS COMPLETED"
          value={state.completedDays.toString()}
          unit={`/ ${TOTAL_DAYS}`}
        />
        <StatCard
          icon={<Target className="w-5 h-5 text-blue-400" />}
          label="DAYS REMAINING"
          value={daysRemaining.toString()}
          unit="days"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
          label="CONSISTENCY"
          value={`${consistencyPct}%`}
          unit=""
        />
      </div>

      {/* Next Milestone Banner */}
      {nextMilestone && state.completedDays < TOTAL_DAYS && (
        <div className="mb-8 glass-panel p-4 border border-primary/20 rounded-none flex items-center gap-4">
          <div className="text-2xl">{nextMilestone.icon}</div>
          <div className="flex-1">
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-display mb-0.5">
              Next Milestone — Day {nextMilestone.day}
            </div>
            <div className="font-bold text-sm uppercase tracking-widest text-primary">
              {nextMilestone.label}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-display text-white">
              {nextMilestone.day - state.completedDays}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
              days away
            </div>
          </div>
        </div>
      )}

      {/* 30-Day Calendar Grid */}
      <section className="glass-panel p-6 rounded-none mb-8">
        <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> 30-DAY EXECUTION GRID
        </h2>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {Array.from({ length: TOTAL_DAYS }, (_, i) => {
            const dayNum = i + 1;
            const isCompleted = dayNum <= state.completedDays;
            const isActive = i === activeDayIndex;
            const isLocked = !isCompleted && !isActive;
            const isMilestone = dayNum in MILESTONES;

            return (
              <div
                key={dayNum}
                className={`
                  relative aspect-square flex flex-col items-center justify-center rounded-none border text-center transition-all
                  ${isCompleted
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : isActive
                    ? "bg-primary/5 border-primary animate-pulse"
                    : "bg-white/2 border-white/5 text-muted-foreground/40"
                  }
                  ${isMilestone && isCompleted ? "ring-1 ring-primary/60" : ""}
                `}
              >
                {/* Milestone star */}
                {isMilestone && (
                  <div className={`absolute -top-1 -right-1 text-[8px] ${isCompleted ? "opacity-100" : "opacity-20"}`}>
                    ★
                  </div>
                )}

                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-primary mb-0.5" />
                ) : isActive ? (
                  <Circle className="w-4 h-4 text-primary mb-0.5" />
                ) : (
                  <Lock className="w-3 h-3 mb-0.5 text-muted-foreground/30" />
                )}

                <span className={`text-[10px] font-display font-bold leading-none ${
                  isCompleted ? "text-primary" : isActive ? "text-primary/80" : "text-muted-foreground/30"
                }`}>
                  {dayNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 text-[10px] text-muted-foreground uppercase tracking-widest font-display">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-primary" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <Circle className="w-3 h-3 text-primary/70" /> Active
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Locked
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <span className="text-primary text-[9px]">★</span> Milestone
          </span>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="glass-panel p-6 rounded-none">
        <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" /> MILESTONES
        </h2>

        <div className="space-y-3">
          {Object.entries(MILESTONES).map(([day, milestone]) => {
            const dayNum = Number(day);
            const achieved = state.completedDays >= dayNum;
            return (
              <div
                key={day}
                className={`flex items-center gap-4 p-4 border rounded-none transition-all ${
                  achieved
                    ? "border-primary/30 bg-primary/5"
                    : "border-white/5 bg-white/2 opacity-50"
                }`}
              >
                <div className={`text-2xl ${achieved ? "opacity-100" : "opacity-30"}`}>
                  {milestone.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-display font-bold uppercase tracking-widest ${achieved ? "text-primary" : "text-muted-foreground"}`}>
                      {milestone.label}
                    </span>
                    {achieved && (
                      <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 font-display uppercase tracking-widest">
                        ACHIEVED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </div>
                <div className={`text-right ${achieved ? "text-primary" : "text-muted-foreground/40"}`}>
                  <div className="text-lg font-bold font-display">Day {day}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Unlocked Milestone Celebration */}
      {unlockedMilestones.length > 0 && (
        <div className="mt-6 p-4 border border-primary/20 bg-primary/5 rounded-none text-center">
          <div className="text-primary text-xs font-display uppercase tracking-widest font-bold mb-1">
            Latest Achievement
          </div>
          <div className="text-2xl mb-1">{unlockedMilestones[unlockedMilestones.length - 1].icon}</div>
          <div className="font-bold uppercase tracking-widest text-white">
            {unlockedMilestones[unlockedMilestones.length - 1].label}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {unlockedMilestones[unlockedMilestones.length - 1].description}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className={`glass-panel p-4 rounded-none border ${highlight ? "border-orange-500/30 bg-orange-500/5" : "border-white/5"}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[9px] font-display text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold font-display ${highlight ? "text-orange-400" : "text-white"}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground">{unit}</span>
        )}
      </div>
    </div>
  );
}
