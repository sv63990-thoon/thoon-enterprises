import { NextResponse } from 'next/server';
import { estimateDb } from '@/lib/estimateDb';

// GET /api/billing/summary — dashboard summary
export async function GET() {
    try {
        const summary = estimateDb.getSummary();
        const nextBillingNo = estimateDb.getNextBillingNo();
        return NextResponse.json({ ...summary, nextBillingNo });
    } catch (error) {
        console.error('GET /api/billing/summary error:', error);
        return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
    }
}
