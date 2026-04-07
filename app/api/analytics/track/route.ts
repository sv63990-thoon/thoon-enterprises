import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/sqlite-db';
import { AnalyticsEngine } from '@/lib/analytics';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { type, data } = await request.json();
        
        switch (type) {
            case 'session':
                return await trackSession(data);
            case 'pageview':
                return await trackPageView(data);
            case 'activity':
                return await trackActivity(data);
            default:
                return NextResponse.json(
                    { error: 'Invalid tracking type' },
                    { status: 400 }
                );
        }
        
    } catch (error: any) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json(
            { error: 'Tracking failed' },
            { status: 500 }
        );
    }
}

async function trackSession(data: any) {
    const {
        sessionId,
        userId,
        ipAddress,
        userAgent,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        landingPage
    } = data;
    
    // Parse user agent
    const deviceInfo = AnalyticsEngine.parseUserAgent(userAgent);
    
    // Get location from IP
    const location = await AnalyticsEngine.getLocationFromIP(ipAddress);
    
    const sessionData = {
        id: crypto.randomUUID(),
        userId,
        sessionId,
        ipAddress,
        userAgent,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        country: location.country,
        region: location.region,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        landingPage,
        pageViews: 1,
        duration: 0,
        bounceRate: 0,
        converted: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
    };
    
    sqliteDb.trackSession(sessionData);
    
    return NextResponse.json({
        success: true,
        sessionId: sessionData.sessionId,
        message: 'Session tracked successfully'
    });
}

async function trackPageView(data: any) {
    const {
        sessionId,
        userId,
        page,
        title,
        referrer,
        loadTime,
        timeOnPage,
        scrollDepth,
        interactions
    } = data;
    
    const pageViewData = {
        id: crypto.randomUUID(),
        sessionId,
        userId,
        page,
        title,
        referrer,
        loadTime: loadTime || 0,
        timeOnPage: timeOnPage || 0,
        scrollDepth: scrollDepth || 0,
        interactions: interactions || 0,
        createdAt: new Date().toISOString()
    };
    
    sqliteDb.trackPageView(pageViewData);
    
    // Update session page views
    sqliteDb.updateSession(sessionId, {
        pageViews: 1, // This will increment in the actual implementation
        lastActivity: new Date().toISOString()
    });
    
    return NextResponse.json({
        success: true,
        message: 'Page view tracked successfully'
    });
}

async function trackActivity(data: any) {
    const {
        sessionId,
        userId,
        activityType,
        details,
        metadata,
        ipAddress,
        userAgent
    } = data;
    
    const activityData = {
        id: crypto.randomUUID(),
        userId,
        sessionId,
        type: activityType,
        details,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ipAddress,
        userAgent,
        createdAt: new Date().toISOString()
    };
    
    sqliteDb.trackActivity(activityData);
    
    // Track conversions
    if (activityType === 'registration' || activityType === 'order') {
        sqliteDb.updateSession(sessionId, {
            converted: 1,
            conversionType: activityType === 'registration' ? 'registration' : 'order',
            status: 'converted',
            lastActivity: new Date().toISOString()
        });
    }
    
    return NextResponse.json({
        success: true,
        message: 'Activity tracked successfully'
    });
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        
        switch (type) {
            case 'realtime':
                return await getRealTimeVisitors();
            case 'stats':
                return await getVisitorStats(searchParams);
            case 'geographic':
                return await getGeographicStats(searchParams);
            case 'devices':
                return await getDeviceStats(searchParams);
            case 'traffic':
                return await getTrafficSources(searchParams);
            case 'pages':
                return await getTopPages(searchParams);
            case 'metrics':
                return await getWebsiteMetrics();
            default:
                return NextResponse.json(
                    { error: 'Invalid analytics type' },
                    { status: 400 }
                );
        }
        
    } catch (error: any) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

async function getRealTimeVisitors() {
    const visitors = sqliteDb.getRealTimeVisitors();
    
    return NextResponse.json({
        success: true,
        visitors,
        count: visitors.length,
        timestamp: new Date().toISOString()
    });
}

async function getVisitorStats(searchParams: URLSearchParams) {
    const startDate = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date().toISOString().split('T')[0];
    
    const stats = sqliteDb.getVisitorStats(startDate, endDate);
    
    return NextResponse.json({
        success: true,
        stats,
        period: { startDate, endDate }
    });
}

async function getGeographicStats(searchParams: URLSearchParams) {
    const startDate = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date().toISOString().split('T')[0];
    
    const stats = sqliteDb.getGeographicStats(startDate, endDate);
    
    return NextResponse.json({
        success: true,
        stats,
        period: { startDate, endDate }
    });
}

async function getDeviceStats(searchParams: URLSearchParams) {
    const startDate = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date().toISOString().split('T')[0];
    
    const stats = sqliteDb.getDeviceStats(startDate, endDate);
    
    return NextResponse.json({
        success: true,
        stats,
        period: { startDate, endDate }
    });
}

async function getTrafficSources(searchParams: URLSearchParams) {
    const startDate = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date().toISOString().split('T')[0];
    
    const stats = sqliteDb.getTrafficSources(startDate, endDate);
    
    return NextResponse.json({
        success: true,
        stats,
        period: { startDate, endDate }
    });
}

async function getTopPages(searchParams: URLSearchParams) {
    const startDate = searchParams.get('start') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('end') || new Date().toISOString().split('T')[0];
    
    const pages = sqliteDb.getTopPages(startDate, endDate);
    
    return NextResponse.json({
        success: true,
        pages,
        period: { startDate, endDate }
    });
}

async function getWebsiteMetrics() {
    const metrics = sqliteDb.getWebsiteMetrics();
    
    return NextResponse.json({
        success: true,
        metrics
    });
}
