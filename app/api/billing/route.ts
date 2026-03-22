import { NextRequest, NextResponse } from 'next/server';
import { estimateDb } from '@/lib/estimateDb';

// GET /api/billing — list all estimates (optional ?search=)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || undefined;
        const estimates = estimateDb.getAll(search);
        return NextResponse.json(estimates);
    } catch (error) {
        console.error('GET /api/billing error:', error);
        return NextResponse.json({ error: 'Failed to fetch estimates' }, { status: 500 });
    }
}

// POST /api/billing — create new estimate
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.customerName || !body.phone || !body.area) {
            return NextResponse.json({ error: 'Customer name, phone, and area are required' }, { status: 400 });
        }
        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ error: 'At least one billing item is required' }, { status: 400 });
        }

        const estimate = estimateDb.create({
            date: body.date || new Date().toISOString().slice(0, 10),
            customerName: body.customerName,
            phone: body.phone,
            area: body.area,
            items: body.items,
            deliveryCharge: body.deliveryCharge || 0,
            subtotal: body.subtotal || 0,
            gstEnabled: body.gstEnabled || false,
            gstAmount: body.gstAmount || 0,
            roundOff: body.roundOff || 0,
            totalAmount: body.totalAmount || 0,
        });

        return NextResponse.json(estimate, { status: 201 });
    } catch (error) {
        console.error('POST /api/billing error:', error);
        return NextResponse.json({ error: 'Failed to create estimate' }, { status: 500 });
    }
}
