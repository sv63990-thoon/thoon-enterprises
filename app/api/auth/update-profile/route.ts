import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/sqlite-db';

export async function POST(request: Request) {
    try {
        const { 
            userId,
            companyName, 
            gstin, 
            address, 
            phone, 
            experienceYears,
            businessType,
            annualRevenue,
            categories
        } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Find user in SQLite
        const users = sqliteDb.getAllUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Validate GST format
        if (gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/.test(gstin)) {
            return NextResponse.json(
                { error: 'Invalid GST number format' },
                { status: 400 }
            );
        }

        // Validate phone format
        if (phone && !/^[6-9][0-9]{9}$/.test(phone)) {
            return NextResponse.json(
                { error: 'Invalid phone number format' },
                { status: 400 }
            );
        }

        // Check if phone is already used by another user
        if (phone && phone !== user.phone) {
            const existingPhone = sqliteDb.findUserByPhone(phone.trim());
            if (existingPhone && existingPhone.id !== userId) {
                return NextResponse.json(
                    { error: 'Phone number already registered by another user' },
                    { status: 400 }
                );
            }
        }

        // Update user data in SQLite
        // Note: sqliteDb doesn't have a direct updateUser method, so we'll need to add one
        // For now, let's use a direct database update
        try {
            const Database = require('better-sqlite3');
            const path = require('path');
            const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
            const db = new Database(dbPath);
            
            const stmt = db.prepare(`
                UPDATE users SET 
                    companyName = ?, 
                    gstin = ?, 
                    address = ?, 
                    phone = ?, 
                    experienceYears = ?,
                    annualRevenue = ?,
                    updatedAt = ?
                WHERE id = ?
            `);
            
            stmt.run(
                companyName?.trim() || user.companyName,
                gstin?.trim().toUpperCase() || user.gstin,
                address?.trim() || user.address,
                phone?.trim() || user.phone,
                experienceYears || user.experienceYears,
                annualRevenue || user.annualRevenue,
                new Date().toISOString(),
                userId
            );
            
            db.close();
        } catch (dbError) {
            console.error('Database update error:', dbError);
            return NextResponse.json(
                { error: 'Failed to update profile in database' },
                { status: 500 }
            );
        }

        // Get updated user
        const updatedUsers = sqliteDb.getAllUsers();
        const updatedUser = updatedUsers.find(u => u.id === userId);

        // Log the action
        sqliteDb.logAction(userId, 'Profile Update', 'User updated their profile information');

        // Track profile update for analytics
        try {
            const userAgent = request.headers.get('user-agent') || '';
            const ipAddress = request.headers.get('x-forwarded-for') || 
                             request.headers.get('x-real-ip') || 
                             '127.0.0.1';
            
            sqliteDb.trackActivity({
                id: `activity-${Date.now()}`,
                userId,
                sessionId: 'profile-update',
                type: 'form_submit',
                details: 'User updated profile information',
                metadata: { 
                    fieldsUpdated: ['companyName', 'gstin', 'address', 'phone', 'experienceYears', 'annualRevenue'],
                    updateTime: new Date().toISOString()
                },
                ipAddress,
                userAgent,
                createdAt: new Date().toISOString()
            });
        } catch (analyticsError) {
            console.log('Analytics tracking failed:', analyticsError);
        }

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser?.id,
                name: updatedUser?.name,
                email: updatedUser?.email,
                role: updatedUser?.role,
                status: updatedUser?.status,
                companyName: updatedUser?.companyName,
                gstin: updatedUser?.gstin,
                address: updatedUser?.address,
                phone: updatedUser?.phone,
                experienceYears: updatedUser?.experienceYears,
                subscriptionTier: updatedUser?.subscriptionTier,
                verificationStatus: updatedUser?.verificationStatus,
                aiScore: updatedUser?.aiScore
            },
            message: 'Profile updated successfully'
        });

    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update profile' },
            { status: 500 }
        );
    }
}
