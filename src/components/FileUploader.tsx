import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X, HelpCircle } from 'lucide-react';
import { InfoModal } from './InfoModal';
import { useTranslation } from 'react-i18next';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
    error: string | null;
    onClear: () => void;
    fileName: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onFileSelect,
    isLoading,
    error,
    onClear,
    fileName,
}) => {
    const { t } = useTranslation();
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
                onFileSelect(file);
            }
        },
        [onFileSelect]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsInfoModalOpen(true)}
                    className="bg-transparent border-none text-slate-400 cursor-pointer flex items-center gap-2 text-sm transition-colors p-2 rounded-lg hover:text-primary"
                >
                    <HelpCircle size={18} />
                    <span>{t('uploader.how_to')}</span>
                </button>
            </div>

            {fileName ? (
                <div className="glass-card flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary-muted rounded-lg text-primary flex">
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <p className="font-medium text-white">{fileName}</p>
                            <p className="text-sm text-slate-400">{t('uploader.success')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        className="bg-transparent border-none text-slate-400 cursor-pointer p-2 flex rounded-full transition-colors hover:bg-primary-muted"
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`glass-card relative flex flex-col items-center justify-center gap-4 py-8 px-4 border-2 border-dashed border-card-border transition-colors hover:border-primary ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100 cursor-pointer'
                        }`}
                >
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="p-4 bg-primary-muted rounded-full text-primary flex">
                        <Upload size={32} />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-medium text-white">
                            {t('uploader.drop_here')}
                        </p>
                        <p className="text-sm text-slate-400">
                            {t('uploader.browse')}
                        </p>
                    </div>
                </div>
            )}
            {error && (
                <p className="mt-4 text-sm text-red-400 text-center">
                    {error}
                </p>
            )}

            <InfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
            />
        </div>
    );
};
