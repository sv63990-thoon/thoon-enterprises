import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const reqId = searchParams.get('reqId');

    if (!reqId) {
        return NextResponse.json({ error: 'reqId is required' }, { status: 400 });
    }

    const quotes = db.getQuotesForRequirement(reqId);
    return NextResponse.json(quotes);
}

export async function PATCH(request: Request) {
    try {
        const { quoteId, thoonMargin } = await request.json();
        const updatedQuote = db.updateQuoteMargin(quoteId, Number(thoonMargin));
        return NextResponse.json(updatedQuote);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
