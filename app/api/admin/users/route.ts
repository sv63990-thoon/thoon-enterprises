import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';

    if (all) {
        return NextResponse.json(db.getAllUsers());
    }
    return NextResponse.json(db.getPendingUsers());
}

export async function PATCH(request: Request) {
    try {
        const { userId, status } = await request.json();
        if (!['active', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }
        const user = db.updateUserStatus(userId, status);
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
