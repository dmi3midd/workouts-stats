import { useTranslation } from 'react-i18next';
import { FileUploader } from './FileUploader';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { useUIStore } from '../store/useUIStore';

export const Hero = () => {
    const { t } = useTranslation();
    const { clearData, loadFile } = useWorkoutStore();
    const { isLoading, setIsLoading, error, setError, fileName, setFileName } = useUIStore();

    const handleFileSelect = (file: File) => {
        loadFile(file, t, () => setIsLoading(true), () => setIsLoading(false), setError, setFileName);
    };

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
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                error={error}
                onClear={clearData}
                fileName={fileName}
            />
        </div>
    );
};
