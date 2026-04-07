import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma-db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'processing';

    let orders = await db.getOrders();
    
    // Filter for orders that are being delivered (processing or shipped)
    const deliveryOrders = orders.filter(order => 
      order.status === 'processing' || order.status === 'shipped'
    );

    // Transform to delivery format for UI
    const deliveries = deliveryOrders.map(order => {
      // Calculate estimated time based on order status and creation date
      const createdDate = new Date(order.createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
      
      let estimatedTime = '2 hours';
      let priority: 'high' | 'medium' | 'low' = 'medium';
      
      if (order.status === 'shipped') {
        estimatedTime = 'Tomorrow';
        priority = 'high';
      } else if (hoursDiff > 24) {
        estimatedTime = '5 hours';
        priority = 'low';
      } else if (hoursDiff < 2) {
        estimatedTime = '2 hours';
        priority = 'high';
      }

      return {
        id: order.id,
        customer: order.buyerName,
        location: order.deliveryLocation,
        estimatedTime,
        items: order.quantity,
        priority
      };
    });

    return NextResponse.json(deliveries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
