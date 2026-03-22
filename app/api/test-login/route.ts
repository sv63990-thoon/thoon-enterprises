import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing credentials' },
                { status: 400 }
            );
        }

        // Test admin login specifically
        const testCredentials = {
            email: 'thoon_admin@org.in',
            password: 'Thoon@2026'
        };

        const isAdminTest = email === testCredentials.email && password === testCredentials.password;
        
        if (isAdminTest) {
            const user = db.validateUser(testCredentials.email, testCredentials.password);
            
            if (user) {
                return NextResponse.json({
                    success: true,
                    message: 'Admin login test successful',
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        status: user.status
                    },
                    credentials: {
                        email: testCredentials.email,
                        password: testCredentials.password
                    }
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: 'Admin credentials found in database but validation failed',
                    suggestion: 'Database might need to be updated'
                });
            }
        } else {
            // Test with provided credentials
            const user = db.validateUser(email, password);
            
            if (user) {
                return NextResponse.json({
                    success: true,
                    message: 'Login successful with provided credentials',
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        status: user.status
                    }
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: 'Invalid credentials',
                    suggestion: 'Use admin credentials: thoon_admin@org.in / Thoon@2026'
                });
            }
        }
        
    } catch (error: any) {
        return NextResponse.json(
            { 
                success: false, 
                error: error.message,
                message: 'Login test failed'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Login test endpoint',
        usage: 'POST with {email, password} or test admin credentials',
        adminCredentials: {
            email: 'thoon_admin@org.in',
            password: 'Thoon@2026'
        }
    });
}
