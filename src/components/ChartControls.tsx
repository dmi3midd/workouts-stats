import React from 'react';
import { Filter, BarChart3, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChartControlsProps {
    exercises: string[];
    selectedExercise: string;
    onExerciseChange: (exercise: string) => void;
    selectedMetric: 'weight' | 'volume' | 'reps';
    onMetricChange: (metric: 'weight' | 'volume' | 'reps') => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
    exercises,
    selectedExercise,
    onExerciseChange,
    selectedMetric,
    onMetricChange,
}) => {
    const { t } = useTranslation();
    return (
        <div className="glass-card" style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-400)' }}>{t('controls.exercise')}</span>
                    <select
                        value={selectedExercise}
                        onChange={(e) => onExerciseChange(e.target.value)}
                        style={{
                            fontSize: '0.875rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >

                        {exercises.map((ex) => (
                            <option key={ex} value={ex} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                                {ex === 'All' ? t('controls.all') : ex}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-400)' }}>{t('controls.metric')}</span>
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'var(--primary-muted)',
                        borderRadius: '0.5rem',
                        padding: '0.25rem'
                    }}>
                        {(['volume', 'weight', 'reps'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => onMetricChange(m)}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    borderRadius: '0.375rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: selectedMetric === m ? 'var(--primary)' : 'transparent',
                                    color: selectedMetric === m ? 'var(--background)' : 'var(--slate-400)'
                                }}
                            >
                                {t(`metrics.${m}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-400)', opacity: 0.5, fontSize: '0.75rem' }}>
                <BarChart3 size={14} />
                <span>{t('controls.live_viz')}</span>
            </div>
        </div>
    );
};
