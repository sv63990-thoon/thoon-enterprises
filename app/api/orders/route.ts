import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    let orders = db.getOrders();

    if (userId && role) {
        if (role === 'buyer') {
            orders = orders.filter(o => o.buyerId === userId);
        } else if (role === 'seller') {
            orders = orders.filter(o => o.sellerId === userId);
        }
    }

    return NextResponse.json(orders);
}

export async function POST(request: Request) {
    try {
        const { quoteId, deliveryDate, deliveryLocation, deliveryInstructions } = await request.json();
        const order = db.createOrder(quoteId, deliveryDate, deliveryLocation, deliveryInstructions);

        // Log activity
        db.logAction(order.buyerId, 'Secure Order', `Secured order for ${order.product} (₹${order.totalPrice.toLocaleString()})`);

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
