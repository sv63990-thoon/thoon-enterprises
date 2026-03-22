import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

export type UserRole = 'admin' | 'buyer' | 'seller';

export type UserStatus = 'pending' | 'active' | 'rejected';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    phone?: string;
    companyName?: string;
    address?: string;
    gstin?: string;
    rating?: number;
    experienceYears?: number;
    subscriptionTier?: 'basic' | 'verified' | 'gold';
    lastLogin?: string;
    lastOrderDate?: string;
}

export interface CategoryMargin {
    category: string;
    marginType: 'percent' | 'fixed';
    value: number;
}

export interface Requirement {
    id: string;
    buyerId: string;
    buyerName: string;
    product: string;
    category: string;
    brand: string;
    quantity: number;
    unit: string;
    status: 'pending' | 'estimated' | 'closed';
    deliveryLocation?: string;
    createdAt: string;
}

export interface Quote {
    id: string;
    reqId: string;
    sellerId: string;
    sellerName: string;
    sellerPrice: number;
    thoonMargin: number;
    finalPrice: number;
    status: 'submitted';
    createdAt: string;
}

export interface MarketPrice {
    id: string;
    category: 'Steel' | 'Cement' | 'AAC Blocks' | 'Bricks' | 'Sand & Aggregates';
    brand: string;
    price: number;
    unit: string;
    change: number;
    lastUpdated: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    reqId: string;
    quoteId: string;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    product: string;
    category: string;
    quantity: number;
    unit: string;
    totalPrice: number;
    status: 'processing' | 'shipped' | 'delivered';
    deliveryDate: string;
    deliveryLocation: string;
    deliveryInstructions?: string;
    rating?: number;
    feedback?: string;
    createdAt: string;
    history: { status: string; timestamp: string }[];
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    timestamp: string;
}

interface UserRecord extends User {
    passwordHash: string;
    salt: string;
}

interface DatabaseSchema {
    users: UserRecord[];
    margins: CategoryMargin[];
    requirements: Requirement[];
    quotes: Quote[];
    marketPrices: MarketPrice[];
    orders: Order[];
    auditLogs: AuditLog[];
    orderSequence: number;
}

// Ensure DB exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
        users: [],
        margins: [],
        requirements: [],
        quotes: [],
        marketPrices: [],
        orders: [],
        auditLogs: [],
        orderSequence: 1000
    }, null, 2));
}

function getDb(): DatabaseSchema {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    // Migration for existing DBs
    if (!parsed.marketPrices) parsed.marketPrices = [];
    if (!parsed.orders) parsed.orders = [];
    if (!parsed.auditLogs) parsed.auditLogs = [];
    if (parsed.orderSequence === undefined) parsed.orderSequence = 1000;
    return parsed;
}

function saveDb(dbData: DatabaseSchema) {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));
}

