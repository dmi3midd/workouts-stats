import React from 'react';
import { X } from 'lucide-react';
import type { WorkoutEntry } from '../types/workout';
import { useTranslation } from 'react-i18next';

interface WorkoutDetailModalProps {
    workout: WorkoutEntry | null;
    onClose: () => void;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({ workout, onClose }) => {
    const { t } = useTranslation();
    if (!workout) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#181A2f]/80 backdrop-blur-sm" onClick={onClose}>
            <div
                className="glass-card animate-fade-in w-full max-w-[500px] max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {t('modals.detail.workout_details')}
                        </h2>
                        <p className="text-sm text-slate-400">{workout.date}</p>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-none text-slate-400 cursor-pointer p-2 flex rounded-full transition-colors hover:bg-white/5">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass p-4 text-center">
                        <p className="text-[0.75rem] text-slate-400 uppercase mb-1">Total Volume</p>
                        <p className="text-xl font-bold text-primary">{workout.volume} kg</p>
                    </div>
                    <div className="glass p-4 text-center">
                        <p className="text-[0.75rem] text-slate-400 uppercase mb-1">Avg Weight</p>
                        <p className="text-xl font-bold text-white">{workout.weight.toFixed(1)} kg</p>
                    </div>
                </div>

                <h3 className="text-base font-semibold mb-4 text-slate-400">Set Breakdown</h3>
                <div className="flex flex-col gap-3">
                    {workout.details.length > 0 ? (
                        workout.details.map((set) => (
                            <div key={set.setNumber} className="flex items-center justify-between p-3 px-4 bg-white/2 rounded-lg border border-white/5">
                                <div className="flex items-center gap-4">
                                    <span className="w-10 h-6 flex items-center justify-center bg-primary-muted rounded-md text-[0.75rem] text-primary">
                                        {t('modals.detail.set')} {set.setNumber}
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-semibold text-white">{set.weight}</span>
                                        <span className="text-[0.75rem] text-slate-500">{t('modals.detail.kg')}</span>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-semibold text-primary">{set.reps}</span>
                                    <span className="text-[0.75rem] text-slate-500">{t('modals.detail.reps')}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 text-sm italic">
                            No detailed set data available for this workout.
                        </p>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <button onClick={onClose} className="btn-primary w-full">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
