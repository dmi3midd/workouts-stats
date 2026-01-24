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

    const containerStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: '672px',
        margin: '0 auto',
    };

    const uploadAreaStyle: React.CSSProperties = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem 1rem',
        cursor: 'pointer',
        border: '2px dashed var(--card-border)',
        transition: 'border-color 0.2s',
        opacity: isLoading ? 0.5 : 1,
        pointerEvents: isLoading ? 'none' : 'auto',
    };

    return (
        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                    onClick={() => setIsInfoModalOpen(true)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                        padding: '0.5rem',
                        borderRadius: '0.5rem'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--slate-400)')}
                >
                    <HelpCircle size={18} />
                    <span>{t('uploader.how_to')}</span>
                </button>
            </div>

            {fileName ? (
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: 'var(--primary-muted)',
                            borderRadius: '0.5rem',
                            color: 'var(--primary)',
                            display: 'flex'
                        }}>
                            <FileSpreadsheet size={24} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 500 }}>{fileName}</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>{t('uploader.success')}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClear}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--slate-400)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            display: 'flex',
                            borderRadius: '50%',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-muted)')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                        <X size={20} />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="glass-card"
                    style={uploadAreaStyle}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--card-border)')}
                >
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleChange}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    />
                    <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--primary-muted)',
                        borderRadius: '50%',
                        color: 'var(--primary)',
                        display: 'flex'
                    }}>
                        <Upload size={32} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>
                            {t('uploader.drop_here')}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>
                            {t('uploader.browse')}
                        </p>
                    </div>
                </div>
            )}
            {error && (
                <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#f87171', textAlign: 'center' }}>
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
