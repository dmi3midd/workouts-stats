import React from 'react';
import { Filter, BarChart3, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChartControlsProps {
    exercises: string[];
    selectedExercise: string;
    onExerciseChange: (exercise: string) => void;
    selectedMetric: 'weight' | 'volume' | 'reps';
    onMetricChange: (metric: 'weight' | 'volume' | 'reps') => void;
    selectedSetsCount: string;
    onSetsCountChange: (count: string) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
    exercises,
    selectedExercise,
    onExerciseChange,
    selectedMetric,
    onMetricChange,
    selectedSetsCount,
    onSetsCountChange,
}) => {
    const { t } = useTranslation();
    const setOptions = ['all', '1', '2', '3', '4'];

    return (
        <div className="glass-card flex flex-wrap items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-primary" />
                    <span className="text-sm font-medium text-slate-400">{t('controls.exercise')}</span>
                    <select
                        value={selectedExercise}
                        onChange={(e) => onExerciseChange(e.target.value)}
                        className="text-sm outline-none cursor-pointer"
                    >
                        {exercises.map((ex) => (
                            <option key={ex} value={ex} className="bg-background text-foreground">
                                {ex === 'All' ? t('controls.all') : ex}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-primary" />
                    <span className="text-sm font-medium text-slate-400">{t('controls.sets')}</span>
                    <select
                        value={selectedSetsCount}
                        onChange={(e) => onSetsCountChange(e.target.value)}
                        className="text-sm outline-none cursor-pointer"
                    >
                        {setOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-background text-foreground">
                                {opt === 'all' ? t('controls.all_sets') : opt}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    <span className="text-sm font-medium text-slate-400">{t('controls.metric')}</span>
                    <div className="flex bg-primary-muted rounded-lg p-1">
                        {(['volume', 'weight', 'reps'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => onMetricChange(m)}
                                className={`px-3 py-1 text-[0.75rem] font-medium rounded-md cursor-pointer transition-all ${selectedMetric === m
                                    ? 'bg-primary text-background'
                                    : 'bg-transparent text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {t(`metrics.${m}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 opacity-50 text-[0.75rem]">
                <BarChart3 size={14} />
                <span>{t('controls.live_viz')}</span>
            </div>
        </div>
    );
};

