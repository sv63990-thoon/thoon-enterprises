import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Check if database is accessible
        const { db } = await import('@/lib/db');
        const users = db.getAllUsers();
        
        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            appUrl: process.env.NEXT_PUBLIC_APP_URL,
            database: {
                connected: true,
                userCount: users.length,
                adminUser: users.find(u => u.email === 'thoon_admin@org.in') ? 'found' : 'not found'
            },
            version: '1.0.0'
        });
        
    } catch (error: any) {
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message,
            environment: process.env.NODE_ENV,
            appUrl: process.env.NEXT_PUBLIC_APP_URL
        }, { status: 500 });
    }
}
