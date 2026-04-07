import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma-db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const all = searchParams.get('all') === 'true';

        if (all) {
            const users = await db.getAllUsers();
            return NextResponse.json(users);
        }
        const pendingUsers = await db.getPendingUsers();
        return NextResponse.json(pendingUsers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const { userId, status } = await request.json();
        if (!['active', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }
        const user = await db.updateUserStatus(userId, status);
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
