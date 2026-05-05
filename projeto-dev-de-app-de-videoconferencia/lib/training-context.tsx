import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

export type ParticipantRole = 'instructor' | 'student';

export interface TrainingSession {
  roomId: string;
  userName: string;
  userRole: ParticipantRole;
  avatarUrl?: string;
}

export interface TimerState {
  isRunning: boolean;
  seconds: number;
  minutes: number;
  hours: number;
}

export interface WorkoutActivity {
  id: string;
  name: string;
  duration: number;
  repetitions: number;
  currentReps: number;
  isCompleted: boolean;
}

export interface TrainingState {
  session: TrainingSession | null;
  timer: TimerState;
  currentReps: number;
  activities: WorkoutActivity[];
  currentActivityIndex: number;
  isConnected: boolean;
  error: string | null;
}

export type TrainingAction =
  | { type: 'SET_SESSION'; payload: TrainingSession }
  | { type: 'CLEAR_SESSION' }
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'INCREMENT_REPS' }
  | { type: 'DECREMENT_REPS' }
  | { type: 'SET_REPS'; payload: number }
  | { type: 'NEXT_ACTIVITY' }
  | { type: 'SET_ACTIVITIES'; payload: WorkoutActivity[] }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: TrainingState = {
  session: null,
  timer: {
    isRunning: false,
    seconds: 0,
    minutes: 0,
    hours: 0,
  },
  currentReps: 0,
  activities: [],
  currentActivityIndex: 0,
  isConnected: false,
  error: null,
};

function trainingReducer(state: TrainingState, action: TrainingAction): TrainingState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload };

    case 'CLEAR_SESSION':
      return { ...state, session: null };

    case 'START_TIMER':
      return { ...state, timer: { ...state.timer, isRunning: true } };

    case 'PAUSE_TIMER':
      return { ...state, timer: { ...state.timer, isRunning: false } };

    case 'RESET_TIMER':
      return {
        ...state,
        timer: { isRunning: false, seconds: 0, minutes: 0, hours: 0 },
        currentReps: 0,
      };

    case 'TICK_TIMER': {
      const { seconds, minutes, hours } = state.timer;
      let newSeconds = seconds + 1;
      let newMinutes = minutes;
      let newHours = hours;

      if (newSeconds >= 60) {
        newSeconds = 0;
        newMinutes += 1;
      }

      if (newMinutes >= 60) {
        newMinutes = 0;
        newHours += 1;
      }

      return {
        ...state,
        timer: {
          ...state.timer,
          seconds: newSeconds,
          minutes: newMinutes,
          hours: newHours,
        },
      };
    }

    case 'INCREMENT_REPS':
      return { ...state, currentReps: state.currentReps + 1 };

    case 'DECREMENT_REPS':
      return { ...state, currentReps: Math.max(0, state.currentReps - 1) };

    case 'SET_REPS':
      return { ...state, currentReps: action.payload };

    case 'NEXT_ACTIVITY':
      return {
        ...state,
        currentActivityIndex: Math.min(
          state.currentActivityIndex + 1,
          state.activities.length - 1
        ),
        currentReps: 0,
      };

    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };

    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

interface TrainingContextType {
  state: TrainingState;
  setSession: (session: TrainingSession) => void;
  clearSession: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  incrementReps: () => void;
  decrementReps: () => void;
  setReps: (reps: number) => void;
  nextActivity: () => void;
  setActivities: (activities: WorkoutActivity[]) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(trainingReducer, initialState);

  const setSession = useCallback((session: TrainingSession) => {
    dispatch({ type: 'SET_SESSION', payload: session });
  }, []);

  const clearSession = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSION' });
  }, []);

  const startTimer = useCallback(() => {
    dispatch({ type: 'START_TIMER' });
  }, []);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
  }, []);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET_TIMER' });
  }, []);

  const tickTimer = useCallback(() => {
    dispatch({ type: 'TICK_TIMER' });
  }, []);

  const incrementReps = useCallback(() => {
    dispatch({ type: 'INCREMENT_REPS' });
  }, []);

  const decrementReps = useCallback(() => {
    dispatch({ type: 'DECREMENT_REPS' });
  }, []);

  const setReps = useCallback((reps: number) => {
    dispatch({ type: 'SET_REPS', payload: reps });
  }, []);

  const nextActivity = useCallback(() => {
    dispatch({ type: 'NEXT_ACTIVITY' });
  }, []);

  const setActivities = useCallback((activities: WorkoutActivity[]) => {
    dispatch({ type: 'SET_ACTIVITIES', payload: activities });
  }, []);

  const setConnected = useCallback((connected: boolean) => {
    dispatch({ type: 'SET_CONNECTED', payload: connected });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value: TrainingContextType = {
    state,
    setSession,
    clearSession,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
    incrementReps,
    decrementReps,
    setReps,
    nextActivity,
    setActivities,
    setConnected,
    setError,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within TrainingProvider');
  }
  return context;
}
