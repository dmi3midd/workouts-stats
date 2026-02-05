import { create } from 'zustand';
import type { WorkoutEntry } from '../types/workout';

interface UIState {
    isLoading: boolean;
    error: string | null;
    fileName: string | null;
    selectedWorkoutForDetail: WorkoutEntry | null;

    // Actions
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setFileName: (fileName: string | null) => void;
    setSelectedWorkoutForDetail: (workout: WorkoutEntry | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isLoading: false,
    error: null,
    fileName: null,
    selectedWorkoutForDetail: null,

    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setFileName: (fileName) => set({ fileName }),
    setSelectedWorkoutForDetail: (selectedWorkoutForDetail) => set({ selectedWorkoutForDetail }),
}));
