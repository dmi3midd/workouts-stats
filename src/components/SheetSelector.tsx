import React from 'react';
import { Layers, MousePointer2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SheetSelectorProps {
    sheetNames: string[];
    selectedSheet: string | "__all__";
    onSheetChange: (sheetName: string | "__all__") => void;
}

export const SheetSelector: React.FC<SheetSelectorProps> = ({
    sheetNames,
    selectedSheet,
    onSheetChange,
}) => {
    const { t } = useTranslation();
    if (sheetNames.length <= 1) return null;

    return (
        <div className="glass-card animate-fade-in p-4 mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Layers size={18} className="text-primary" />
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    {t('sheets.title')}
                </h3>
            </div>

            <div className="flex flex-wrap gap-2 bg-black/20 p-1 rounded-xl border border-card-border">
                <button
                    onClick={() => onSheetChange("__all__")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all flex items-center gap-2 ${selectedSheet === "__all__"
                            ? 'bg-primary text-background'
                            : 'bg-transparent text-slate-400 hover:text-slate-200'
                        }`}
                >
                    <Layers size={14} />
                    {t('sheets.merge_all')}
                </button>

                <div className="w-[1px] bg-card-border my-1" />

                {sheetNames.map((name) => (
                    <button
                        key={name}
                        onClick={() => onSheetChange(name)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all ${selectedSheet === name
                                ? 'bg-primary text-background'
                                : 'bg-transparent text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[0.75rem]">
                <MousePointer2 size={12} />
                <span>{t('sheets.tip')}</span>
            </div>
        </div>
    );
};
