import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.getMargins());
}

export async function POST(request: Request) {
    try {
        const { category, marginType, value } = await request.json();
        const margins = db.upsertMargin(category, marginType, value);
        return NextResponse.json(margins);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
