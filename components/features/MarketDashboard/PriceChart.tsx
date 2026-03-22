'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceChartProps {
    data: { date: string; price: number }[];
    color?: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, color = '#2563eb' }) => {
    return (
        <div className="h-[50px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            fontSize: '12px',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}
                        formatter={(value) => [`₹${value ?? 0}`, 'Price']}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
