import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const reqId = searchParams.get('reqId');

    if (reqId) {
        if (searchParams.get('best') === 'true') {
            const best = db.getBestQuoteForRequirement(reqId);
            return NextResponse.json(best ? [best] : []);
        }
        return NextResponse.json(db.getQuotesForRequirement(reqId));
    }
    return NextResponse.json(db.getQuotes());
}

export async function POST(request: Request) {
    try {
        const { reqId, sellerId, sellerName, sellerPrice } = await request.json();
        const quote = db.submitQuote(reqId, sellerId, sellerName, Number(sellerPrice));

        // Log activity
        db.logAction(sellerId, 'Submit Quote', `Quoted ₹${sellerPrice.toLocaleString()} for requirement ID: ${reqId.slice(0, 8)}`);

        return NextResponse.json(quote);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
