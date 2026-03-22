import fs from 'fs';
import path from 'path';

// ─── Types ───────────────────────────────────────────────────────────

export interface EstimateItem {
    sno: number;
    category: string;
    size: string;
    type: string;
    quantity: number;
    units: string;
    rate: number;
    amount: number;
}

export interface Estimate {
    id: string;
    billingNo: string;
    date: string;
    customerName: string;
    phone: string;
    area: string;
    items: EstimateItem[];
    deliveryCharge: number;
    subtotal: number;
    gstEnabled: boolean;
    gstAmount: number;
    roundOff: number;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

interface EstimateDatabase {
    estimates: Estimate[];
    sequence: number; // for auto-incrementing billing number
}

// ─── File Path ───────────────────────────────────────────────────────

const DB_PATH = path.join(process.cwd(), 'data', 'estimates.json');

function ensureDb(): void {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        const initial: EstimateDatabase = { estimates: [], sequence: 0 };
        fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    }
}

function getDb(): EstimateDatabase {
    ensureDb();
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
}

function saveDb(data: EstimateDatabase): void {
    ensureDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ─── Generate Billing Number ─────────────────────────────────────────

function billingNoFromSeq(seq: number): string {
    return `TE-${String(seq).padStart(4, '0')}`;
}

// ─── CRUD Operations ─────────────────────────────────────────────────

export const estimateDb = {
    /** Create a new estimate and return it */
    create(data: Omit<Estimate, 'id' | 'billingNo' | 'createdAt' | 'updatedAt'>): Estimate {
        const db = getDb();
        db.sequence += 1;
        const now = new Date().toISOString();
        const billingNumber = billingNoFromSeq(db.sequence);
        const estimate: Estimate = {
            ...data,
            id: billingNumber,
            billingNo: billingNumber,
            createdAt: now,
            updatedAt: now,
        };
        db.estimates.push(estimate);
        saveDb(db);
        return estimate;
    },

    /** Get all estimates, optionally filtered by search query */
    getAll(search?: string): Estimate[] {
        const db = getDb();
        if (!search) return db.estimates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const q = search.toLowerCase();
        return db.estimates
            .filter(
                (e) =>
                    e.billingNo.toLowerCase().includes(q) ||
                    e.customerName.toLowerCase().includes(q) ||
                    e.phone.includes(q)
            )
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },

    /** Get a single estimate by its ID */
    getById(id: string): Estimate | undefined {
        const db = getDb();
        return db.estimates.find((e) => e.id === id);
    },

    /** Update an existing estimate */
    update(id: string, data: Partial<Omit<Estimate, 'id' | 'billingNo' | 'createdAt'>>): Estimate | null {
        const db = getDb();
        const idx = db.estimates.findIndex((e) => e.id === id);
        if (idx === -1) return null;
        db.estimates[idx] = {
            ...db.estimates[idx],
            ...data,
            updatedAt: new Date().toISOString(),
        };
        saveDb(db);
        return db.estimates[idx];
    },

    /** Delete an estimate by ID */
    delete(id: string): boolean {
        const db = getDb();
        const idx = db.estimates.findIndex((e) => e.id === id);
        if (idx === -1) return false;
        db.estimates.splice(idx, 1);
        saveDb(db);
        return true;
    },

    /** Get dashboard summary */
    getSummary(): { todaySales: number; monthlyTotal: number; totalEstimates: number; todayCount: number; monthlyCount: number } {
        const db = getDb();
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);
        const monthStr = now.toISOString().slice(0, 7);

        let todaySales = 0;
        let monthlyTotal = 0;
        let todayCount = 0;
        let monthlyCount = 0;

        for (const e of db.estimates) {
            if (e.createdAt.startsWith(todayStr)) {
                todaySales += e.totalAmount;
                todayCount++;
            }
            if (e.createdAt.startsWith(monthStr)) {
                monthlyTotal += e.totalAmount;
                monthlyCount++;
            }
        }

        return {
            todaySales,
            monthlyTotal,
            totalEstimates: db.estimates.length,
            todayCount,
            monthlyCount,
        };
    },

    /** Get next billing number (preview, without incrementing) */
    getNextBillingNo(): string {
        const db = getDb();
        return billingNoFromSeq(db.sequence + 1);
    },
};
