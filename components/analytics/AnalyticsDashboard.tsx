'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Users,
    Eye,
    MousePointer,
    Globe,
    Smartphone,
    Monitor,
    Tablet,
    TrendingUp,
    TrendingDown,
    Calendar,
    BarChart3,
    PieChart,
    Activity,
    Clock,
    Target,
    DollarSign
} from 'lucide-react';

interface AnalyticsData {
    visitors: any[];
    realTimeVisitors: any[];
    geographicStats: any[];
    deviceStats: any[];
    trafficSources: any[];
    topPages: any[];
    globalMetrics: any;
}

export default function AnalyticsDashboard() {
    const [data, setData] = useState<AnalyticsData>({
        visitors: [],
        realTimeVisitors: [],
        geographicStats: [],
        deviceStats: [],
        trafficSources: [],
        topPages: [],
        globalMetrics: {}
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchAnalyticsData();
        const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [dateRange]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            
            const [
                statsResponse,
                geographicResponse,
                deviceResponse,
                trafficResponse,
                pagesResponse,
                metricsResponse
            ] = await Promise.all([
                fetch(`/api/analytics/track?type=stats&start=${dateRange.start}&end=${dateRange.end}`),
                fetch(`/api/analytics/track?type=geographic&start=${dateRange.start}&end=${dateRange.end}`),
                fetch(`/api/analytics/track?type=devices&start=${dateRange.start}&end=${dateRange.end}`),
                fetch(`/api/analytics/track?type=traffic&start=${dateRange.start}&end=${dateRange.end}`),
                fetch(`/api/analytics/track?type=pages&start=${dateRange.start}&end=${dateRange.end}`),
                fetch('/api/analytics/track?type=metrics')
            ]);

            const [
                statsData,
                geographicData,
                deviceData,
                trafficData,
                pagesData,
                metricsData
            ] = await Promise.all([
                statsResponse.json(),
                geographicResponse.json(),
                deviceResponse.json(),
                trafficResponse.json(),
                pagesResponse.json(),
                metricsResponse.json()
            ]);

            setData({
                visitors: statsData.stats || [],
                realTimeVisitors: [],
                geographicStats: geographicData.stats || [],
                deviceStats: deviceData.stats || [],
                trafficSources: trafficData.stats || [],
                topPages: pagesData.pages || [],
                globalMetrics: metricsData.metrics || {}
            });
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRealTimeData = async () => {
        try {
            const response = await fetch('/api/analytics/track?type=realtime');
            const data = await response.json();
            
            setData(prev => ({
                ...prev,
                realTimeVisitors: data.visitors || []
            }));
        } catch (error) {
            console.error('Failed to fetch real-time data:', error);
        }
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType.toLowerCase()) {
            case 'mobile': return <Smartphone className="h-4 w-4" />;
            case 'desktop': return <Monitor className="h-4 w-4" />;
            case 'tablet': return <Tablet className="h-4 w-4" />;
            default: return <Monitor className="h-4 w-4" />;
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const totalVisitors = data.visitors.reduce((sum, day) => sum + day.uniqueVisitors, 0);
    const totalPageViews = data.visitors.reduce((sum, day) => sum + (day.totalVisitors || 0), 0);
    const totalConversions = data.visitors.reduce((sum, day) => sum + (day.conversions || 0), 0);
    const avgSessionDuration = data.visitors.length > 0 ? 
        Math.floor(data.visitors.reduce((sum, day) => sum + (day.avgSessionDuration || 0), 0) / data.visitors.length) : 0;

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your website's global reach and performance</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        className="px-3 py-2 border rounded-lg"
                    />
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        className="px-3 py-2 border rounded-lg"
                    />
                    <Button onClick={fetchAnalyticsData}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalVisitors)}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Page Views</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalPageViews)}</p>
                            </div>
                            <Eye className="h-8 w-8 text-green-600" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Conversions</p>
                                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalConversions)}</p>
                            </div>
                            <Target className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                                <p className="text-2xl font-bold text-gray-900">{formatDuration(avgSessionDuration)}</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Real-time Visitors */}
            <Card>
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Real-time Visitors</h2>
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{data.realTimeVisitors.length} active now</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {data.realTimeVisitors.slice(0, 5).map((visitor, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {getDeviceIcon(visitor.deviceType)}
                                    <div>
                                        <p className="text-sm font-medium">{visitor.country}, {visitor.city}</p>
                                        <p className="text-xs text-gray-500">{visitor.currentPage}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">{visitor.pageViews} pages</p>
                                    <p className="text-xs text-gray-500">{formatDuration(visitor.duration)}</p>
                                </div>
                            </div>
                        ))}
                        {data.realTimeVisitors.length === 0 && (
                            <p className="text-center text-gray-500 py-4">No active visitors</p>
                        )}
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Geographic Distribution */}
                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Geographic Distribution</h2>
                            <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-3">
                            {data.geographicStats.slice(0, 6).map((stat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                        <span className="text-sm font-medium">{stat.city}, {stat.country}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{stat.visitors}</p>
                                        <p className="text-xs text-gray-500">{stat.conversions} conv.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                {/* Device Breakdown */}
                <Card>
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Device Breakdown</h2>
                            <Smartphone className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="space-y-3">
                            {data.deviceStats.slice(0, 6).map((stat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {getDeviceIcon(stat.deviceType)}
                                        <div>
                                            <p className="text-sm font-medium capitalize">{stat.deviceType}</p>
                                            <p className="text-xs text-gray-500">{stat.browser}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{stat.visitors}</p>
                                        <p className="text-xs text-gray-500">{stat.percentage}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Top Pages */}
            <Card>
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Top Pages</h2>
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 text-sm font-medium text-gray-600">Page</th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-600">Views</th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-600">Unique</th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-600">Avg Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.topPages.map((page, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="py-2 text-sm">{page.page}</td>
                                        <td className="text-right py-2 text-sm font-medium">{page.views}</td>
                                        <td className="text-right py-2 text-sm">{page.uniqueViews}</td>
                                        <td className="text-right py-2 text-sm">{formatDuration(Math.floor(page.avgTimeOnPage || 0))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Traffic Sources */}
            <Card>
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Traffic Sources</h2>
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.trafficSources.slice(0, 6).map((source, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium capitalize">
                                        {source.source || 'Direct'}
                                    </span>
                                    <span className="text-xs text-gray-500">{source.medium}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold">{source.visitors}</span>
                                    <span className="text-sm text-green-600">
                                        {source.conversions} conv.
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
