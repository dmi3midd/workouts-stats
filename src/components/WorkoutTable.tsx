import { useMemo } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { useUIStore } from '../store/useUIStore';
import { filterByExercise, truncateToSets } from '../utils/dataTransform';

export const WorkoutTable = () => {
    const { t } = useTranslation();
    const { data, selectedExercise, selectedSetsCount } = useWorkoutStore();
    const { setSelectedWorkoutForDetail } = useUIStore();

    const filteredData = useMemo(() => {
        const processed = selectedSetsCount === 'all'
            ? data
            : data.map(entry => truncateToSets(entry, parseInt(selectedSetsCount)));
        return filterByExercise(processed, selectedExercise);
    }, [data, selectedExercise, selectedSetsCount]);

    return (
        <section className="glass-card mt-12 overflow-hidden p-0">
            <div className="flex justify-between items-center px-6 pt-6 pb-4">
                <h3 className="text-lg font-semibold">{t('preview.title')}</h3>
                <div className="text-slate-500 text-xs flex items-center gap-1">
                    <Info size={14} /> {t('preview.tip')}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.date')}</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.exercise')}</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.sets')}</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.reps')}</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.weight')}</th>
                            <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.volume')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.slice(0, 50).map((row, i) => (
                            <tr key={i}
                                onClick={() => setSelectedWorkoutForDetail(row)}
                                className="cursor-pointer hover:bg-white/2 transition-colors"
                            >
                                <td className="py-3 px-4 border-b border-white/5 text-sm">{row.date}</td>
                                <td className="py-3 px-4 border-b border-white/5 text-sm font-medium text-white">{row.exercise}</td>
                                <td className="py-3 px-4 border-b border-white/5 text-sm">{row.sets}</td>
                                <td className="py-3 px-4 border-b border-white/5 text-sm">{row.reps}</td>
                                <td className="py-3 px-4 border-b border-white/5 text-sm">{row.weight.toFixed(1)}</td>
                                <td className="py-3 px-4 border-b border-white/5 text-sm text-primary font-bold">{row.volume}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
