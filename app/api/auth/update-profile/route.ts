import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { 
            companyName, 
            gstin, 
            address, 
            phone, 
            experienceYears,
            businessType,
            annualRevenue,
            categories
        } = await request.json();

        // Get user from session (you'll need to implement session management)
        // For now, we'll assume user is authenticated and we have their ID
        // In a real app, you'd get this from a JWT token or session
        
        // This is a simplified version - you'll need proper authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Extract user ID from token (simplified)
        const userId = authHeader.replace('Bearer ', '');
        
        // Find user
        const users = db.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const user = users[userIndex];

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

        // Update user data
        const updatedUser = {
            ...user,
            companyName: companyName?.trim() || user.companyName,
            gstin: gstin?.trim().toUpperCase() || user.gstin,
            address: address?.trim() || user.address,
            phone: phone?.trim() || user.phone,
            experienceYears: experienceYears || user.experienceYears,
            businessType: businessType || user.businessType,
            annualRevenue: annualRevenue || user.annualRevenue,
            categories: categories || user.categories,
            updatedAt: new Date().toISOString()
        };

        // Update in database
        users[userIndex] = updatedUser;
        db.updateUser(userId, updatedUser);

        // Log the action
        db.logAction(userId, 'Profile Update', 'User updated their profile information');

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status,
                companyName: updatedUser.companyName,
                gstin: updatedUser.gstin,
                address: updatedUser.address,
                phone: updatedUser.phone,
                experienceYears: updatedUser.experienceYears,
                businessType: updatedUser.businessType,
                annualRevenue: updatedUser.annualRevenue,
                categories: updatedUser.categories
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
