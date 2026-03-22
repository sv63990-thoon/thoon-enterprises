import { NextRequest, NextResponse } from 'next/server';
import { estimateDb } from '@/lib/estimateDb';

// GET /api/billing/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const estimate = estimateDb.getById(id);
        if (!estimate) {
            return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
        }
        return NextResponse.json(estimate);
    } catch (error) {
        console.error('GET /api/billing/[id] error:', error);
        return NextResponse.json({ error: 'Failed to fetch estimate' }, { status: 500 });
    }
}

// PUT /api/billing/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updated = estimateDb.update(id, body);
        if (!updated) {
            return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
        }
        return NextResponse.json(updated);
    } catch (error) {
        console.error('PUT /api/billing/[id] error:', error);
        return NextResponse.json({ error: 'Failed to update estimate' }, { status: 500 });
    }
}

// DELETE /api/billing/[id]
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const deleted = estimateDb.delete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('DELETE /api/billing/[id] error:', error);
        return NextResponse.json({ error: 'Failed to delete estimate' }, { status: 500 });
    }
}
