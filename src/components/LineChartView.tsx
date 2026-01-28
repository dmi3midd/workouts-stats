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
import { useTranslation } from 'react-i18next';

interface LineChartViewProps {
    data: WorkoutEntry[];
    metric: 'weight' | 'volume' | 'reps';
    title: string;
}

export const LineChartView: React.FC<LineChartViewProps> = ({ data, metric, title }) => {
    const { t } = useTranslation();
    return (
        <div className="chart-container flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FDA481" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#B4182D" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(55, 65, 92, 0.5)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#181A2F',
                                border: '1px solid rgba(55, 65, 92, 0.5)',
                                borderRadius: '8px',
                                color: '#f8fafc',
                            }}
                            formatter={(value: any, name: string | undefined) => [
                                value,
                                name === 'weight' ? t('metrics.weight') :
                                    name === 'volume' ? t('metrics.volume') :
                                        name === 'reps' ? t('metrics.reps') :
                                            name || ''
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey={metric}
                            stroke="#FDA481"
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
