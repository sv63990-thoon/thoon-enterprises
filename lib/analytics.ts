import crypto from 'crypto';

// Analytics and User Tracking Types
export interface UserSession {
    id: string;
    userId?: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
    browser: string;
    os: string;
    location: {
        country: string;
        region: string;
        city: string;
        latitude?: number;
        longitude?: number;
    };
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    landingPage: string;
    exitPage?: string;
    pageViews: number;
    duration: number; // in seconds
    bounceRate: number;
    converted: boolean;
    conversionType?: 'registration' | 'quote_request' | 'order' | 'enquiry';
    status: 'active' | 'expired' | 'converted';
    createdAt: string;
    lastActivity: string;
    endedAt?: string;
}

export interface PageView {
    id: string;
    sessionId: string;
    userId?: string;
    page: string;
    title: string;
    referrer?: string;
    loadTime: number; // in milliseconds
    timeOnPage: number; // in seconds
    scrollDepth: number; // percentage
    interactions: number;
    createdAt: string;
}

export interface UserActivity {
    id: string;
    userId?: string;
    sessionId: string;
    type: 'page_view' | 'click' | 'form_submit' | 'download' | 'search' | 'login' | 'registration';
    details: string;
    metadata?: any;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
}

export interface DailyAnalytics {
    id: string;
    date: string;
    totalVisitors: number;
    uniqueVisitors: number;
    returningVisitors: number;
    newVisitors: number;
    pageViews: number;
    sessions: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversions: number;
    conversionRate: number;
    
    // Geographic breakdown
    topCountries: { country: string; visitors: number; percentage: number }[];
    topCities: { city: string; visitors: number; percentage: number }[];
    
    // Traffic sources
    trafficSources: { source: string; visitors: number; percentage: number }[];
    topReferrers: { referrer: string; visitors: number; percentage: number }[];
    
    // Device breakdown
    deviceTypes: { type: string; visitors: number; percentage: number }[];
    browsers: { browser: string; visitors: number; percentage: number }[];
    
    // Page performance
    topPages: { page: string; views: number; avgTime: number; bounceRate: number }[];
    landingPages: { page: string; visitors: number; conversions: number; conversionRate: number }[];
    exitPages: { page: string; exits: number; exitRate: number }[];
    
    // Business metrics
    registrations: number;
    quoteRequests: number;
    orders: number;
    revenue: number;
    
    createdAt: string;
    updatedAt: string;
}

export interface RealTimeVisitor {
    id: string;
    sessionId: string;
    userId?: string;
    currentPage: string;
    timeOnPage: number;
    totalPageViews: number;
    duration: number;
    location: {
        country: string;
        city: string;
    };
    deviceType: string;
    referrer?: string;
    isNew: boolean;
    lastActivity: string;
}

export interface ConversionFunnel {
    date: string;
    stage: 'visit' | 'landing' | 'engagement' | 'registration' | 'quote_request' | 'order';
    users: number;
    conversionRate: number;
    dropOffRate: number;
    avgTimeToConvert: number;
}

export interface WebsiteMetrics {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    totalPageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
    revenue: number;
    growthRate: {
        daily: number;
        weekly: number;
        monthly: number;
    };
    topPerformingPages: string[];
    userRetentionRate: number;
    churnRate: number;
}

export class AnalyticsEngine {
    
