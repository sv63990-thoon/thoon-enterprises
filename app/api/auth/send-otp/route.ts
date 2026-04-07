import { NextResponse } from 'next/server';
import { createOTPSession } from '@/lib/otp';

export async function POST(request: Request) {
    try {
        const { mobileNumber } = await request.json();

        if (!mobileNumber) {
            return NextResponse.json(
                { error: 'Mobile number is required' },
                { status: 400 }
            );
        }

        // Validate mobile number (basic validation)
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobileNumber)) {
            return NextResponse.json(
                { error: 'Invalid mobile number format' },
                { status: 400 }
            );
        }

        // Create OTP session
        const session = createOTPSession(mobileNumber);
        
        // For demo: Send OTP via email (in production, use SMS gateway)
        // For now, we'll just return the session ID and show OTP in console
        console.log(`OTP for ${mobileNumber}: ${session.otp}`);
        
        // In production, you would send SMS like:
        // await sendSMS(mobileNumber, `Your OTP is: ${session.otp}`);
        
        // For demo, we'll also "send" via email notification
        // await sendEmail({
        //     to: 'admin@thoonenterprises.in',
        //     subject: 'New Registration OTP',
        //     text: `OTP for ${mobileNumber} is ${session.otp}`
        // });

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            message: 'OTP sent successfully',
            // For demo only - remove in production
            otp: process.env.NODE_ENV === 'development' ? session.otp : undefined
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to send OTP' },
            { status: 500 }
        );
    }
}
