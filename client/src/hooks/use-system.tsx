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
  targets?: {
    kcal: number;
    protein: number;
    carbs: number;
    fats: number;
    maintenanceKcal: number;
    recoveryPriority: string;
    hydration: string;
  };
  profile?: {
    classification: string;
  };
  customMealsLibrary: { id: string, food: string, calories: number, protein: number, carbs: number, fat: number }[];
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
  customMealsLibrary: [],
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

// Simple global state manager to ensure all components stay in sync
let globalState: SystemState = defaultState;
let isInitialized = false;

const initGlobalState = () => {
  if (isInitialized) return;
  isInitialized = true;
  const saved = localStorage.getItem('system-execution-state-v4');
  if (saved) {
    try {
      globalState = normalizeState(JSON.parse(saved));
    } catch (e) {
      globalState = defaultState;
    }
  }
};

const listeners = new Set<(state: SystemState) => void>();

const setGlobalState = (updater: (prev: SystemState) => SystemState) => {
  globalState = updater(globalState);
  localStorage.setItem('system-execution-state-v4', JSON.stringify(globalState));
  listeners.forEach(listener => listener(globalState));
};

export function useSystem() {
  initGlobalState();
  const [state, setState] = useState<SystemState>(globalState);

  // Check for missed days based on the 24-hour clock
  useEffect(() => {
    const checkMissedDays = () => {
      // We only check if the system has been started (totalDays > 0)
      if (globalState.totalDays === 0) return;

      const today = new Date().toISOString().split('T')[0];
      
      // If we've completed today, or we're already breached, nothing to do
      if (globalState.lastCompletedDate === today || globalState.recoveryState === "breached") {
        return;
      }

      // Check if it's past midnight of a day we haven't completed
      const now = new Date();
      // If they started the system today, give them until midnight.
      // If it's a new calendar day and they haven't submitted yesterday's log,
      // they have breached the system.
      if (globalState.lastCompletedDate) {
        const lastDate = new Date(globalState.lastCompletedDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // If more than 1 day has passed since the last completion (i.e. it is tomorrow, and they didn't complete today), they missed a day
        if (diffDays > 1 && globalState.recoveryState === "idle") {
          setGlobalState(prev => ({
            ...prev,
            streak: 0,
            recoveryState: "breached",
            lastOutcome: "broken"
          }));
        }
      } else if (globalState.totalDays > 0) {
          // Edge case: They started the system, but never logged Day 1, and now it's Day 2
          // We can't rely on lastCompletedDate, but we know totalDays > 0
          // If we had a strict "startDate" we could compare against it, but without one, 
          // we can check if they have any logs from before today.
          // For now, the safest way is ensuring the streak breaks if the 24 hr clock ticks over and nothing is logged.
          const hasLoggedAnything = Object.keys(globalState.exerciseLogs || {}).length > 0 || Object.keys(globalState.nutritionLogs || {}).length > 0;
          if (hasLoggedAnything) {
             setGlobalState(prev => ({
              ...prev,
              streak: 0,
              recoveryState: "breached",
              lastOutcome: "broken"
            }));
          }
      }
    };

    checkMissedDays();
    
    // Set up an interval to check periodically (e.g., every minute) in case they leave the app open overnight
    const interval = setInterval(checkMissedDays, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

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

    setGlobalState(prev => ({
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
    setGlobalState(prev => ({
      ...prev,
      hasSeenPhase2Celebration: true
    }));
  };

  const startRecoveryProtocol = () => {
    setGlobalState(prev => ({
      ...prev,
      recoveryState: "rebuilding"
    }));
  };

  const logExerciseWeight = (exerciseName: string, weight: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setGlobalState(prev => {
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

  const logNutrition = (food: string, calories: number, protein: number, carbs: number, fat: number, editId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newId = editId || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    setGlobalState(prev => {
      const logs = prev.nutritionLogs || {};
      const todayLogs = logs[today] || [];
      const currentIds = prev.loggedMealIds?.[today] || [];
      const library = prev.customMealsLibrary || [];
      
      let updatedLogs = todayLogs;
      let updatedIds = currentIds;
      let updatedLibrary = library;

      if (editId) {
        updatedLogs = todayLogs.map(log => 
          log.id === editId 
            ? { ...log, food, calories, protein, carbs, fat }
            : log
        );
        updatedLibrary = library.map(log => 
          log.id === editId 
            ? { ...log, food, calories, protein, carbs, fat }
            : log
        );
      } else {
        const newMealObj = { id: newId, food, calories, protein, carbs, fat };
        updatedLogs = [...todayLogs, newMealObj];
        updatedIds = [...currentIds, newId];
        updatedLibrary = [...library, newMealObj];
      }
      
      return {
        ...prev,
        nutritionLogs: {
          ...logs,
          [today]: updatedLogs
        },
        loggedMealIds: {
          ...(prev.loggedMealIds || {}),
          [today]: updatedIds
        },
        customMealsLibrary: updatedLibrary
      };
    });
  };

  const removeNutritionLog = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setGlobalState(prev => {
      const logs = prev.nutritionLogs || {};
      const todayLogs = logs[today] || [];
      const currentIds = prev.loggedMealIds?.[today] || [];
      return {
        ...prev,
        nutritionLogs: {
          ...logs,
          [today]: todayLogs.filter(log => log.id !== id)
        },
        loggedMealIds: {
          ...(prev.loggedMealIds || {}),
          [today]: currentIds.filter(mealId => mealId !== id)
        },
        customMealsLibrary: (prev.customMealsLibrary || []).filter(log => log.id !== id)
      }
    });
  };

  const toggleMealId = (mealId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setGlobalState(prev => {
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

  const setMode = (mode: SystemState["mode"], targets?: SystemState["targets"], profile?: SystemState["profile"]) => {
    setGlobalState(prev => ({ ...prev, mode, targets: targets || prev.targets, profile: profile || prev.profile }));
  };

  return { state, submitDay, setHasSeenPhase2Celebration, startRecoveryProtocol, logExerciseWeight, logNutrition, removeNutritionLog, toggleMealId, setMode };
}