    // Parse user agent and device information
    static parseUserAgent(userAgent: string): {
        deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
        browser: string;
        os: string;
    } {
        const ua = userAgent.toLowerCase();
        
        // Device type detection
        let deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown' = 'unknown';
        if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
            deviceType = 'mobile';
        } else if (ua.includes('tablet') || ua.includes('ipad')) {
            deviceType = 'tablet';
        } else if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux')) {
            deviceType = 'desktop';
        }
        
        // Browser detection
        let browser = 'Unknown';
        if (ua.includes('chrome')) browser = 'Chrome';
        else if (ua.includes('firefox')) browser = 'Firefox';
        else if (ua.includes('safari')) browser = 'Safari';
        else if (ua.includes('edge')) browser = 'Edge';
        else if (ua.includes('opera')) browser = 'Opera';
        
        // OS detection
        let os = 'Unknown';
        if (ua.includes('windows')) os = 'Windows';
        else if (ua.includes('mac')) os = 'macOS';
        else if (ua.includes('linux')) os = 'Linux';
        else if (ua.includes('android')) os = 'Android';
        else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
        
        return { deviceType, browser, os };
    }
    
    // Get location from IP address (mock implementation)
    static async getLocationFromIP(ip: string): Promise<{
        country: string;
        region: string;
        city: string;
        latitude?: number;
        longitude?: number;
    }> {
        // In production, use a real IP geolocation service like:
        // - ip-api.com
        // - ipstack.com
        // - maxmind.com
        
        // Mock implementation for demo
        const mockLocations = {
            '127.0.0.1': { country: 'India', region: 'Tamil Nadu', city: 'Chennai' },
            'localhost': { country: 'India', region: 'Tamil Nadu', city: 'Chennai' },
            'default': { country: 'India', region: 'Tamil Nadu', city: 'Chennai' }
        };
        
        return mockLocations[ip] || mockLocations.default;
    }
    
    // Generate unique session ID
    static generateSessionId(): string {
        return crypto.randomBytes(16).toString('hex');
    }
    
    // Calculate session metrics
    static calculateSessionMetrics(session: UserSession, pageViews: PageView[]): {
        duration: number;
        bounceRate: number;
        avgTimeOnPage: number;
    } {
        const duration = session.endedAt ? 
            Math.floor((new Date(session.endedAt).getTime() - new Date(session.createdAt).getTime()) / 1000) :
            Math.floor((new Date().getTime() - new Date(session.createdAt).getTime()) / 1000);
        
        const bounceRate = pageViews.length === 1 ? 100 : 0;
        const avgTimeOnPage = pageViews.length > 0 ? 
            Math.floor(pageViews.reduce((sum, pv) => sum + pv.timeOnPage, 0) / pageViews.length) : 0;
        
        return { duration, bounceRate, avgTimeOnPage };
    }
    
    // Generate daily analytics from raw data
    static generateDailyAnalytics(
        date: string,
        sessions: UserSession[],
        pageViews: PageView[],
        activities: UserActivity[]
    ): DailyAnalytics {
        const uniqueVisitors = new Set(sessions.map(s => s.ipAddress)).size;
        const returningVisitors = sessions.filter(s => s.pageViews > 1).length;
        const newVisitors = uniqueVisitors - returningVisitors;
        
        const totalPageViews = pageViews.length;
        const avgSessionDuration = sessions.length > 0 ? 
            Math.floor(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length) : 0;
        
        const bouncedSessions = sessions.filter(s => s.pageViews === 1).length;
        const bounceRate = sessions.length > 0 ? (bouncedSessions / sessions.length) * 100 : 0;
        
        const conversions = sessions.filter(s => s.converted).length;
        const conversionRate = sessions.length > 0 ? (conversions / sessions.length) * 100 : 0;
        
        // Geographic breakdown
        const countryCounts: { [key: string]: number } = {};
        const cityCounts: { [key: string]: number } = {};
        
        sessions.forEach(session => {
            countryCounts[session.location.country] = (countryCounts[session.location.country] || 0) + 1;
            cityCounts[session.location.city] = (cityCounts[session.location.city] || 0) + 1;
        });
        
        const topCountries = Object.entries(countryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([country, visitors]) => ({
                country,
                visitors,
                percentage: Math.round((visitors / sessions.length) * 100)
            }));
        
        const topCities = Object.entries(cityCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([city, visitors]) => ({
                city,
                visitors,
                percentage: Math.round((visitors / sessions.length) * 100)
            }));
        
        // Traffic sources
        const sourceCounts: { [key: string]: number } = {};
        const referrerCounts: { [key: string]: number } = {};
        
        sessions.forEach(session => {
            const source = session.utmSource || 'direct';
            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
            
            if (session.referrer && session.referrer !== 'direct') {
                referrerCounts[session.referrer] = (referrerCounts[session.referrer] || 0) + 1;
            }
        });
        
        const trafficSources = Object.entries(sourceCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([source, visitors]) => ({
                source,
                visitors,
                percentage: Math.round((visitors / sessions.length) * 100)
            }));
        
        const topReferrers = Object.entries(referrerCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([referrer, visitors]) => ({
                referrer,
                visitors,
                percentage: Math.round((visitors / sessions.length) * 100)
            }));
        
        // Device breakdown
        const deviceCounts: { [key: string]: number } = {};
        const browserCounts: { [key: string]: number } = {};
        
        sessions.forEach(session => {
            deviceCounts[session.deviceType] = (deviceCounts[session.deviceType] || 0) + 1;
            browserCounts[session.browser] = (browserCounts[session.browser] || 0) + 1;
        });
        
        const deviceTypes = Object.entries(deviceCounts)
            .map(([type, visitors]) => ({
                type,
                visitors,
                percentage: Math.round((visitors / sessions.length) * 100)
            }));
        
        const browsers = Object.entries(browserCounts)
            .map(([browser, visitors]) => ({
                browser,
                visitors,
                percentage: Math.round((visitors / sessions.length) * 100)
            }));
        
        // Page performance
        const pageViewCounts: { [key: string]: { views: number; totalTime: number; bounces: number } } = {};
        
        pageViews.forEach(pv => {
            if (!pageViewCounts[pv.page]) {
                pageViewCounts[pv.page] = { views: 0, totalTime: 0, bounces: 0 };
            }
            pageViewCounts[pv.page].views += 1;
            pageViewCounts[pv.page].totalTime += pv.timeOnPage;
        });
        
        const topPages = Object.entries(pageViewCounts)
            .sort(([,a], [,b]) => b.views - a.views)
            .slice(0, 10)
            .map(([page, data]) => ({
                page,
                views: data.views,
                avgTime: Math.floor(data.totalTime / data.views),
                bounceRate: Math.round((data.bounces / data.views) * 100)
            }));
        
        // Business metrics
        const registrations = activities.filter(a => a.type === 'registration').length;
        const quoteRequests = activities.filter(a => a.details.includes('quote')).length;
        const orders = activities.filter(a => a.details.includes('order')).length;
        const revenue = orders * 50000; // Mock revenue calculation
        
        return {
            id: `daily-${date}`,
            date,
            totalVisitors: sessions.length,
            uniqueVisitors,
            returningVisitors,
            newVisitors,
            pageViews: totalPageViews,
            sessions: sessions.length,
            avgSessionDuration,
            bounceRate,
            conversions,
            conversionRate,
            topCountries,
            topCities,
            trafficSources,
            topReferrers,
            deviceTypes,
            browsers,
            topPages,
            landingPages: [], // To be calculated
            exitPages: [], // To be calculated
            registrations,
            quoteRequests,
            orders,
            revenue,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    // Calculate conversion funnel
    static calculateConversionFunnel(
        date: string,
        sessions: UserSession[],
        activities: UserActivity[]
    ): ConversionFunnel[] {
        const stages: ConversionFunnel[] = [
            {
                date,
                stage: 'visit',
                users: sessions.length,
                conversionRate: 100,
                dropOffRate: 0,
                avgTimeToConvert: 0
            }
        ];
        
        // Calculate each stage
        const landingUsers = sessions.filter(s => s.pageViews > 0).length;
        stages.push({
            date,
            stage: 'landing',
            users: landingUsers,
            conversionRate: sessions.length > 0 ? (landingUsers / sessions.length) * 100 : 0,
            dropOffRate: sessions.length > 0 ? ((sessions.length - landingUsers) / sessions.length) * 100 : 0,
            avgTimeToConvert: 30 // Mock value
        });
        
        const engagedUsers = sessions.filter(s => s.pageViews > 1).length;
        stages.push({
            date,
            stage: 'engagement',
            users: engagedUsers,
            conversionRate: sessions.length > 0 ? (engagedUsers / sessions.length) * 100 : 0,
            dropOffRate: landingUsers > 0 ? ((landingUsers - engagedUsers) / landingUsers) * 100 : 0,
            avgTimeToConvert: 120 // Mock value
        });
        
        const registrations = activities.filter(a => a.type === 'registration').length;
        stages.push({
            date,
            stage: 'registration',
            users: registrations,
            conversionRate: sessions.length > 0 ? (registrations / sessions.length) * 100 : 0,
            dropOffRate: engagedUsers > 0 ? ((engagedUsers - registrations) / engagedUsers) * 100 : 0,
            avgTimeToConvert: 300 // Mock value
        });
        
        const quoteRequests = activities.filter(a => a.details.includes('quote')).length;
        stages.push({
            date,
            stage: 'quote_request',
            users: quoteRequests,
            conversionRate: sessions.length > 0 ? (quoteRequests / sessions.length) * 100 : 0,
            dropOffRate: registrations > 0 ? ((registrations - quoteRequests) / registrations) * 100 : 0,
            avgTimeToConvert: 600 // Mock value
        });
        
        const orders = activities.filter(a => a.details.includes('order')).length;
        stages.push({
            date,
            stage: 'order',
            users: orders,
            conversionRate: sessions.length > 0 ? (orders / sessions.length) * 100 : 0,
            dropOffRate: quoteRequests > 0 ? ((quoteRequests - orders) / quoteRequests) * 100 : 0,
            avgTimeToConvert: 1800 // Mock value
        });
        
        return stages;
    }
    
    // Calculate growth rates
    static calculateGrowthRates(currentData: DailyAnalytics[], previousData: DailyAnalytics[]): {
        daily: number;
        weekly: number;
        monthly: number;
    } {
        const currentVisitors = currentData.reduce((sum, d) => sum + d.uniqueVisitors, 0);
        const previousVisitors = previousData.reduce((sum, d) => sum + d.uniqueVisitors, 0);
        
        const dailyGrowth = previousData.length > 0 ? 
            ((currentVisitors - previousVisitors) / previousVisitors) * 100 : 0;
        
        // Mock weekly and monthly calculations
        const weeklyGrowth = dailyGrowth * 7;
        const monthlyGrowth = dailyGrowth * 30;
        
        return {
            daily: Math.round(dailyGrowth * 100) / 100,
            weekly: Math.round(weeklyGrowth * 100) / 100,
            monthly: Math.round(monthlyGrowth * 100) / 100
        };
    }
}

export default AnalyticsEngine;
