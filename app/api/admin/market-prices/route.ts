import { NextResponse } from 'next/server';
import { db, MarketPrice } from '@/lib/db';

const SEED_DATA: { category: MarketPrice['category']; brand: string; price: number; unit: string; change: number }[] = [
    // Steel
    { category: 'Steel', brand: 'Tata Tiscon (TMT)', price: 72.50, unit: 'kg', change: 0.5 },
    { category: 'Steel', brand: 'JSW Neo Steel', price: 68.00, unit: 'kg', change: -0.2 },
    { category: 'Steel', brand: 'SAIL TMT', price: 65.50, unit: 'kg', change: 0.1 },
    { category: 'Steel', brand: 'Vizag Steel', price: 64.00, unit: 'kg', change: 0.3 },
    { category: 'Steel', brand: 'Jindal Panther', price: 67.00, unit: 'kg', change: -0.1 },
    // Cement
    { category: 'Cement', brand: 'UltraTech Cement', price: 385, unit: 'bag', change: 1.2 },
    { category: 'Cement', brand: 'Ambuja Cement', price: 375, unit: 'bag', change: -0.5 },
    { category: 'Cement', brand: 'Dalmia DSP', price: 390, unit: 'bag', change: 0.8 },
    { category: 'Cement', brand: 'ACC Gold', price: 380, unit: 'bag', change: 0.2 },
    // AAC Blocks
    { category: 'AAC Blocks', brand: 'Siporex AAC', price: 3800, unit: 'cum', change: 1.5 },
    { category: 'AAC Blocks', brand: 'Magicrete', price: 3650, unit: 'cum', change: -0.5 },
    // Bricks
    { category: 'Bricks', brand: 'Chamber Red Bricks', price: 9.50, unit: 'pc', change: 2.0 },
    { category: 'Bricks', brand: 'Fly Ash Bricks', price: 6.50, unit: 'pc', change: -0.1 },
    // Sand & Aggregates
    { category: 'Sand & Aggregates', brand: 'River Sand', price: 2200, unit: 'ton', change: 3.5 },
    { category: 'Sand & Aggregates', brand: 'M-Sand', price: 1400, unit: 'ton', change: -0.5 }
];

export async function GET() {
    let prices = db.getMarketPrices();

    // Auto-seed if empty
    if (prices.length === 0) {
        SEED_DATA.forEach(item => {
            db.addMarketPrice(item.category, item.brand, item.price, item.unit, item.change);
        });
        prices = db.getMarketPrices();
    }

    return NextResponse.json(prices);
}

export async function PATCH(request: Request) {
    try {
        const { id, ...updates } = await request.json();
        const prices = db.updateMarketPrice(id, updates);
        return NextResponse.json(prices);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
