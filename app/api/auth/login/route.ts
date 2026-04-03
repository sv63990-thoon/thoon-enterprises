import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/sqlite-db';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing credentials' },
                { status: 400 }
            );
        }

        const user = sqliteDb.validateUser(email, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Update last login & Log action
        sqliteDb.updateLastLogin(user.id);
        sqliteDb.logAction(user.id, 'Login', `Successfully logged into ${user.role} dashboard`);

        // Track login for analytics
        try {
            const userAgent = request.headers.get('user-agent') || '';
            const ipAddress = request.headers.get('x-forwarded-for') || 
                             request.headers.get('x-real-ip') || 
                             '127.0.0.1';
            
            // Get session ID from header or generate one
            const sessionId = request.headers.get('x-session-id') || 'session_' + Date.now();
            
            // Track login activity
            sqliteDb.trackActivity({
                id: `activity-${Date.now()}`,
                userId: user.id,
                sessionId,
                type: 'login',
                details: `User ${user.email} logged in as ${user.role}`,
                metadata: { loginTime: new Date().toISOString() },
                ipAddress,
                userAgent,
                createdAt: new Date().toISOString()
            });
        } catch (analyticsError) {
            console.log('Analytics tracking failed:', analyticsError);
            // Don't fail login if analytics fails
        }

        // In a real app, we'd set a HttpOnly cookie here.
        // For this local demo, we'll return the user info to store in context/localStorage.
        return NextResponse.json({
            success: true,
            user,
            message: 'Login successful'
        });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
