import React, { useState, useRef, useEffect } from 'react';
import { Filter, BarChart3, TrendingUp, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWorkoutStore } from '../store/useWorkoutStore';

export const ChartControls: React.FC = () => {
    const { t } = useTranslation();
    const {
        data,
        selectedExercise, setSelectedExercise,
        selectedMetric, setSelectedMetric,
        selectedSetsCount, setSelectedSetsCount
    } = useWorkoutStore();

    const exercises = React.useMemo(() => {
        return Array.from(new Set(data.map((d) => d.exercise)));
    }, [data]);

    const [isExOpen, setIsExOpen] = useState(false);
    const exRef = useRef<HTMLDivElement>(null);

    const setOptions = ['all', '1', '2', '3', '4'];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exRef.current && !exRef.current.contains(event.target as Node)) {
                setIsExOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="glass-card flex flex-wrap items-center justify-between gap-6 mb-8 relative z-50">
            <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 relative" ref={exRef}>
                    <Filter size={18} className="text-primary" />
                    <span className="text-sm font-medium text-slate-400">{t('controls.exercise')}</span>
                    <button
                        onClick={() => setIsExOpen(!isExOpen)}
                        className="flex items-center gap-2 text-sm bg-white/5 border border-card-border rounded-lg px-3 py-1.5 hover:bg-white/10 transition-all text-white min-w-[180px] justify-between group cursor-pointer"
                    >
                        <span className="truncate max-w-[150px]">
                            {selectedExercise === 'All' ? t('controls.all') : selectedExercise}
                        </span>
                        <ChevronDown size={14} className={`text-primary transition-transform duration-200 ${isExOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full min-w-[220px] bg-[#1a1c31]/85 backdrop-blur-3xl z-[100] shadow-2xl py-2 max-h-[300px] overflow-y-auto animate-fade-in border border-white/10 rounded-xl">
                            {exercises.map((ex) => (
                                <button
                                    key={ex}
                                    onClick={() => {
                                        setSelectedExercise(ex);
                                        setIsExOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary/10 cursor-pointer ${selectedExercise === ex ? 'text-primary font-bold bg-white/5' : 'text-slate-300'
                                        }`}
                                >
                                    {ex === 'All' ? t('controls.all') : ex}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-primary" />
                    <span className="text-sm font-medium text-slate-400">{t('controls.sets')}</span>
                    <div className="flex bg-primary-muted rounded-lg p-1">
                        {setOptions.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setSelectedSetsCount(opt)}
                                className={`px-3 py-1 text-[0.75rem] font-medium rounded-md cursor-pointer transition-all ${selectedSetsCount === opt
                                    ? 'bg-primary text-background'
                                    : 'bg-transparent text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {opt === 'all' ? t('controls.all_sets') : opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-primary" />
                    <span className="text-sm font-medium text-slate-400">{t('controls.metric')}</span>
                    <div className="flex bg-primary-muted rounded-lg p-1">
                        {(['volume', 'weight', 'reps'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setSelectedMetric(m)}
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

