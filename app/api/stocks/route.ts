import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma-db';

export async function GET(request: Request) {
  try {
    const marketPrices = await db.getMarketPrices();
    
    // Transform market prices to stock format for UI
    const stocks = marketPrices.map(item => {
      let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
      
      // Simulate stock status based on price and change
      if (item.change < -5) {
        status = 'low-stock';
      } else if (item.change < -10) {
        status = 'out-of-stock';
      }
      
      return {
        name: `${item.category} ${item.brand}`,
        category: item.category,
        quantity: Math.floor(Math.random() * 1000) + 100, // Simulated quantity
        unit: item.unit,
        status
      };
    });

    return NextResponse.json(stocks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
