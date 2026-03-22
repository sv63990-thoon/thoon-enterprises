import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(request: Request) {
    try {
        const { orderId, status, rating, feedback } = await request.json();

        if (status) {
            const order = db.updateOrderStatus(orderId, status);
            // Log status update
            db.logAction(order.sellerId, 'Update Order', `Marked order for ${order.product} as ${status}`);
            return NextResponse.json(order);
        }

        if (rating !== undefined) {
            const order = db.rateOrder(orderId, rating, feedback);
            // Log rating
            db.logAction(order.buyerId, 'Rate Order', `Rated delivery for ${order.product}: ${rating}/5 stars`);
            return NextResponse.json(order);
        }

        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
