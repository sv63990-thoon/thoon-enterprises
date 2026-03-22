import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const logs = db.getAuditLogs();
        return NextResponse.json(logs);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
