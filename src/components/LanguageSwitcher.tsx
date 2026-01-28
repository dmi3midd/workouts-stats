import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'uk' ? 'en' : 'uk';
        i18n.changeLanguage(nextLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="fixed bottom-6 right-6 z-[1000] flex items-center gap-2 px-4 py-2 bg-background border border-card-border rounded-full text-foreground cursor-pointer text-sm font-semibold shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all backdrop-blur-md hover:border-primary hover:-translate-y-0.5"
        >
            <Languages size={18} className="text-primary" />
            <span className="uppercase">{i18n.language === 'uk' ? 'EN' : 'UA'}</span>
        </button>
    );
};
