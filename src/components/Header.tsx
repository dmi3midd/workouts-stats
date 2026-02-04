import { Dumbbell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
    const { t } = useTranslation();

    return (
        <header className="border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-3xl sticky top-0 z-50 h-20 flex items-center">
            <div className="container flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(253,164,129,0.2)]">
                        <Dumbbell className="text-white" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">{t('app.title')}</h1>
                        <p className="text-[0.75rem] text-slate-400 font-medium uppercase tracking-widest">{t('app.subtitle')}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};
