'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketItem {
    id: string;
    name: string;
    price: number;
    unit: string;
    change: number; // percentage change
}

const INITIAL_DATA: MarketItem[] = [
    // Steel Brands
    { id: 's1', name: 'Tata Tiscon (TMT)', price: 72.50, unit: 'kg', change: 0.5 },
    { id: 's2', name: 'JSW Neo Steel', price: 68.00, unit: 'kg', change: -0.2 },
    { id: 's3', name: 'SAIL TMT', price: 65.50, unit: 'kg', change: 0.1 },
    { id: 's4', name: 'Vizag Steel', price: 64.00, unit: 'kg', change: 0.3 },
    { id: 's5', name: 'Jindal Panther', price: 67.00, unit: 'kg', change: -0.1 },
    { id: 's6', name: 'Kamdhenu Nxt', price: 62.50, unit: 'kg', change: 0.0 },
    { id: 's7', name: 'ARS CRS Steel', price: 66.50, unit: 'kg', change: 0.4 },

    // Cement Brands
    { id: 'c1', name: 'UltraTech Cement', price: 385, unit: 'bag', change: 1.2 },
    { id: 'c2', name: 'Ambuja Cement', price: 375, unit: 'bag', change: -0.5 },
    { id: 'c3', name: 'Dalmia DSP', price: 390, unit: 'bag', change: 0.8 },
    { id: 'c4', name: 'ACC Gold', price: 380, unit: 'bag', change: 0.2 },
    { id: 'c5', name: 'Shree Cement', price: 360, unit: 'bag', change: -1.0 },
    { id: 'c6', name: 'Ramco Supergrade', price: 395, unit: 'bag', change: 0.4 },
    { id: 'c7', name: 'Birla A1', price: 370, unit: 'bag', change: 0.1 },

    // AAC Blocks Brands
    { id: 'a1', name: 'Siporex AAC', price: 3800, unit: 'cum', change: 1.5 },
    { id: 'a2', name: 'Magicrete', price: 3650, unit: 'cum', change: -0.5 },
    { id: 'a3', name: 'Biltech', price: 3700, unit: 'cum', change: 0.0 },
    { id: 'a4', name: 'Renacon', price: 3550, unit: 'cum', change: 0.2 },

    // Bricks
    { id: 'b1', name: 'Chamber Red Bricks', price: 9.50, unit: 'pc', change: 2.0 },
    { id: 'b2', name: 'Fly Ash Bricks', price: 6.50, unit: 'pc', change: -0.1 },

    // Sand & Aggregates
    { id: 'sa1', name: 'River Sand', price: 2200, unit: 'ton', change: 3.5 },
    { id: 'sa2', name: 'M-Sand', price: 1400, unit: 'ton', change: -0.5 },
    { id: 'ag1', name: '20mm Aggregate', price: 850, unit: 'ton', change: 1.0 },
    { id: 'ag2', name: '40mm Aggregate', price: 820, unit: 'ton', change: 0.5 },
];

export const MarketTicker: React.FC = () => {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/market-prices');
                const prices = await res.json();
                // Ensure initial change if missing
                setData(prices.map((p: any) => ({ ...p, change: p.change || 0 })));
            } catch (error) {
                console.error('Failed to fetch market prices');
            }
        };

        fetchData();

        // Refresh every 30 seconds
        const refreshInterval = setInterval(fetchData, 30000);

        // Visual fluctuation interval (doesn't save to DB)
        const fluctuationInterval = setInterval(() => {
            setData((prevData) =>
                prevData.map((item) => {
                    const fluctuation = (Math.random() - 0.5) * 0.1;
                    const newPrice = Math.max(0, item.price + fluctuation);
                    return {
                        ...item,
                        price: parseFloat(newPrice.toFixed(2)),
                    };
                })
            );
        }, 5000);

        return () => {
            clearInterval(refreshInterval);
            clearInterval(fluctuationInterval);
        };
    }, []);

    if (data.length === 0) return null;

    return (
        <div className="w-full bg-slate-50 border-b border-slate-200 overflow-hidden h-8 flex items-center">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...data, ...data].map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center mx-6 text-xs font-medium text-slate-700">
                        <span className="uppercase tracking-wide mr-2">{item.brand}:</span>
                        <span className="mr-1">₹{item.price}/{item.unit}</span>
                        <span
                            className={`flex items-center ${item.change > 0
                                ? 'text-green-600'
                                : item.change < 0
                                    ? 'text-red-500'
                                    : 'text-slate-400'
                                }`}
                        >
                            {item.change > 0 ? (
                                <TrendingUp className="h-3 w-3 mr-0.5" />
                            ) : item.change < 0 ? (
                                <TrendingDown className="h-3 w-3 mr-0.5" />
                            ) : (
                                <Minus className="h-3 w-3 mr-0.5" />
                            )}
                            {Math.abs(item.change).toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
            <style jsx>{`
        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
};
