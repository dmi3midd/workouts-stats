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
import { useTranslation } from 'react-i18next';

interface BarChartViewProps {
    data: AnalyticsData[];
    metric: 'totalVolume' | 'totalReps' | 'workoutsCount';
    title: string;
}

export const BarChartView: React.FC<BarChartViewProps> = ({ data, metric, title }) => {
    const { t } = useTranslation();
    return (
        <div className="chart-container flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FDA481" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#B4182D" stopOpacity={0.4} />
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
                            cursor={{ fill: 'rgba(253, 164, 129, 0.15)' }}
                            formatter={(value: any, name: string | undefined) => [
                                value,
                                name === 'totalVolume' ? t('metrics.volume') :
                                    name === 'totalReps' ? t('metrics.reps') :
                                        name === 'maxWeight' ? t('metrics.weight') :
                                            name || ''
                            ]}
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
