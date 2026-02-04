import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="container py-12 mt-12 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500 italic">{t('app.footer')}</p>
        </footer>
    );
};
