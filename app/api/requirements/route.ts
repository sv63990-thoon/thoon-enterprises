import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma-db';

export async function GET() {
    try {
        const requirements = await db.getRequirements();
        return NextResponse.json(requirements);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { buyerId, buyerName, product, category, brand, quantity, unit, deliveryLocation } = await request.json();
        const req = await db.createRequirement(buyerId, buyerName, product, category, brand, Number(quantity), unit, deliveryLocation);

        // Log activity
        await db.logAction(buyerId, 'Post Requirement', `Requested ${quantity} ${unit} of ${product} (${brand})`);

        return NextResponse.json(req);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
