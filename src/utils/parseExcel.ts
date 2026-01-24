import * as XLSX from 'xlsx';
import type { WorkoutEntry } from '../types/workout';

export const parseExcelFile = async (file: File): Promise<WorkoutEntry[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

                // Normalize and validate
                const normalizedData: WorkoutEntry[] = rawData.map((row) => {
                    const date = row.Date || row.date || new Date().toISOString();
                    const exercise = row.Exercise || row.exercise || 'Unknown';

                    let totalReps = 0;
                    let totalSets = 0;
                    let totalWeight = 0;
                    let weightsFound = 0;
                    const rawSets: Record<number, { weight?: number; reps?: number }> = {};

                    // Look for Set X, kg and Set X, reps
                    Object.keys(row).forEach(key => {
                        const repsMatch = key.match(/Set (\d+), reps/i);
                        const kgMatch = key.match(/Set (\d+), kg/i);

                        if (repsMatch) {
                            const setNum = parseInt(repsMatch[1]);
                            const val = Number(row[key]);
                            if (!isNaN(val) && val > 0) {
                                if (!rawSets[setNum]) rawSets[setNum] = {};
                                rawSets[setNum].reps = val;
                                totalReps += val;
                                totalSets += 1;
                            }
                        }
                        if (kgMatch) {
                            const setNum = parseInt(kgMatch[1]);
                            const val = Number(row[key]);
                            if (!isNaN(val) && val > 0) {
                                if (!rawSets[setNum]) rawSets[setNum] = {};
                                rawSets[setNum].weight = val;
                                totalWeight += val;
                                weightsFound += 1;
                            }
                        }
                    });

                    const details = Object.entries(rawSets)
                        .map(([num, data]) => ({
                            setNumber: parseInt(num),
                            weight: data.weight || 0,
                            reps: data.reps || 0
                        }))
                        .sort((a, b) => a.setNumber - b.setNumber);

                    // If no specific set columns found, try generic mapping (fallback)
                    const sets = totalSets || Number(row.Sets || row.sets || 0);
                    const reps = totalReps || Number(row.Reps || row.reps || 0);
                    const avgWeightFromSets = weightsFound > 0 ? totalWeight / weightsFound : 0;
                    const weight = avgWeightFromSets || Number(row.Weight || row.weight || row['Weight (kg)'] || 0);

                    // Calculate volume: prefer 'Tonnage, kg', then sum of weight * reps for all sets, then fallback
                    const explicitVolume = Number(row['Tonnage, kg'] || row.volume);
                    const calculatedVolume = details.reduce((sum, set) => sum + (set.weight * set.reps), 0);
                    const volume = !isNaN(explicitVolume) && explicitVolume > 0 ? explicitVolume :
                        (calculatedVolume > 0 ? calculatedVolume : (sets * reps * weight));

                    return {
                        date: date instanceof Date ? new Date(date.getTime() + 86400000).toISOString().split('T')[0] :
                            (typeof date === 'number' ? new Date((date - (25567 + 1)) * 86400 * 1000).toISOString().split('T')[0] : String(date)),
                        exercise: String(exercise),
                        sets,
                        reps,
                        weight,
                        volume,
                        details,
                    };
                }).filter(entry => entry.exercise !== 'Unknown' && (entry.sets > 0 || entry.volume > 0));

                resolve(normalizedData);
            } catch (error) {
                console.error('Parsing error:', error);
                reject(new Error('Failed to parse Excel file. Please ensure the format is correct.'));
            }
        };

        reader.onerror = () => reject(new Error('File reading error.'));
        reader.readAsBinaryString(file);
    });
};
