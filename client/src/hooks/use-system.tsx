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
  nutritionLogs: Record<string, { id: string, food: string, calories: number, protein: number, carbs: number, fat: number }[]>;
  loggedMealIds: Record<string, string[]>;
  mode: "Operator Lean" | "Athletic Build" | "Elite Conditioning" | "Lean Mass Phase" | "Performance Build" | "Recomp Phase" | "lock-in" | "cut" | "build";
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
  nutritionLogs: {},
  loggedMealIds: {},
  mode: "lock-in",
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
    const saved = localStorage.getItem('system-execution-state-v4');
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
    localStorage.setItem('system-execution-state-v4', JSON.stringify(state));
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

    if (success) {
      newStreak += 1;
      newScore += 1;
      newCompleted += 1;
      recoveryState = "idle";
      lastOutcome = wasRecovering ? "restored" : "maintained";
    } else {
      newStreak = 0;
      recoveryState = "breached";
      lastOutcome = "broken";
    }

    setState(prev => ({
      ...prev,
      streak: newStreak,
      score: newScore,
      totalDays: prev.totalDays + 1,
      completedDays: newCompleted,
      lastCompletedDate: today,
      recoveryState,
      lastOutcome
    }));
    
    return { success, restored: success && wasRecovering };
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

  const logNutrition = (food: string, calories: number, protein: number, carbs: number, fat: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    setState(prev => {
      const logs = prev.nutritionLogs || {};
      const todayLogs = logs[today] || [];
      const currentIds = prev.loggedMealIds?.[today] || [];
      
      return {
        ...prev,
        nutritionLogs: {
          ...logs,
          [today]: [...todayLogs, { 
            id: newId, 
            food, 
            calories, 
            protein, 
            carbs, 
            fat 
          }]
        },
        loggedMealIds: {
          ...(prev.loggedMealIds || {}),
          [today]: [...currentIds, newId]
        }
      };
    });
  };

  const removeNutritionLog = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const logs = prev.nutritionLogs || {};
      const todayLogs = logs[today] || [];
      return {
        ...prev,
        nutritionLogs: {
          ...logs,
          [today]: todayLogs.filter(log => log.id !== id)
        }
      }
    });
  };

  const toggleMealId = (mealId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
        const currentIds = prev.loggedMealIds?.[today] || [];
        const newIds = currentIds.includes(mealId) 
            ? currentIds.filter(id => id !== mealId) 
            : [...currentIds, mealId];
        
        return {
            ...prev,
            loggedMealIds: {
                ...(prev.loggedMealIds || {}),
                [today]: newIds
            }
        };
    });
  };

  const setMode = (mode: SystemState["mode"]) => {
    setState(prev => ({ ...prev, mode }));
  };

  return { state, submitDay, setHasSeenPhase2Celebration, startRecoveryProtocol, logExerciseWeight, logNutrition, removeNutritionLog, toggleMealId, setMode };
}
