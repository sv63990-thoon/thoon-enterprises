import { NextResponse } from 'next/server';
import { validateOTP } from '@/lib/otp';
import { sqliteDb } from '@/lib/sqlite-db';

export async function POST(request: Request) {
    try {
        const { sessionId, otp, name } = await request.json();

        if (!sessionId || !otp) {
            return NextResponse.json(
                { error: 'Session ID and OTP are required' },
                { status: 400 }
            );
        }

        // Validate OTP
        const session = validateOTP(sessionId, otp);
        
        if (!session) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP' },
                { status: 400 }
            );
        }

        // Check if user already exists with this phone number
        const existingUser = sqliteDb.findUserByPhone(session.mobileNumber);
        
        if (existingUser) {
            return NextResponse.json({
                success: true,
                user: existingUser,
                message: 'Login successful'
            });
        }

        // Create new user with phone-based email
        const newUser = sqliteDb.createUser({
            name: name || `User ${session.mobileNumber}`,
            email: `${session.mobileNumber}@thoon.local`,
            phone: session.mobileNumber,
            role: 'buyer'
        });

        return NextResponse.json({
            success: true,
            user: newUser,
            message: 'Registration successful'
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to verify OTP' },
            { status: 500 }
        );
    }
}
