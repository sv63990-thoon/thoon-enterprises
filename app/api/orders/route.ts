import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma-db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');

        let orders = await db.getOrders();

        if (userId && role) {
            if (role === 'buyer') {
                orders = orders.filter(o => o.buyerId === userId);
            } else if (role === 'seller') {
                orders = orders.filter(o => o.sellerId === userId);
            }
        }

        // Transform orders to match the expected format for the UI
        const transformedOrders = orders.slice(0, 10).map(order => ({
            id: order.id,
            customer: order.buyerName,
            amount: `Rs. ${order.totalPrice.toLocaleString('en-IN')}`,
            status: order.status,
            date: formatDate(order.createdAt),
            items: order.quantity
        }));

        return NextResponse.json(transformedOrders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function formatDate(dateString: Date | string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today, ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
}

export async function POST(request: Request) {
    try {
        const { quoteId, deliveryDate, deliveryLocation, deliveryInstructions } = await request.json();
        const order = await db.createOrder(quoteId, deliveryDate, deliveryLocation, deliveryInstructions);

        // Log activity
        await db.logAction(order.buyerId, 'Secure Order', `Secured order for ${order.product} (${order.totalPrice.toLocaleString()})`);

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
