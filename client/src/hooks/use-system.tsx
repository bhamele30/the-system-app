import { useState, useEffect } from 'react';

interface SystemState {
  streak: number;
  score: number;
  totalDays: number;
  completedDays: number;
  lastCompletedDate: string | null;
  hasSeenPhase2Celebration: boolean;
  recoveryState: "idle" | "breached" | "rebuilding";
  lastOutcome: "maintained" | "broken" | "restored" | null;
  exerciseLogs: Record<string, { weight: string, date: string }[]>;
  mode: "cut" | "build" | "maintain" | "lock-in";
}

const defaultState: SystemState = {
  streak: 0,
  score: 0,
  totalDays: 0,
  completedDays: 0,
  lastCompletedDate: null,
  hasSeenPhase2Celebration: false,
  recoveryState: "idle",
  lastOutcome: null,
  exerciseLogs: {},
  mode: "maintain",
};

const normalizeState = (savedState: Partial<SystemState>): SystemState => {
  const merged = {
    ...defaultState,
    ...savedState,
  } as SystemState;

  if (!savedState.recoveryState) {
    merged.recoveryState = merged.totalDays > 0 && merged.streak === 0 ? "breached" : "idle";
  }

  return merged;
};

export function useSystem() {
  const [state, setState] = useState<SystemState>(() => {
    const saved = localStorage.getItem('system-execution-state-v2');
    if (saved) {
      try {
        return normalizeState(JSON.parse(saved));
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('system-execution-state-v2', JSON.stringify(state));
  }, [state]);

  const submitDay = (train: boolean, nutrition: boolean, recovery: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const success = train && nutrition && recovery;
    const wasRecovering = state.recoveryState === "breached" || state.recoveryState === "rebuilding";

    let newStreak = state.streak;
    let newScore = state.score;
    let newCompleted = state.completedDays;
    let recoveryState: SystemState["recoveryState"] = state.recoveryState;
    let lastOutcome: SystemState["lastOutcome"] = state.lastOutcome;

    // For workouts, we only need training to be true to increment completed days
    if (train) {
      newCompleted += 1;
    }

    if (success) {
      newStreak += 1;
      newScore += 1;
      recoveryState = "idle";
      lastOutcome = wasRecovering ? "restored" : "maintained";
    } else {
      // If we're just submitting training and not the full day, don't break the streak yet
      if (!train || (train && !nutrition && !recovery)) {
        // Do nothing to streak if it's a partial submission
      } else {
        newStreak = 0;
        recoveryState = "breached";
        lastOutcome = "broken";
      }
    }

    setState(prev => ({
      ...prev,
      streak: newStreak,
      score: newScore,
      totalDays: success || (!train && !nutrition && !recovery) ? prev.totalDays + 1 : prev.totalDays,
      completedDays: newCompleted,
      lastCompletedDate: success ? today : prev.lastCompletedDate,
      recoveryState,
      lastOutcome
    }));
    
    return { success, restored: success && wasRecovering };
  };

  const completeWorkout = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setState(prev => {
      // Only increment streak once per day to prevent spamming, 
      // but we can increment completedDays to move them through the program.
      // Actually, for mockup purposes, let's just increment every time so they can test it easily.
      const newStreak = prev.streak + 1;
      const newCompleted = prev.completedDays + 1;
      const newTotal = prev.totalDays + 1;
      
      return {
        ...prev,
        streak: newStreak,
        score: prev.score + 1,
        totalDays: newTotal,
        completedDays: newCompleted,
        lastCompletedDate: today,
        recoveryState: "idle",
        lastOutcome: "maintained"
      };
    });
  };

  const setHasSeenPhase2Celebration = () => {
    setState(prev => ({
      ...prev,
      hasSeenPhase2Celebration: true
    }));
  };

  const startRecoveryProtocol = () => {
    setState(prev => ({
      ...prev,
      recoveryState: "rebuilding"
    }));
  };

  const logExerciseWeight = (exerciseName: string, weight: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setState(prev => {
      const logs = prev.exerciseLogs || {};
      const history = logs[exerciseName] || [];
      
      return {
        ...prev,
        exerciseLogs: {
          ...logs,
          [exerciseName]: [...history, { weight, date: today }]
        }
      };
    });
  };

  const setMode = (mode: SystemState["mode"]) => {
    setState(prev => ({ ...prev, mode }));
  };

  return { state, submitDay, completeWorkout, setHasSeenPhase2Celebration, startRecoveryProtocol, logExerciseWeight, setMode };
}
