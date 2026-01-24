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
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--card-border)',
                borderRadius: '5rem',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--card-border)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            <Languages size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ textTransform: 'uppercase' }}>{i18n.language === 'uk' ? 'EN' : 'UA'}</span>
        </button>
    );
};
