import React from 'react';
import { Filter, BarChart3, TrendingUp } from 'lucide-react';

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
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-400)' }}>Exercise:</span>
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
                            <option key={ex} value={ex} style={{ backgroundColor: '#1a1a1a' }}>
                                {ex}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--slate-400)' }}>Metric:</span>
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'rgba(255,255,255,0.05)',
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
                                    color: selectedMetric === m ? 'white' : 'var(--slate-400)'
                                }}
                            >
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
                <BarChart3 size={14} />
                <span>Live visualization based on filtered data</span>
            </div>
        </div>
    );
};
