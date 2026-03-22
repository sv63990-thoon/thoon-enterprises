import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Test database connection
        const users = db.getAllUsers();
        const adminUser = users.find(user => user.email === 'thoon_admin@org.in');
        
        const response = {
            success: true,
            message: 'Database connection successful',
            data: {
                totalUsers: users.length,
                adminUser: adminUser ? {
                    id: adminUser.id,
                    email: adminUser.email,
                    name: adminUser.name,
                    role: adminUser.role,
                    status: adminUser.status,
                    lastLogin: adminUser.lastLogin
                } : null,
                allUsers: users.map(user => ({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status
                }))
            }
        };
        
        return NextResponse.json(response);
        
    } catch (error: any) {
        return NextResponse.json(
            { 
                success: false, 
                error: error.message,
                message: 'Database connection failed'
            },
            { status: 500 }
        );
    }
}
