import React from 'react';
import { X, Info, FileSpreadsheet } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const headers = [
        t('preview.headers.date'),
        t('preview.headers.exercise'),
        `${t('modals.detail.set')} 1, ${t('modals.detail.kg')}`,
        `${t('modals.detail.set')} 1, ${t('modals.detail.reps')}`,
        `${t('modals.detail.set')} 2, ${t('modals.detail.kg')}`,
        `${t('modals.detail.set')} 2, ${t('modals.detail.reps')}`,
        t('modals.info.tonnage_opt')
    ];
    const mockData = [
        ['2024-01-20', 'Bench Press', '80', '10', '80', '8', '1440'],
        ['2024-01-20', 'Squats', '100', '12', '100', '10', '2200'],
        ['2024-01-22', 'Deadlift', '140', '5', '140', '5', '1400'],
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#181A2f]/85 backdrop-blur-md" onClick={onClose}>
            <div
                className="glass-card animate-fade-in w-full max-w-[800px] max-h-[90vh] overflow-y-auto relative border border-card-border p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-muted rounded-lg text-primary flex">
                            <FileSpreadsheet size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {t('modals.info.title')}
                            </h2>
                            <p className="text-sm text-slate-400">
                                {t('sheets.tip')}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-none text-slate-400 cursor-pointer p-2 flex rounded-full transition-colors hover:bg-white/5">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/20">
                    <table className="w-full border-collapse table-fixed">
                        <thead>
                            <tr>
                                <th className="p-2 px-3 bg-primary-muted/20 text-slate-500 w-10 text-center font-medium border border-card-border text-[0.8125rem]"></th>
                                {columns.map(col => (
                                    <th key={col} className="p-2 px-3 bg-primary-muted/5 text-slate-400 font-semibold text-center border border-card-border text-[0.8125rem] truncate">{col}</th>
                                ))}
                            </tr>
                            <tr>
                                <td className="p-2 px-3 bg-primary-muted/20 text-slate-500 text-center font-medium border border-card-border text-[0.8125rem]">1</td>
                                {headers.map((h, i) => (
                                    <td key={i} className="p-2 px-3 text-primary font-semibold border border-card-border text-[0.8125rem] truncate">{h}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="p-2 px-3 bg-primary-muted/20 text-slate-500 text-center font-medium border border-card-border text-[0.8125rem]">{rowIndex + 2}</td>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-2 px-3 text-slate-300 border border-card-border text-[0.8125rem] truncate">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex gap-3 p-4 bg-primary-muted border border-card-border rounded-xl">
                        <Info size={18} className="text-primary shrink-0" />
                        <p className="text-sm text-slate-300 leading-relaxed">
                            <Trans i18nKey="modals.info.tonnage_tip" />
                        </p>
                    </div>
                    <div className="flex gap-3 p-4 bg-primary-muted border border-card-border rounded-xl">
                        <Info size={18} className="text-primary shrink-0" />
                        <p className="text-sm text-slate-300 leading-relaxed">
                            <Trans i18nKey="modals.info.ai_tip" />
                        </p>
                    </div>

                    <button onClick={onClose} className="btn-primary w-full">
                        {t('modals.info.got_it')}
                    </button>
                </div>
            </div>
        </div>
    );
};
