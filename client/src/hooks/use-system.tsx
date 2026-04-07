import { useState, useEffect } from 'react';

interface SystemState {
  streak: number;
  score: number;
  totalDays: number;
  completedDays: number;
  lastCompletedDate: string | null;
  hasSeenPhase2Celebration: boolean;
  recoveryState: "idle" | "breached" | "rebuilding";
}

const defaultState: SystemState = {
  streak: 0,
  score: 0,
  totalDays: 0,
  completedDays: 0,
  lastCompletedDate: null,
  hasSeenPhase2Celebration: false,
  recoveryState: "idle",
};

export function useSystem() {
  const [state, setState] = useState<SystemState>(() => {
    const saved = localStorage.getItem('system-execution-state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('system-execution-state', JSON.stringify(state));
  }, [state]);

  const submitDay = (train: boolean, nutrition: boolean, recovery: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    let newStreak = state.streak;
    let newScore = state.score;
    let newCompleted = state.completedDays;
    let recoveryState: SystemState["recoveryState"] = state.recoveryState;

    if (train && nutrition && recovery) {
      newStreak += 1;
      newScore += 1;
      newCompleted += 1;
      recoveryState = "idle";
    } else {
      newStreak = 0;
      recoveryState = "breached";
    }

    setState(prev => ({
      ...prev,
      streak: newStreak,
      score: newScore,
      totalDays: prev.totalDays + 1,
      completedDays: newCompleted,
      lastCompletedDate: today,
      recoveryState
    }));
    
    return { success: train && nutrition && recovery };
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

  return { state, submitDay, setHasSeenPhase2Celebration, startRecoveryProtocol };
}
