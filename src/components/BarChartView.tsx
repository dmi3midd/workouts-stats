import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import type { AnalyticsData } from '../types/workout';

interface BarChartViewProps {
    data: AnalyticsData[];
    metric: 'totalVolume' | 'totalReps' | 'workoutsCount';
    title: string;
}

export const BarChartView: React.FC<BarChartViewProps> = ({ data, metric, title }) => {
    return (
        <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)' }}>{title}</h3>
            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="var(--danger)" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="var(--slate-400)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="var(--slate-400)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--background)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '8px',
                                color: 'var(--foreground)',
                            }}
                            cursor={{ fill: 'var(--primary-muted)' }}
                        />
                        <Bar dataKey={metric} radius={[4, 4, 0, 0]}>
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
