import crypto from 'crypto';
import { db } from './db';

export interface OTPSession {
    id: string;
    mobileNumber: string;
    otp: string;
    expiresAt: number;
    isUsed: boolean;
}

// In-memory OTP storage (in production, use Redis or database)
const otpSessions = new Map<string, OTPSession>();

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createOTPSession(mobileNumber: string): OTPSession {
    const otp = generateOTP();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    const session: OTPSession = {
        id: crypto.randomUUID(),
        mobileNumber,
        otp,
        expiresAt,
        isUsed: false
    };
    
    otpSessions.set(session.id, session);
    return session;
}

export function validateOTP(sessionId: string, otp: string): OTPSession | null {
    const session = otpSessions.get(sessionId);
    
    if (!session) return null;
    if (session.isUsed) return null;
    if (Date.now() > session.expiresAt) return null;
    if (session.otp !== otp) return null;
    
    // Mark as used
    session.isUsed = true;
    return session;
}

export function cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [id, session] of otpSessions.entries()) {
        if (now > session.expiresAt) {
            otpSessions.delete(id);
        }
    }
}

// Auto-cleanup every 5 minutes
setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
