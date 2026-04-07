import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma-db';

export async function GET(request: Request) {
  try {
    const orders = await db.getOrders();
    const users = await db.getAllUsers();
    const marketPrices = await db.getMarketPrices();

    // Calculate dashboard metrics
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt) >= todayStart
    );

    const pendingDeliveries = orders.filter(order => 
      order.status === 'processing' || order.status === 'shipped'
    );

    const totalSalesValue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const activeUsers = users.filter(user => user.status === 'active').length;

    const metrics = {
      todaysOrders: todayOrders.length,
      pendingDeliveries: pendingDeliveries.length,
      salesValue: totalSalesValue,
      activeUsers: activeUsers,
      premiumQuality: '100%',
      onTimeDelivery: '98%',
      customerSatisfaction: '4.9',
      marketCoverage: 'South India'
    };

    return NextResponse.json(metrics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
