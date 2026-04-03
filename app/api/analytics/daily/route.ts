import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/sqlite-db';
import { AnalyticsEngine } from '@/lib/analytics';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
        
        // Check if daily analytics already exists
        let analytics = sqliteDb.getDailyAnalytics(date);
        
        if (!analytics) {
            // Generate daily analytics from raw data
            analytics = await generateDailyAnalytics(date);
            sqliteDb.saveDailyAnalytics(analytics);
        }
        
        return NextResponse.json({
            success: true,
            analytics
        });
        
    } catch (error: any) {
        console.error('Daily analytics error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch daily analytics' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { date, regenerate } = await request.json();
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        // Generate fresh analytics
        const analytics = await generateDailyAnalytics(targetDate);
        sqliteDb.saveDailyAnalytics(analytics);
        
        // Update global metrics
        await updateGlobalMetrics();
        
        return NextResponse.json({
            success: true,
            analytics,
            message: `Daily analytics regenerated for ${targetDate}`
        });
        
    } catch (error: any) {
        console.error('Daily analytics generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate daily analytics' },
            { status: 500 }
        );
    }
}

async function generateDailyAnalytics(date: string) {
    // Get all sessions for the date
    const startDate = `${date}T00:00:00.000Z`;
    const endDate = `${date}T23:59:59.999Z`;
    
    // This would need to be implemented in sqliteDb
    // For now, we'll create a mock implementation
    const sessions = [] as any[]; // Get sessions for date
    const pageViews = [] as any[]; // Get page views for date
    const activities = [] as any[]; // Get activities for date
    
    // Generate analytics using the engine
    const analytics = AnalyticsEngine.generateDailyAnalytics(date, sessions, pageViews, activities);
    
    return analytics;
}

async function updateGlobalMetrics() {
    // Get last 30 days of analytics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate global metrics
    const metrics = {
        totalUsers: 0, // Calculate from users table
        activeUsers: 0, // Calculate from recent sessions
        totalSessions: 0, // Sum of all sessions
        totalPageViews: 0, // Sum of all page views
        avgSessionDuration: 0, // Average across all sessions
        bounceRate: 0, // Average bounce rate
        conversionRate: 0, // Overall conversion rate
        revenue: 0, // Total revenue
        dailyGrowth: 0, // Calculate from daily analytics
        weeklyGrowth: 0, // Calculate from weekly comparison
        monthlyGrowth: 0, // Calculate from monthly comparison
        topPerformingPages: [], // Get from analytics
        userRetentionRate: 0, // Calculate returning users
        churnRate: 0 // Calculate lost users
    };
    
    sqliteDb.updateWebsiteMetrics(metrics);
}
