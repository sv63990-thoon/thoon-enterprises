'use client';

import React, { useState } from 'react';
import { PriceChart } from './PriceChart';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Category = 'Steel' | 'Cement' | 'Sand' | 'Bricks' | 'Other';

interface BrandData {
    id: string;
    name: string;
    currentPrice: number;
    unit: string;
    change: number; // percentage
    source: string; // price source
    history: { date: string; price: number }[];
}

// Mock Data Generator
const generateHistory = (basePrice: number, days: number = 7) => {
    const history = [];
    let current = basePrice;
    for (let i = days; i > 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        // Random fluctuation +/- 2%
        const fluctuation = (Math.random() - 0.5) * 0.04 * current;
        current += fluctuation;
        history.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            price: Math.round(current),
        });
    }
    return history;
};

const MARKET_DATA: Record<Category, BrandData[]> = {
    Steel: [
        { id: 's1', name: 'Tata Tiscon', currentPrice: 72.50, unit: 'kg', change: 0.5, source: 'MCX India', history: generateHistory(72) },
        { id: 's2', name: 'JSW Neo', currentPrice: 68.00, unit: 'kg', change: -0.2, source: 'NSE', history: generateHistory(68) },
        { id: 's3', name: 'SAIL', currentPrice: 65.50, unit: 'kg', change: 0.1, source: 'BSE', history: generateHistory(65) },
        { id: 's4', name: 'Vizag Steel', currentPrice: 64.00, unit: 'kg', change: 0.3, source: 'MCX India', history: generateHistory(64) },
        { id: 's5', name: 'Jindal Panther', currentPrice: 67.00, unit: 'kg', change: -0.1, source: 'IndiaMART', history: generateHistory(67) },
        { id: 's6', name: 'Kamdhenu Nxt', currentPrice: 62.50, unit: 'kg', change: 0.0, source: 'NSE', history: generateHistory(62.5) },
        { id: 's7', name: 'ARS CRS Steel', currentPrice: 66.50, unit: 'kg', change: 0.4, source: 'IndiaMART', history: generateHistory(66) },
    ],
    Cement: [
        { id: 'c1', name: 'UltraTech', currentPrice: 385, unit: 'bag', change: 1.2, source: 'NSE', history: generateHistory(380) },
        { id: 'c2', name: 'Ambuja', currentPrice: 375, unit: 'bag', change: -0.5, source: 'BSE', history: generateHistory(378) },
        { id: 'c3', name: 'Dalmia DSP', currentPrice: 390, unit: 'bag', change: 0.8, source: 'IndiaMART', history: generateHistory(385) },
        { id: 'c4', name: 'ACC Gold', currentPrice: 380, unit: 'bag', change: 0.2, source: 'NSE', history: generateHistory(379) },
        { id: 'c5', name: 'Shree', currentPrice: 360, unit: 'bag', change: -1.0, source: 'BSE', history: generateHistory(365) },
        { id: 'c6', name: 'Ramco', currentPrice: 395, unit: 'bag', change: 0.4, source: 'IndiaMART', history: generateHistory(390) },
        { id: 'c7', name: 'Birla A1', currentPrice: 370, unit: 'bag', change: 0.1, source: 'IndiaMART', history: generateHistory(369) },
    ],
    Sand: [
        { id: 'sa1', name: 'River Sand', currentPrice: 2200, unit: 'ton', change: 3.5, source: 'Local Mandi', history: generateHistory(2100) },
        { id: 'sa2', name: 'M-Sand', currentPrice: 1400, unit: 'ton', change: -0.5, source: 'Local Mandi', history: generateHistory(1410) },
    ],
    Bricks: [
        { id: 'b1', name: 'Chamber Red Bricks', currentPrice: 9.50, unit: 'pc', change: 2.0, source: 'Local Mandi', history: generateHistory(9.2) },
        { id: 'b2', name: 'Fly Ash Bricks', currentPrice: 6.50, unit: 'pc', change: -0.1, source: 'IndiaMART', history: generateHistory(6.6) },
        { id: 'a1', name: 'Siporex AAC', currentPrice: 3800, unit: 'cum', change: 1.5, source: 'IndiaMART', history: generateHistory(3750) },
        { id: 'a2', name: 'Magicrete AAC', currentPrice: 3650, unit: 'cum', change: -0.5, source: 'IndiaMART', history: generateHistory(3680) },
        { id: 'a3', name: 'Biltech AAC', currentPrice: 3700, unit: 'cum', change: 0.0, source: 'IndiaMART', history: generateHistory(3700) },
        { id: 'a4', name: 'Renacon AAC', currentPrice: 3550, unit: 'cum', change: 0.2, source: 'IndiaMART', history: generateHistory(3540) },
    ],
    Other: [
        { id: 'o1', name: '20mm Aggregate', currentPrice: 850, unit: 'ton', change: 1.0, source: 'Local Mandi', history: generateHistory(840) },
        { id: 'o2', name: '40mm Aggregate', currentPrice: 820, unit: 'ton', change: 0.5, source: 'Local Mandi', history: generateHistory(815) },
    ]
};

// Imports removed

export const MarketDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Category>('Steel');
    const categories = Object.keys(MARKET_DATA) as Category[];
    const { isAdmin } = useAuth();

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* ... (header) ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-oswald uppercase tracking-wide">
                    Live Market Trends
                </h2>
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === cat
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 text-left">
                            <th className="pb-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
                            <th className="pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                            {isAdmin && <th className="pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>}
                            <th className="pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[120px]">7-Day Trend</th>
                            <th className="pb-2 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MARKET_DATA[activeTab].map((item) => (
                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 pr-4">
                                    <span className="font-semibold text-slate-900">{item.name}</span>
                                </td>
                                <td className="py-2 px-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">₹{item.currentPrice}</span>
                                        <span className="text-xs text-slate-400">/{item.unit}</span>
                                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${item.change > 0 ? 'bg-green-100 text-green-700' :
                                            item.change < 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {item.change > 0 && <TrendingUp className="w-3 h-3 mr-0.5" />}
                                            {item.change < 0 && <TrendingDown className="w-3 h-3 mr-0.5" />}
                                            {item.change === 0 && <Minus className="w-3 h-3 mr-0.5" />}
                                            {Math.abs(item.change)}%
                                        </span>
                                    </div>
                                </td>
                                {isAdmin && (
                                    <td className="py-2 px-4">
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{item.source}</span>
                                    </td>
                                )}
                                <td className="py-2 px-4">
                                    <PriceChart
                                        data={item.history}
                                        color={item.change >= 0 ? '#16a34a' : '#dc2626'}
                                    />
                                </td>
                                <td className="py-2 pl-4 text-right">
                                    <button className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
                                        Get Quote <ArrowRight className="w-3 h-3" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
