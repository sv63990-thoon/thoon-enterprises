import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/sqlite-db';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        
        const {
            // Basic Details
            name,
            email,
            phone,
            
            // Role Selection
            role
        } = formData;

        // Validate required fields
        if (!name || !email || !phone || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = sqliteDb.findUserByEmail(email.toLowerCase().trim());
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Check if phone already exists
        const existingPhone = sqliteDb.findUserByPhone(phone.trim());
        if (existingPhone) {
            return NextResponse.json(
                { error: 'Phone number already registered' },
                { status: 400 }
            );
        }

        // Create new user with simplified data
        const newUser = sqliteDb.createUser({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            role: role as 'buyer' | 'seller'
        });

        // Log the registration
        console.log('New user registered:', {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status
        });

        return NextResponse.json({
            success: true,
            message: 'Registration successful! Your account is pending approval.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                status: newUser.status
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