function hashPassword(password: string): { salt: string; hash: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

export const db = {
    // Auth Methods
    findUserByEmail: (email: string) => {
        const { users } = getDb();
        const normalizedEmail = email.toLowerCase().trim();
        return users.find(u => u.email.toLowerCase() === normalizedEmail);
    },
    createUser: (name: string, email: string, password: string, role: UserRole = 'buyer', details?: Partial<User>) => {
        const dbData = getDb();
        const normalizedEmail = email.toLowerCase().trim();
        if (dbData.users.find(u => u.email.toLowerCase() === normalizedEmail)) {
            throw new Error('User already exists');
        }

        const { salt, hash } = hashPassword(password);

        // First user is always admin and active
        const finalRole = dbData.users.length === 0 ? 'admin' : role;
        const finalStatus = finalRole === 'admin' ? 'active' : 'pending';

        const newUser: UserRecord = {
            id: crypto.randomUUID(),
            name,
            email,
            role: finalRole,
            status: finalStatus,
            passwordHash: hash,
            salt,
            phone: details?.phone,
            companyName: details?.companyName,
            address: details?.address,
            gstin: details?.gstin,
            rating: details?.rating ?? 0,
            experienceYears: details?.experienceYears ?? 0,
            subscriptionTier: details?.subscriptionTier ?? 'basic'
        };

        dbData.users.push(newUser);
        saveDb(dbData);

        const { passwordHash, salt: _, ...safeUser } = newUser;
        return safeUser;
    },
    validateUser: (email: string, password: string) => {
        const { users } = getDb();
        const normalizedEmail = email.toLowerCase().trim();
        const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

        if (!user) return null;
        if (!verifyPassword(password, user.salt, user.passwordHash)) return null;

        const { passwordHash, salt, ...safeUser } = user;
        return safeUser;
    },
    updateUserStatus: (userId: string, status: UserStatus) => {
        const dbData = getDb();
        const user = dbData.users.find(u => u.id === userId);
        if (!user) throw new Error('User not found');
        user.status = status;
        saveDb(dbData);
        return user;
    },
    getPendingUsers: () => {
        const { users } = getDb();
        return users.filter(u => u.status === 'pending').map(({ passwordHash, salt, ...safeUser }) => safeUser);
    },
    getAllUsers: () => {
        const { users } = getDb();
        return users.map(({ passwordHash, salt, ...safeUser }) => safeUser);
    },
    updateLastLogin: (userId: string) => {
        const dbData = getDb();
        const user = dbData.users.find(u => u.id === userId);
        if (user) {
            user.lastLogin = new Date().toISOString();
            saveDb(dbData);
        }
    },

    // Margin Methods
    getMargins: () => getDb().margins,
    upsertMargin: (category: string, marginType: 'percent' | 'fixed', value: number) => {
        const dbData = getDb();
        const index = dbData.margins.findIndex(m => m.category === category);
        if (index > -1) {
            dbData.margins[index] = { category, marginType, value };
        } else {
            dbData.margins.push({ category, marginType, value });
        }
        saveDb(dbData);
        return dbData.margins;
    },

    // Requirement Methods
    createRequirement: (buyerId: string, buyerName: string, product: string, category: string, brand: string, quantity: number, unit: string, deliveryLocation?: string) => {
        const dbData = getDb();
        const newReq: Requirement = {
            id: crypto.randomUUID(),
            buyerId,
            buyerName,
            product,
            category,
            brand,
            quantity,
            unit,
            status: 'pending',
            deliveryLocation,
            createdAt: new Date().toISOString()
        };
        dbData.requirements.push(newReq);
        saveDb(dbData);
        return newReq;
    },
    getRequirements: () => getDb().requirements,

    // Quote & Automation Methods
    submitQuote: (reqId: string, sellerId: string, sellerName: string, sellerPrice: number) => {
        const dbData = getDb();
        const req = dbData.requirements.find(r => r.id === reqId);
        if (!req) throw new Error('Requirement not found');

        const margin = dbData.margins.find(m => m.category === req.category) || { marginType: 'percent', value: 10 }; // Default 10%

        let thoonMargin = 0;
        if (margin.marginType === 'fixed') {
            thoonMargin = margin.value;
        } else {
            thoonMargin = (sellerPrice * margin.value) / 100;
        }

        const finalPrice = sellerPrice + thoonMargin;

        const existingQuoteIndex = dbData.quotes.findIndex(q => q.reqId === reqId && q.sellerId === sellerId);

        if (existingQuoteIndex > -1) {
            // Update existing quote
            dbData.quotes[existingQuoteIndex] = {
                ...dbData.quotes[existingQuoteIndex],
                sellerPrice,
                thoonMargin,
                finalPrice,
                createdAt: new Date().toISOString()
            };
            req.status = 'estimated';
            saveDb(dbData);
            return dbData.quotes[existingQuoteIndex];
        }

        const newQuote: Quote = {
            id: crypto.randomUUID(),
            reqId,
            sellerId,
            sellerName,
            sellerPrice,
            thoonMargin,
            finalPrice,
            status: 'submitted',
            createdAt: new Date().toISOString()
        };

        dbData.quotes.push(newQuote);
        req.status = 'estimated';
        saveDb(dbData);
        return newQuote;
    },
    getQuotes: () => getDb().quotes,
    updateQuoteMargin: (quoteId: string, newMargin: number) => {
        const dbData = getDb();
        const quote = dbData.quotes.find(q => q.id === quoteId);
        if (!quote) throw new Error('Quote not found');

        quote.thoonMargin = newMargin;
        quote.finalPrice = quote.sellerPrice + newMargin;
        saveDb(dbData);
        return quote;
    },
    getQuotesForRequirement: (reqId: string) => {
        const { quotes } = getDb();
        const filtered = quotes.filter(q => q.reqId === reqId);
        // Deduplicate: Keep only the latest quote per seller
        const unique: Record<string, Quote> = {};
        filtered.forEach(q => {
            if (!unique[q.sellerId] || new Date(q.createdAt) > new Date(unique[q.sellerId].createdAt)) {
                unique[q.sellerId] = q;
            }
        });
        return Object.values(unique);
    },
    getBestQuoteForRequirement: (reqId: string) => {
        const dbData = getDb();
        const quotes = db.getQuotesForRequirement(reqId);
        if (quotes.length === 0) return null;

        const { users } = dbData;

        let bestQuote: Quote | null = null;
        let highestScore = -Infinity;

        const lowestPrice = Math.min(...quotes.map(q => q.sellerPrice));

        quotes.forEach(quote => {
            const seller = users.find(u => u.id === quote.sellerId);
            if (!seller) return;

            // Trust Score Calculation
            let trustScore = 0;

            // 1. Subscription Tier
            if (seller.subscriptionTier === 'gold') trustScore += 100;
            else if (seller.subscriptionTier === 'verified') trustScore += 60;

            // 2. Rating (20 points per star)
            trustScore += (seller.rating || 0) * 20;

            // 3. Experience (5 points per year, max 50)
            trustScore += Math.min((seller.experienceYears || 0) * 5, 50);

            // 4. Price Variance Penalty
            // Penalty = ((MyPrice - LowestPrice) / LowestPrice) * 1000
            // This penalizes higher prices heavily, but trust score can compensate for small differences.
            const priceVariancePercent = ((quote.sellerPrice - lowestPrice) / lowestPrice) * 100;
            const finalScore = trustScore - (priceVariancePercent * 10);

            if (finalScore > highestScore) {
                highestScore = finalScore;
                bestQuote = quote;
            }
        });

        return bestQuote;
    },

    // Market Price Methods
    getMarketPrices: () => getDb().marketPrices,
    updateMarketPrice: (id: string, updates: Partial<MarketPrice>) => {
        const dbData = getDb();
        const index = dbData.marketPrices.findIndex(mp => mp.id === id);
        if (index > -1) {
            dbData.marketPrices[index] = {
                ...dbData.marketPrices[index],
                ...updates,
                lastUpdated: new Date().toISOString()
            };
        } else {
            throw new Error('Market price record not found');
        }
        saveDb(dbData);
        return dbData.marketPrices;
    },
    addMarketPrice: (category: MarketPrice['category'], brand: string, price: number, unit: string, change: number) => {
        const dbData = getDb();
        dbData.marketPrices.push({
            id: crypto.randomUUID(),
            category,
            brand,
            price,
            unit,
            change,
            lastUpdated: new Date().toISOString()
        });
        saveDb(dbData);
        return dbData.marketPrices;
    },

    // Order Methods
    createOrder: (quoteId: string, deliveryDate: string, deliveryLocation: string, deliveryInstructions?: string) => {
        const dbData = getDb();
        const quote = dbData.quotes.find(q => q.id === quoteId);
        if (!quote) throw new Error('Quote not found');

        const req = dbData.requirements.find(r => r.id === quote.reqId);
        if (!req) throw new Error('Requirement not found');

        const now = new Date().toISOString();
        const orderNum = `THN-ORD-${dbData.orderSequence + 1}`;
        dbData.orderSequence += 1;

        const newOrder: Order = {
            id: crypto.randomUUID(),
            orderNumber: orderNum,
            reqId: quote.reqId,
            quoteId: quote.id,
            buyerId: req.buyerId,
            buyerName: req.buyerName,
            sellerId: quote.sellerId,
            sellerName: quote.sellerName,
            product: req.product,
            category: req.category,
            quantity: req.quantity,
            unit: req.unit,
            totalPrice: quote.finalPrice,
            status: 'processing',
            deliveryDate,
            deliveryLocation,
            deliveryInstructions,
            createdAt: now,
            history: [{ status: 'processing', timestamp: now }]
        };

        dbData.orders.push(newOrder);
        req.status = 'closed'; // Requirement fulfilled

        // Update last order date for buyer and seller
        const buyer = dbData.users.find(u => u.id === req.buyerId);
        const seller = dbData.users.find(u => u.id === quote.sellerId);
        if (buyer) buyer.lastOrderDate = now;
        if (seller) seller.lastOrderDate = now;

        saveDb(dbData);
        return newOrder;
    },
    getOrders: () => getDb().orders,
    updateOrderStatus: (orderId: string, status: Order['status']) => {
        const dbData = getDb();
        const order = dbData.orders.find(o => o.id === orderId);
        if (!order) throw new Error('Order not found');
        order.status = status;
        if (!order.history) order.history = [];
        order.history.push({ status, timestamp: new Date().toISOString() });
        saveDb(dbData);
        return order;
    },
    rateOrder: (orderId: string, rating: number, feedback?: string) => {
        const dbData = getDb();
        const order = dbData.orders.find(o => o.id === orderId);
        if (!order) throw new Error('Order not found');
        if (order.status !== 'delivered') throw new Error('Can only rate delivered orders');

        order.rating = rating;
        order.feedback = feedback;

        // Update seller overall rating
        const seller = dbData.users.find(u => u.id === order.sellerId);
        if (seller) {
            const sellerOrders = dbData.orders.filter(o => o.sellerId === seller.id && o.rating);
            const totalRating = sellerOrders.reduce((sum, o) => sum + (o.rating || 0), 0);
            seller.rating = Number((totalRating / sellerOrders.length).toFixed(1));
        }

        saveDb(dbData);
        return order;
    },

    // Audit Methods
    logAction: (userId: string, action: string, details: string) => {
        const dbData = getDb();
        const user = dbData.users.find(u => u.id === userId);
        const newLog: AuditLog = {
            id: crypto.randomUUID(),
            userId,
            userName: user ? user.name : 'Unknown User',
            action,
            details,
            timestamp: new Date().toISOString()
        };
        dbData.auditLogs.unshift(newLog); // Newest first
        // Keep only last 500 logs to prevent bloat
        if (dbData.auditLogs.length > 500) {
            dbData.auditLogs = dbData.auditLogs.slice(0, 500);
        }
        saveDb(dbData);
        return newLog;
    },
    getAuditLogs: () => getDb().auditLogs
};
