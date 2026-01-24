import React from 'react';
import { Layers, MousePointer2 } from 'lucide-react';

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
    if (sheetNames.length <= 1) return null;

    return (
        <div className="glass-card animate-fade-in" style={{
            padding: '1rem',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Layers size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Select Data Source
                </h3>
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '0.25rem',
                borderRadius: '0.75rem',
                border: '1px solid var(--card-border)'
            }}>
                <button
                    onClick={() => onSheetChange("__all__")}
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: selectedSheet === "__all__" ? 'var(--primary)' : 'transparent',
                        color: selectedSheet === "__all__" ? 'var(--background)' : 'var(--slate-400)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Layers size={14} />
                    Merge All Sheets
                </button>

                <div style={{ width: '1px', backgroundColor: 'var(--card-border)', margin: '0.25rem 0' }} />

                {sheetNames.map((name) => (
                    <button
                        key={name}
                        onClick={() => onSheetChange(name)}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: selectedSheet === name ? 'var(--primary)' : 'transparent',
                            color: selectedSheet === name ? 'var(--background)' : 'var(--slate-400)',
                        }}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-500)', fontSize: '0.75rem' }}>
                <MousePointer2 size={12} />
                <span>Switch between sheets or combine them for a complete overview</span>
            </div>
        </div>
    );
};
