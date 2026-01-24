import React from 'react';
import { X, Info, FileSpreadsheet } from 'lucide-react';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const headers = ['Date', 'Exercise', 'Set 1, kg', 'Set 1, reps', 'Set 2, kg', 'Set 2, reps', 'Tonnage, kg (opt)'];
    const mockData = [
        ['2024-01-20', 'Bench Press', '80', '10', '80', '8', '1440'],
        ['2024-01-20', 'Squats', '100', '12', '100', '10', '2200'],
        ['2024-01-22', 'Deadlift', '140', '5', '140', '5', '1400'],
    ];

    const cellStyle: React.CSSProperties = {
        padding: '0.5rem 0.75rem',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.8125rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const headerCellStyle: React.CSSProperties = {
        ...cellStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        color: 'var(--slate-400)',
        fontWeight: 600,
        textAlign: 'center',
    };

    const dataCellStyle: React.CSSProperties = {
        ...cellStyle,
        color: 'var(--slate-300)',
    };

    const rowNumStyle: React.CSSProperties = {
        ...cellStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        color: 'var(--slate-500)',
        width: '40px',
        textAlign: 'center',
        fontWeight: 500,
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)'
        }} onClick={onClose}>
            <div
                className="glass-card animate-fade-in"
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            padding: '0.5rem',
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            borderRadius: '0.5rem',
                            color: '#22c55e',
                            display: 'flex'
                        }}>
                            <FileSpreadsheet size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                                Workout Sheet Format
                            </h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>
                                Use the first sheet with this structure
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        transition: 'background 0.2s'
                    }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{
                    overflowX: 'auto',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th style={rowNumStyle}></th>
                                {columns.map(col => (
                                    <th key={col} style={headerCellStyle}>{col}</th>
                                ))}
                            </tr>
                            <tr>
                                <td style={rowNumStyle}>1</td>
                                {headers.map((h, i) => (
                                    <td key={i} style={{ ...dataCellStyle, color: 'var(--primary)', fontWeight: 600 }}>{h}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mockData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={rowNumStyle}>{rowIndex + 2}</td>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} style={dataCellStyle}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '1rem',
                        backgroundColor: 'rgba(34, 197, 94, 0.05)',
                        border: '1px solid rgba(34, 197, 94, 0.1)',
                        borderRadius: '0.75rem'
                    }}>
                        <Info size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
                        <p style={{ fontSize: '0.875rem', color: 'var(--slate-300)', lineHeight: '1.5' }}>
                            The "Tonnage, kg" column is <strong>optional</strong>. If it's missing, the app will automatically calculate your total volume from the individual sets.
                        </p>
                    </div>

                    <button onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

