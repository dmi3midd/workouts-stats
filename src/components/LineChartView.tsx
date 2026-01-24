import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import type { WorkoutEntry } from '../types/workout';

interface LineChartViewProps {
    data: WorkoutEntry[];
    metric: 'weight' | 'volume' | 'reps';
    title: string;
}

export const LineChartView: React.FC<LineChartViewProps> = ({ data, metric, title }) => {
    return (
        <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)' }}>{title}</h3>
            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
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
                        />
                        <Area
                            type="monotone"
                            dataKey={metric}
                            stroke="var(--primary)"
                            fillOpacity={1}
                            fill="url(#colorMetric)"
                            strokeWidth={2}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
