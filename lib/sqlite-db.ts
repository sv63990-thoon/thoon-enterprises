import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'thoon-enterprise.db');

export type UserRole = 'admin' | 'buyer' | 'seller' | 'architect' | 'engineer' | 'contractor' | 'developer' | 'supplier' | 'channel_partner';
export type UserStatus = 'pending' | 'active' | 'rejected' | 'verified' | 'premium';
export type SubscriptionTier = 'basic' | 'verified' | 'gold' | 'premium';

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
    subscriptionTier?: SubscriptionTier;
    lastLogin?: string;
    lastOrderDate?: string;
    createdAt: string;
    
    // Enhanced fields
    verificationStatus?: 'pending' | 'verified' | 'rejected';
    verificationDocuments?: string[];
    businessLicense?: string;
    yearsInBusiness?: number;
    annualRevenue?: string;
    serviceAreas?: string[];
    specializations?: string[];
    certifications?: string[];
    preferredBrands?: string[];
    creditLimit?: number;
    paymentTerms?: string;
    aiScore?: number;
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
}

// Initialize database
const db = new Database(DB_PATH);

// Create tables with enhanced schema
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'buyer', 'seller', 'architect', 'engineer', 'contractor', 'developer', 'supplier', 'channel_partner')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'verified', 'premium')),
        phone TEXT,
        companyName TEXT,
        address TEXT,
        gstin TEXT,
        rating REAL DEFAULT 0,
        experienceYears INTEGER DEFAULT 0,
        subscriptionTier TEXT DEFAULT 'basic' CHECK (subscriptionTier IN ('basic', 'verified', 'gold', 'premium')),
        passwordHash TEXT NOT NULL,
        salt TEXT NOT NULL,
        lastLogin TEXT,
        lastOrderDate TEXT,
        createdAt TEXT NOT NULL,
        
        -- Enhanced fields
        verificationStatus TEXT DEFAULT 'pending' CHECK (verificationStatus IN ('pending', 'verified', 'rejected')),
        verificationDocuments TEXT,
        businessLicense TEXT,
        yearsInBusiness INTEGER,
        annualRevenue TEXT,
        serviceAreas TEXT,
        specializations TEXT,
        certifications TEXT,
        preferredBrands TEXT,
        creditLimit INTEGER DEFAULT 0,
        paymentTerms TEXT,
        aiScore INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS requirements (
        id TEXT PRIMARY KEY,
        buyerId TEXT NOT NULL,
        buyerName TEXT NOT NULL,
        projectId TEXT,
        projectTitle TEXT,
        product TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        budget REAL,
        urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
        deliveryLocation TEXT NOT NULL,
        deliveryDate TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'negotiating', 'estimated', 'closed')),
        
        -- AI-powered features
        aiRecommendedPrice REAL,
        aiRecommendedSuppliers TEXT,
        marketPriceAnalysis TEXT,
        competingQuotes INTEGER DEFAULT 0,
        
        -- E-negotiation features
        negotiationEnabled INTEGER DEFAULT 0,
        bestPrice REAL,
        priceHistory TEXT,
        
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        
        FOREIGN KEY (buyerId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        reqId TEXT NOT NULL,
        sellerId TEXT NOT NULL,
        sellerName TEXT NOT NULL,
        sellerRating REAL DEFAULT 0,
        sellerVerificationStatus TEXT DEFAULT 'pending',
        sellerAiScore INTEGER DEFAULT 0,
        
        -- Enhanced pricing details
        basePrice REAL NOT NULL,
        discountPercent REAL DEFAULT 0,
        discountedPrice REAL NOT NULL,
        gstAmount REAL NOT NULL,
        deliveryCharges REAL DEFAULT 0,
        thoonMargin REAL NOT NULL,
        finalPrice REAL NOT NULL,
        
        -- Negotiation features
        negotiationEnabled INTEGER DEFAULT 0,
        minPrice REAL,
        validUntil TEXT NOT NULL,
        priceBreakdown TEXT,
        
        -- Quality and trust features
        qualityGuarantee INTEGER DEFAULT 0,
        deliveryTimeline TEXT,
        paymentTerms TEXT,
        warranty TEXT,
        
        status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'negotiating', 'accepted', 'rejected', 'expired')),
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        
        FOREIGN KEY (reqId) REFERENCES requirements(id),
        FOREIGN KEY (sellerId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        orderNumber TEXT UNIQUE NOT NULL,
        reqId TEXT NOT NULL,
        quoteId TEXT NOT NULL,
        buyerId TEXT NOT NULL,
        buyerName TEXT NOT NULL,
        sellerId TEXT NOT NULL,
        sellerName TEXT NOT NULL,
        projectId TEXT,
        
        -- Product details
        product TEXT NOT NULL,
        category TEXT NOT NULL,
        brand TEXT,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        
        -- Enhanced order management
        status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'confirmed', 'manufacturing', 'quality_check', 'shipped', 'delivered', 'completed', 'cancelled')),
        paymentStatus TEXT DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'partial', 'paid', 'overdue')),
        
        -- Logistics
        deliveryDate TEXT NOT NULL,
        deliveryLocation TEXT NOT NULL,
        deliveryInstructions TEXT,
        trackingNumber TEXT,
        logisticsPartner TEXT,
        
        -- Quality and feedback
        qualityInspection INTEGER DEFAULT 0,
        inspectionReport TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        feedback TEXT,
        
        -- Financial
        paymentTerms TEXT,
        dueDate TEXT,
        invoiceNumber TEXT,
        
        -- History tracking
        history TEXT,
        documents TEXT,
        
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        
        FOREIGN KEY (reqId) REFERENCES requirements(id),
        FOREIGN KEY (quoteId) REFERENCES quotes(id),
        FOREIGN KEY (buyerId) REFERENCES users(id),
        FOREIGN KEY (sellerId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS market_prices (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        brand TEXT NOT NULL,
        price REAL NOT NULL,
        unit TEXT NOT NULL,
        change REAL NOT NULL,
        changePercent REAL DEFAULT 0,
        lastUpdated TEXT NOT NULL,
        
        -- AI-powered insights
        trend TEXT DEFAULT 'stable' CHECK (trend IN ('increasing', 'decreasing', 'stable')),
        predictedPrice REAL,
        confidence INTEGER DEFAULT 0,
        factors TEXT,
        
        -- Regional pricing
        regionalPrices TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        userName TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        module TEXT,
        ip TEXT,
        userAgent TEXT,
        sessionId TEXT,
        
        -- AI features
        aiDetected INTEGER DEFAULT 0,
        riskLevel TEXT DEFAULT 'low' CHECK (riskLevel IN ('low', 'medium', 'high')),
        
        timestamp TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS margins (
        category TEXT PRIMARY KEY,
        marginType TEXT NOT NULL CHECK (marginType IN ('percent', 'fixed')),
        value REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_sequence (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        next_value INTEGER NOT NULL DEFAULT 1001
    );

    CREATE TABLE IF NOT EXISTS negotiation_sessions (
        id TEXT PRIMARY KEY,
        requirementId TEXT NOT NULL,
        buyerId TEXT NOT NULL,
        sellerId TEXT NOT NULL,
        initialPrice REAL NOT NULL,
        currentPrice REAL NOT NULL,
        minPrice REAL,
        maxPrice REAL,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'rejected', 'expired')),
        rounds TEXT,
        aiAssistance INTEGER DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        
        FOREIGN KEY (requirementId) REFERENCES requirements(id),
        FOREIGN KEY (buyerId) REFERENCES users(id),
        FOREIGN KEY (sellerId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('quote_received', 'order_status', 'payment_due', 'ai_insight', 'market_alert', 'verification_update')),
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        data TEXT,
        read INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        createdAt TEXT NOT NULL,
        readAt TEXT,
        
        FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        userId TEXT,
        sessionId TEXT NOT NULL,
        ipAddress TEXT NOT NULL,
        userAgent TEXT NOT NULL,
        deviceType TEXT DEFAULT 'unknown' CHECK (deviceType IN ('desktop', 'mobile', 'tablet', 'unknown')),
        browser TEXT,
        os TEXT,
        country TEXT,
        region TEXT,
        city TEXT,
        latitude REAL,
        longitude REAL,
        referrer TEXT,
        utmSource TEXT,
        utmMedium TEXT,
        utmCampaign TEXT,
        landingPage TEXT NOT NULL,
        exitPage TEXT,
        pageViews INTEGER DEFAULT 1,
        duration INTEGER DEFAULT 0,
        bounceRate REAL DEFAULT 0,
        converted INTEGER DEFAULT 0,
        conversionType TEXT CHECK (conversionType IN ('registration', 'quote_request', 'order', 'enquiry')),
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted')),
        createdAt TEXT NOT NULL,
        lastActivity TEXT NOT NULL,
        endedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS page_views (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        userId TEXT,
        page TEXT NOT NULL,
        title TEXT,
        referrer TEXT,
        loadTime INTEGER DEFAULT 0,
        timeOnPage INTEGER DEFAULT 0,
        scrollDepth REAL DEFAULT 0,
        interactions INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        
        FOREIGN KEY (sessionId) REFERENCES user_sessions(sessionId),
        FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS user_activities (
        id TEXT PRIMARY KEY,
        userId TEXT,
        sessionId TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('page_view', 'click', 'form_submit', 'download', 'search', 'login', 'registration')),
        details TEXT NOT NULL,
        metadata TEXT,
        ipAddress TEXT NOT NULL,
        userAgent TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        
        FOREIGN KEY (sessionId) REFERENCES user_sessions(sessionId),
        FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS daily_analytics (
        id TEXT PRIMARY KEY,
        date TEXT UNIQUE NOT NULL,
        totalVisitors INTEGER DEFAULT 0,
        uniqueVisitors INTEGER DEFAULT 0,
        returningVisitors INTEGER DEFAULT 0,
        newVisitors INTEGER DEFAULT 0,
        pageViews INTEGER DEFAULT 0,
        sessions INTEGER DEFAULT 0,
        avgSessionDuration INTEGER DEFAULT 0,
        bounceRate REAL DEFAULT 0,
        conversions INTEGER DEFAULT 0,
        conversionRate REAL DEFAULT 0,
        
        -- Geographic breakdown (JSON)
        topCountries TEXT,
        topCities TEXT,
        
        -- Traffic sources (JSON)
        trafficSources TEXT,
        topReferrers TEXT,
        
        -- Device breakdown (JSON)
        deviceTypes TEXT,
        browsers TEXT,
        
        -- Page performance (JSON)
        topPages TEXT,
        landingPages TEXT,
        exitPages TEXT,
        
        -- Business metrics
        registrations INTEGER DEFAULT 0,
        quoteRequests INTEGER DEFAULT 0,
        orders INTEGER DEFAULT 0,
        revenue REAL DEFAULT 0,
        
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversion_funnels (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        stage TEXT NOT NULL CHECK (stage IN ('visit', 'landing', 'engagement', 'registration', 'quote_request', 'order')),
        users INTEGER DEFAULT 0,
        conversionRate REAL DEFAULT 0,
        dropOffRate REAL DEFAULT 0,
        avgTimeToConvert INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS website_metrics (
        id TEXT PRIMARY KEY CHECK (id = 'global'),
        totalUsers INTEGER DEFAULT 0,
        activeUsers INTEGER DEFAULT 0,
        totalSessions INTEGER DEFAULT 0,
        totalPageViews INTEGER DEFAULT 0,
        avgSessionDuration INTEGER DEFAULT 0,
        bounceRate REAL DEFAULT 0,
        conversionRate REAL DEFAULT 0,
        revenue REAL DEFAULT 0,
        
        -- Growth rates
        dailyGrowth REAL DEFAULT 0,
        weeklyGrowth REAL DEFAULT 0,
        monthlyGrowth REAL DEFAULT 0,
        
        -- Performance metrics
        topPerformingPages TEXT,
        userRetentionRate REAL DEFAULT 0,
        churnRate REAL DEFAULT 0,
        
        lastUpdated TEXT NOT NULL
    );

    INSERT OR IGNORE INTO order_sequence (id, next_value) VALUES (1, 1001);
    INSERT OR IGNORE INTO website_metrics (id, lastUpdated) VALUES ('global', datetime('now'));
`);

// Utility functions
function hashPassword(password: string): { salt: string; hash: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

// Database operations
export const sqliteDb = {
    // User operations
    findUserByEmail: (email: string): User | null => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email.toLowerCase().trim()) as any;
        if (!user) return null;
        
        const { passwordHash, salt, ...safeUser } = user;
        return safeUser;
    },

    findUserByPhone: (phone: string): User | null => {
        const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
        const user = stmt.get(phone.trim()) as any;
        if (!user) return null;
        
        const { passwordHash, salt, ...safeUser } = user;
        return safeUser;
    },

    createUser: (userData: {
        name: string;
        email: string;
        phone: string;
        role: UserRole;
        password?: string;
    }): User => {
        const { name, email, phone, role, password = 'default123' } = userData;
        
        const { salt, hash } = hashPassword(password);
        const now = new Date().toISOString();
        
        const stmt = db.prepare(`
            INSERT INTO users (id, name, email, role, status, phone, passwordHash, salt, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const userId = crypto.randomUUID();
        stmt.run(userId, name.trim(), email.toLowerCase().trim(), role, 'pending', phone.trim(), hash, salt, now);
        
        return {
            id: userId,
            name: name.trim(),
            email: email.toLowerCase().trim(),
            role,
            status: 'pending',
            phone: phone.trim(),
            createdAt: now
        };
    },

    validateUser: (email: string, password: string): User | null => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email.toLowerCase().trim()) as any;
        
        if (!user) return null;
        if (!verifyPassword(password, user.salt, user.passwordHash)) return null;
        
        const { passwordHash, salt, ...safeUser } = user;
        return safeUser;
    },

    updateUserStatus: (userId: string, status: UserStatus): User => {
        const stmt = db.prepare('UPDATE users SET status = ? WHERE id = ?');
        stmt.run(status, userId);
        
        const userStmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const user = userStmt.get(userId) as any;
        const { passwordHash, salt, ...safeUser } = user;
        return safeUser;
    },

    getAllUsers: (): User[] => {
        const stmt = db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
        const users = stmt.all() as any[];
        return users.map(user => {
            const { passwordHash, salt, ...safeUser } = user;
            return safeUser;
        });
    },

    getPendingUsers: (): User[] => {
        const stmt = db.prepare('SELECT * FROM users WHERE status = ? ORDER BY createdAt DESC');
        const users = stmt.all('pending') as any[];
        return users.map(user => {
            const { passwordHash, salt, ...safeUser } = user;
            return safeUser;
        });
    },

    updateLastLogin: (userId: string): void => {
        const stmt = db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?');
        stmt.run(new Date().toISOString(), userId);
    },

    // Requirement operations
    createRequirement: (data: Omit<Requirement, 'id' | 'createdAt'>): Requirement => {
        const stmt = db.prepare(`
            INSERT INTO requirements (id, buyerId, buyerName, product, category, brand, quantity, unit, status, deliveryLocation, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const reqId = crypto.randomUUID();
        const now = new Date().toISOString();
        
        stmt.run(
            reqId,
            data.buyerId,
            data.buyerName,
            data.product,
            data.category,
            data.brand,
            data.quantity,
            data.unit,
            data.status,
            data.deliveryLocation,
            now
        );
        
        return {
            id: reqId,
            ...data,
            createdAt: now
        };
    },

    getRequirements: (): Requirement[] => {
        const stmt = db.prepare('SELECT * FROM requirements ORDER BY createdAt DESC');
        return stmt.all() as Requirement[];
    },

    // Quote operations
    submitQuote: (data: Omit<Quote, 'id' | 'createdAt'>): Quote => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO quotes (id, reqId, sellerId, sellerName, sellerPrice, thoonMargin, finalPrice, status, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const quoteId = crypto.randomUUID();
        const now = new Date().toISOString();
        
        stmt.run(
            quoteId,
            data.reqId,
            data.sellerId,
            data.sellerName,
            data.sellerPrice,
            data.thoonMargin,
            data.finalPrice,
            data.status,
            now
        );
        
        // Update requirement status
        const updateReqStmt = db.prepare('UPDATE requirements SET status = ? WHERE id = ?');
        updateReqStmt.run('estimated', data.reqId);
        
        return {
            id: quoteId,
            ...data,
            createdAt: now
        };
    },

    getQuotes: (): Quote[] => {
        const stmt = db.prepare('SELECT * FROM quotes ORDER BY createdAt DESC');
        return stmt.all() as Quote[];
    },

    // Order operations
    createOrder: (data: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
        // Get next order number
        const seqStmt = db.prepare('SELECT next_value FROM order_sequence WHERE id = 1');
        const { next_value } = seqStmt.get() as { next_value: number };
        const orderNumber = `THN-ORD-${next_value}`;
        
        // Update sequence
        const updateSeqStmt = db.prepare('UPDATE order_sequence SET next_value = ? WHERE id = 1');
        updateSeqStmt.run(next_value + 1);
        
        const stmt = db.prepare(`
            INSERT INTO orders (id, orderNumber, reqId, quoteId, buyerId, buyerName, sellerId, sellerName, 
                              product, category, quantity, unit, totalPrice, status, deliveryDate, 
                              deliveryLocation, deliveryInstructions, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const orderId = crypto.randomUUID();
        const now = new Date().toISOString();
        
        stmt.run(
            orderId,
            orderNumber,
            data.reqId,
            data.quoteId,
            data.buyerId,
            data.buyerName,
            data.sellerId,
            data.sellerName,
            data.product,
            data.category,
            data.quantity,
            data.unit,
            data.totalPrice,
            data.status,
            data.deliveryDate,
            data.deliveryLocation,
            data.deliveryInstructions,
            now
        );
        
        // Update requirement status
        const updateReqStmt = db.prepare('UPDATE requirements SET status = ? WHERE id = ?');
        updateReqStmt.run('closed', data.reqId);
        
        return {
            id: orderId,
            orderNumber,
            ...data,
            createdAt: now
        };
    },

    getOrders: (): Order[] => {
        const stmt = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC');
        return stmt.all() as Order[];
    },

    // Market price operations
    getMarketPrices: () => {
        const stmt = db.prepare('SELECT * FROM market_prices ORDER BY category, brand');
        return stmt.all();
    },

    // Audit operations
    logAction: (userId: string, action: string, details: string) => {
        const stmt = db.prepare(`
            INSERT INTO audit_logs (id, userId, userName, action, details, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        const user = sqliteDb.findUserByEmail('') || { name: 'Unknown User' };
        const logId = crypto.randomUUID();
        
        stmt.run(logId, userId, user.name, action, details, new Date().toISOString());
    },

    getAuditLogs: () => {
        const stmt = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 500');
        return stmt.all();
    },

    // Analytics operations
    trackSession: (sessionData: any) => {
        const stmt = db.prepare(`
            INSERT INTO user_sessions (
                id, userId, sessionId, ipAddress, userAgent, deviceType, browser, os,
                country, region, city, referrer, utmSource, utmMedium, utmCampaign,
                landingPage, pageViews, duration, bounceRate, converted, status,
                createdAt, lastActivity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        return stmt.run(
            sessionData.id,
            sessionData.userId || null,
            sessionData.sessionId,
            sessionData.ipAddress,
            sessionData.userAgent,
            sessionData.deviceType,
            sessionData.browser,
            sessionData.os,
            sessionData.country,
            sessionData.region,
            sessionData.city,
            sessionData.referrer || null,
            sessionData.utmSource || null,
            sessionData.utmMedium || null,
            sessionData.utmCampaign || null,
            sessionData.landingPage,
            sessionData.pageViews || 1,
            sessionData.duration || 0,
            sessionData.bounceRate || 0,
            sessionData.converted || 0,
            sessionData.status || 'active',
            sessionData.createdAt,
            sessionData.lastActivity
        );
    },
    
    trackPageView: (pageViewData: any) => {
        const stmt = db.prepare(`
            INSERT INTO page_views (
                id, sessionId, userId, page, title, referrer, loadTime,
                timeOnPage, scrollDepth, interactions, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        return stmt.run(
            pageViewData.id,
            pageViewData.sessionId,
            pageViewData.userId || null,
            pageViewData.page,
            pageViewData.title || null,
            pageViewData.referrer || null,
            pageViewData.loadTime || 0,
            pageViewData.timeOnPage || 0,
            pageViewData.scrollDepth || 0,
            pageViewData.interactions || 0,
            pageViewData.createdAt
        );
    },
    
    trackActivity: (activityData: any) => {
        const stmt = db.prepare(`
            INSERT INTO user_activities (
                id, userId, sessionId, type, details, metadata, ipAddress, userAgent, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        return stmt.run(
            activityData.id,
            activityData.userId || null,
            activityData.sessionId,
            activityData.type,
            activityData.details,
            activityData.metadata || null,
            activityData.ipAddress,
            activityData.userAgent,
            activityData.createdAt
        );
    },
    
    updateSession: (sessionId: string, updates: any) => {
        const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);
        
        const stmt = db.prepare(`
            UPDATE user_sessions SET ${setClause}, lastActivity = ? WHERE sessionId = ?
        `);
        
        return stmt.run(...values, new Date().toISOString(), sessionId);
    },
    
    getDailyAnalytics: (date: string) => {
        return db.prepare('SELECT * FROM daily_analytics WHERE date = ?').get(date);
    },
    
    saveDailyAnalytics: (analytics: any) => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO daily_analytics (
                id, date, totalVisitors, uniqueVisitors, returningVisitors, newVisitors,
                pageViews, sessions, avgSessionDuration, bounceRate, conversions, conversionRate,
                topCountries, topCities, trafficSources, topReferrers, deviceTypes, browsers,
                topPages, landingPages, exitPages, registrations, quoteRequests, orders, revenue,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        return stmt.run(
            analytics.id,
            analytics.date,
            analytics.totalVisitors,
            analytics.uniqueVisitors,
            analytics.returningVisitors,
            analytics.newVisitors,
            analytics.pageViews,
            analytics.sessions,
            analytics.avgSessionDuration,
            analytics.bounceRate,
            analytics.conversions,
            analytics.conversionRate,
            JSON.stringify(analytics.topCountries),
            JSON.stringify(analytics.topCities),
            JSON.stringify(analytics.trafficSources),
            JSON.stringify(analytics.topReferrers),
            JSON.stringify(analytics.deviceTypes),
            JSON.stringify(analytics.browsers),
            JSON.stringify(analytics.topPages),
            JSON.stringify(analytics.landingPages),
            JSON.stringify(analytics.exitPages),
            analytics.registrations,
            analytics.quoteRequests,
            analytics.orders,
            analytics.revenue,
            analytics.createdAt,
            analytics.updatedAt
        );
    },
    
    getRealTimeVisitors: () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        
        return db.prepare(`
            SELECT 
                sessionId, userId, ipAddress, deviceType, country, city,
                landingPage as currentPage, pageViews, duration, lastActivity
            FROM user_sessions 
            WHERE status = 'active' AND lastActivity > ?
            ORDER BY lastActivity DESC
        `).all(fiveMinutesAgo);
    },
    
    getWebsiteMetrics: () => {
        return db.prepare('SELECT * FROM website_metrics WHERE id = ?').get('global');
    },
    
    updateWebsiteMetrics: (metrics: any) => {
        const stmt = db.prepare(`
            UPDATE website_metrics SET 
                totalUsers = ?, activeUsers = ?, totalSessions = ?, totalPageViews = ?,
                avgSessionDuration = ?, bounceRate = ?, conversionRate = ?, revenue = ?,
                dailyGrowth = ?, weeklyGrowth = ?, monthlyGrowth = ?,
                topPerformingPages = ?, userRetentionRate = ?, churnRate = ?,
                lastUpdated = ?
            WHERE id = ?
        `);
        
        return stmt.run(
            metrics.totalUsers,
            metrics.activeUsers,
            metrics.totalSessions,
            metrics.totalPageViews,
            metrics.avgSessionDuration,
            metrics.bounceRate,
            metrics.conversionRate,
            metrics.revenue,
            metrics.dailyGrowth,
            metrics.weeklyGrowth,
            metrics.monthlyGrowth,
            JSON.stringify(metrics.topPerformingPages),
            metrics.userRetentionRate,
            metrics.churnRate,
            new Date().toISOString(),
            'global'
        );
    },
    
    getVisitorStats: (startDate: string, endDate: string) => {
        return db.prepare(`
            SELECT 
                DATE(createdAt) as date,
                COUNT(*) as totalVisitors,
                COUNT(DISTINCT ipAddress) as uniqueVisitors,
                SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions,
                AVG(duration) as avgSessionDuration,
                AVG(bounceRate) as avgBounceRate
            FROM user_sessions 
            WHERE DATE(createdAt) BETWEEN ? AND ?
            GROUP BY DATE(createdAt)
            ORDER BY date DESC
        `).all(startDate, endDate);
    },
    
    getGeographicStats: (startDate: string, endDate: string) => {
        return db.prepare(`
            SELECT 
                country, region, city,
                COUNT(*) as visitors,
                COUNT(DISTINCT ipAddress) as uniqueVisitors,
                SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions
            FROM user_sessions 
            WHERE DATE(createdAt) BETWEEN ? AND ?
            GROUP BY country, region, city
            ORDER BY visitors DESC
            LIMIT 20
        `).all(startDate, endDate);
    },
    
    getDeviceStats: (startDate: string, endDate: string) => {
        return db.prepare(`
            SELECT 
                deviceType, browser, os,
                COUNT(*) as visitors,
                COUNT(DISTINCT ipAddress) as uniqueVisitors,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM user_sessions WHERE DATE(createdAt) BETWEEN ? AND ?), 2) as percentage
            FROM user_sessions 
            WHERE DATE(createdAt) BETWEEN ? AND ?
            GROUP BY deviceType, browser, os
            ORDER BY visitors DESC
        `).all(startDate, endDate, startDate, endDate);
    },
    
    getTrafficSources: (startDate: string, endDate: string) => {
        return db.prepare(`
            SELECT 
                utmSource as source,
                utmMedium as medium,
                referrer,
                COUNT(*) as visitors,
                COUNT(DISTINCT ipAddress) as uniqueVisitors,
                SUM(CASE WHEN converted = 1 THEN 1 ELSE 0 END) as conversions
            FROM user_sessions 
            WHERE DATE(createdAt) BETWEEN ? AND ?
            GROUP BY utmSource, utmMedium, referrer
            ORDER BY visitors DESC
        `).all(startDate, endDate);
    },
    
    getTopPages: (startDate: string, endDate: string) => {
        return db.prepare(`
            SELECT 
                page,
                COUNT(*) as views,
                COUNT(DISTINCT sessionId) as uniqueViews,
                AVG(timeOnPage) as avgTimeOnPage,
                AVG(scrollDepth) as avgScrollDepth
            FROM page_views pv
            JOIN user_sessions us ON pv.sessionId = us.sessionId
            WHERE DATE(pv.createdAt) BETWEEN ? AND ?
            GROUP BY page
            ORDER BY views DESC
            LIMIT 20
        `).all(startDate, endDate);
    },

    // Close database connection
    close: () => {
        db.close();
    }
};

export default sqliteDb;
