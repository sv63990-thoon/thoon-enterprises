import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    return NextResponse.json(db.getRequirements());
}

export async function POST(request: Request) {
    try {
        const { buyerId, buyerName, product, category, brand, quantity, unit } = await request.json();
        const req = db.createRequirement(buyerId, buyerName, product, category, brand, Number(quantity), unit);

        // Log activity
        db.logAction(buyerId, 'Post Requirement', `Requested ${quantity} ${unit} of ${product} (${brand})`);

        return NextResponse.json(req);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
