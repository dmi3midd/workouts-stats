import React from 'react';
import { X, Calendar, Weight, Hash } from 'lucide-react';
import type { WorkoutEntry } from '../types/workout';

interface WorkoutDetailModalProps {
    workout: WorkoutEntry | null;
    onClose: () => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({ workout, onClose }) => {
    if (!workout) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backgroundColor: 'rgba(24, 26, 47, 0.8)',
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div
                className="glass-card animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
                            {workout.exercise}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={14} /> {workout.date}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        transition: 'background 0.2s'
                    }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="glass" style={{ padding: '1rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Volume</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{workout.volume} kg</p>
                    </div>
                    <div className="glass" style={{ padding: '1rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Avg Weight</p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{workout.weight.toFixed(1)} kg</p>
                    </div>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--slate-400)' }}>Set Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {workout.details.length > 0 ? (
                        workout.details.map((set) => (
                            <div key={set.setNumber} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem 1rem',
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                borderRadius: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        width: '1.5rem',
                                        height: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'var(--primary-muted)',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.75rem',
                                        color: 'var(--primary)'
                                    }}>
                                        {set.setNumber}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Weight size={14} style={{ color: 'var(--primary)' }} />
                                        <span style={{ fontWeight: 500 }}>{set.weight} kg</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Hash size={14} style={{ color: 'var(--slate-400)' }} />
                                    <span>{set.reps} reps</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                            No detailed set data available for this workout.
                        </p>
                    )}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
