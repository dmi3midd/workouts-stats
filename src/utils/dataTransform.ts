import type { WorkoutEntry, AnalyticsData, ExerciseStats } from '../types/workout';

export const groupByDate = (data: WorkoutEntry[]): AnalyticsData[] => {
    const groups: Record<string, AnalyticsData> = {};

    data.forEach((entry) => {
        if (!groups[entry.date]) {
            groups[entry.date] = {
                date: entry.date,
                totalVolume: 0,
                totalReps: 0,
                maxWeight: 0,
                workoutsCount: 0,
            };
        }

        groups[entry.date].totalVolume += entry.volume;
        groups[entry.date].totalReps += entry.reps;
        groups[entry.date].maxWeight = Math.max(groups[entry.date].maxWeight, entry.weight);
        groups[entry.date].workoutsCount += 1;
    });

    return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date));
};

export const getExerciseStats = (data: WorkoutEntry[]): ExerciseStats[] => {
    const stats: Record<string, ExerciseStats> = {};

    data.forEach((entry) => {
        if (!stats[entry.exercise]) {
            stats[entry.exercise] = {
                exercise: entry.exercise,
                maxWeight: 0,
                avgWeight: 0,
                totalVolume: 0,
                data: [],
            };
        }

        const s = stats[entry.exercise];
        s.maxWeight = Math.max(s.maxWeight, entry.weight);
        s.totalVolume += entry.volume;
        s.data.push(entry);
    });

    return Object.values(stats).map((s) => ({
        ...s,
        avgWeight: s.totalVolume / s.data.reduce((acc, curr) => acc + curr.reps, 0) || 0,
    }));
};

export const filterByExercise = (data: WorkoutEntry[], exercise: string): WorkoutEntry[] => {
    if (!exercise || exercise === 'All') return data;
    return data.filter((entry) => entry.exercise === exercise);
};
