// Update database schema to include analytics tables
const Database = require('better-sqlite3');
const path = require('path');

console.log('🔄 Updating database schema with analytics tables...');

try {
    const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
    const db = new Database(dbPath);
    
    // Create analytics tables
    db.exec(`
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

        INSERT OR IGNORE INTO website_metrics (id, lastUpdated) VALUES ('global', datetime('now'));
    `);
    
    console.log('✅ Analytics tables created successfully');
    
    // Add sample data for testing
    console.log('📊 Adding sample analytics data...');
    
    const sampleSession = {
        id: 'session-sample-1',
        sessionId: 'sample-session-123',
        ipAddress: '203.115.100.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        deviceType: 'desktop',
        browser: 'Chrome',
        os: 'Windows',
        country: 'India',
        region: 'Tamil Nadu',
        city: 'Chennai',
        landingPage: 'http://localhost:3000/',
        pageViews: 5,
        duration: 300,
        bounceRate: 0,
        converted: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    };
    
    const insertSession = db.prepare(`
        INSERT INTO user_sessions (
            id, sessionId, ipAddress, userAgent, deviceType, browser, os,
            country, region, city, landingPage, pageViews, duration,
            bounceRate, converted, status, createdAt, lastActivity
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertSession.run(
        sampleSession.id,
        sampleSession.sessionId,
        sampleSession.ipAddress,
        sampleSession.userAgent,
        sampleSession.deviceType,
        sampleSession.browser,
        sampleSession.os,
        sampleSession.country,
        sampleSession.region,
        sampleSession.city,
        sampleSession.landingPage,
        sampleSession.pageViews,
        sampleSession.duration,
        sampleSession.bounceRate,
        sampleSession.converted,
        sampleSession.status,
        sampleSession.createdAt,
        sampleSession.lastActivity
    );
    
    console.log('✅ Sample analytics data added');
    
    db.close();
    
    console.log('\n🎉 Analytics schema update completed!');
    console.log('📊 Your database now includes:');
    console.log('   - User session tracking');
    console.log('   - Page view analytics');
    console.log('   - User activity monitoring');
    console.log('   - Daily analytics aggregation');
    console.log('   - Conversion funnel tracking');
    console.log('   - Global website metrics');
    console.log('   - Geographic and device analytics');
    console.log('   - Traffic source analysis');
    
    console.log('\n🚀 Next steps:');
    console.log('1. Add AnalyticsTracker to your layout');
    console.log('2. Access analytics dashboard');
    console.log('3. Start tracking user behavior');
    
} catch (error) {
    console.error('❌ Schema update failed:', error.message);
    process.exit(1);
}
