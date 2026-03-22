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

        const user = db.validateUser(email, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Update last login & Log action
        db.updateLastLogin(user.id);
        db.logAction(user.id, 'Login', `Successfully logged into ${user.role} dashboard`);

        // In a real app, we'd set a HttpOnly cookie here.
        // For this local demo, we'll return the user info to store in context/localStorage.
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
