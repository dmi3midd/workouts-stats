export interface RawSet {
    setNumber: number;
    weight: number;
    reps: number;
}

export interface WorkoutEntry {
    date: string;
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
    volume: number;
    details: RawSet[];
}

export interface AnalyticsData {
    date: string;
    totalVolume: number;
    totalReps: number;
    maxWeight: number;
    workoutsCount: number;
    [key: string]: string | number; // For exercise-specific metrics
}

export interface ExerciseStats {
    exercise: string;
    maxWeight: number;
    avgWeight: number;
    totalVolume: number;
    data: WorkoutEntry[];
}
