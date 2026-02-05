import { create } from 'zustand';
import * as XLSX from 'xlsx';
import type { WorkoutEntry } from '../types/workout';
import { readWorkbook, parseExcelFile } from '../utils/parseExcel';

interface WorkoutState {
    data: WorkoutEntry[];
    workbook: XLSX.WorkBook | null;
    sheetNames: string[];
    selectedSheet: string | "__all__";
    selectedExercise: string;
    selectedMetric: 'weight' | 'volume' | 'reps';
    selectedSetsCount: string;

    // Actions
    setData: (data: WorkoutEntry[]) => void;
    setWorkbook: (workbook: XLSX.WorkBook | null) => void;
    setSheetNames: (names: string[]) => void;
    setSelectedSheet: (sheet: string | "__all__") => void;
    setSelectedExercise: (exercise: string) => void;
    setSelectedMetric: (metric: 'weight' | 'volume' | 'reps') => void;
    setSelectedSetsCount: (count: string) => void;
    clearData: () => void;

    // Complex Actions
    loadFile: (file: File, t: (key: string) => string, startLoading: () => void, stopLoading: () => void, setError: (err: string | null) => void, setFileName: (name: string | null) => void) => Promise<void>;
    changeSheet: (sheetName: string | "__all__", t: (key: string) => string, startLoading: () => void, stopLoading: () => void, setError: (err: string | null) => void) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    data: [],
    workbook: null,
    sheetNames: [],
    selectedSheet: "",
    selectedExercise: "",
    selectedMetric: 'volume',
    selectedSetsCount: 'all',

    setData: (data) => set({ data }),
    setWorkbook: (workbook) => set({ workbook }),
    setSheetNames: (sheetNames) => set({ sheetNames }),
    setSelectedSheet: (selectedSheet) => set({ selectedSheet }),
    setSelectedExercise: (selectedExercise) => set({ selectedExercise }),
    setSelectedMetric: (selectedMetric) => set({ selectedMetric }),
    setSelectedSetsCount: (selectedSetsCount) => set({ selectedSetsCount }),
    clearData: () => set({
        data: [],
        workbook: null,
        sheetNames: [],
        selectedSheet: "",
        selectedExercise: "",
        selectedSetsCount: 'all',
    }),

    loadFile: async (file, t, startLoading, stopLoading, setError, setFileName) => {
        const MAX_SIZE = 6 * 1024 * 1024; // 6MB
        if (file.size > MAX_SIZE) {
            setError(t('uploader.error_size'));
            return;
        }

        startLoading();
        setError(null);
        try {
            const wb = await readWorkbook(file);
            const names = wb.SheetNames;
            set({ workbook: wb, sheetNames: names, selectedSheet: names[0] });
            setFileName(file.name);

            const parsedData = await parseExcelFile(wb, names[0]);
            set({ data: parsedData });

            const uniqueExercises = Array.from(new Set(parsedData.map(d => d.exercise)));
            if (uniqueExercises.length > 0) {
                set({ selectedExercise: uniqueExercises[0] });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            stopLoading();
        }
    },

    changeSheet: async (sheetName, t, startLoading, stopLoading, setError) => {
        const { workbook, selectedExercise } = get();
        if (!workbook) return;

        startLoading();
        try {
            set({ selectedSheet: sheetName });
            const parsedData = await parseExcelFile(workbook, sheetName);
            set({ data: parsedData });

            const uniqueExercises = Array.from(new Set(parsedData.map(d => d.exercise)));
            if (uniqueExercises.length > 0 && !uniqueExercises.includes(selectedExercise)) {
                set({ selectedExercise: uniqueExercises[0] });
            }
        } catch (err) {
            setError(t('uploader.error_parse'));
        } finally {
            stopLoading();
        }
    }
}));
