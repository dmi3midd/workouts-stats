import { useTranslation } from 'react-i18next';
import { FileUploader } from './FileUploader';

interface HeroProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
    error: string | null;
    onClear: () => void;
    fileName: string | null;
}

export const Hero = ({ onFileSelect, isLoading, error, onClear, fileName }: HeroProps) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
            <div className="mb-8">
                <h2 className="text-6xl font-extrabold tracking-tight mb-4 text-white">
                    {t('app.hero_title')}
                </h2>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    {t('app.hero_subtitle')}
                </p>
            </div>
            <FileUploader
                onFileSelect={onFileSelect}
                isLoading={isLoading}
                error={error}
                onClear={onClear}
                fileName={fileName}
            />
        </div>
    );
};
