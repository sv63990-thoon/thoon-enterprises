'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface AnalyticsTrackerProps {
    userId?: string;
}

export default function AnalyticsTracker({ userId }: AnalyticsTrackerProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [sessionId, setSessionId] = useState<string>('');
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        // Initialize session on first load
        initializeSession();
        
        // Track page views
        trackPageView();
        
        // Setup activity tracking
        setupActivityTracking();
        
        // Cleanup on unmount
        return () => {
            if (isTracking) {
                trackSessionEnd();
            }
        };
    }, [pathname, searchParams]);

    const initializeSession = async () => {
        try {
            // Get or generate session ID
            let storedSessionId = sessionStorage.getItem('analytics_session_id');
            if (!storedSessionId) {
                storedSessionId = generateSessionId();
                sessionStorage.setItem('analytics_session_id', storedSessionId);
            }
            
            setSessionId(storedSessionId);
            setIsTracking(true);

            // Get client info
            const clientInfo = getClientInfo();
            
            // Track session
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'session',
                    data: {
                        sessionId: storedSessionId,
                        userId,
                        ipAddress: await getClientIP(),
                        userAgent: navigator.userAgent,
                        referrer: document.referrer,
                        utmSource: searchParams.get('utm_source'),
                        utmMedium: searchParams.get('utm_medium'),
                        utmCampaign: searchParams.get('utm_campaign'),
                        landingPage: window.location.href
                    }
                })
            });
        } catch (error) {
            console.error('Failed to initialize session:', error);
        }
    };

    const trackPageView = async () => {
        if (!sessionId) return;

        try {
            const startTime = performance.now();
            
            // Track page view
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'pageview',
                    data: {
                        sessionId,
                        userId,
                        page: pathname,
                        title: document.title,
                        referrer: document.referrer,
                        loadTime: 0 // Will be updated when page loads
                    }
                })
            });

            // Update load time after page loads
            setTimeout(() => {
                const loadTime = Math.round(performance.now() - startTime);
                updatePageViewMetrics(loadTime);
            }, 100);
        } catch (error) {
            console.error('Failed to track page view:', error);
        }
    };

    const updatePageViewMetrics = async (loadTime: number) => {
        if (!sessionId) return;

        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'pageview',
                    data: {
                        sessionId,
                        userId,
                        page: pathname,
                        title: document.title,
                        loadTime
                    }
                })
            });
        } catch (error) {
            console.error('Failed to update page view metrics:', error);
        }
    };

    const setupActivityTracking = () => {
        // Track clicks
        document.addEventListener('click', handleActivityClick);
        
        // Track form submissions
        document.addEventListener('submit', handleFormSubmit);
        
        // Track scroll depth
        let maxScrollDepth = 0;
        const handleScroll = () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Track time on page
        const startTime = Date.now();
        
        // Send periodic updates
        const interval = setInterval(() => {
            if (!isTracking) {
                clearInterval(interval);
                return;
            }
            
            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            
            fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'activity',
                    data: {
                        sessionId,
                        userId,
                        activityType: 'page_view',
                        details: `Time on page: ${timeOnPage}s, Scroll depth: ${maxScrollDepth}%`,
                        metadata: { timeOnPage, scrollDepth: maxScrollDepth },
                        ipAddress: 'client',
                        userAgent: navigator.userAgent
                    }
                })
            });
        }, 30000); // Every 30 seconds
    };

    const handleActivityClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const elementInfo = getElementInfo(target);
        
        trackActivity('click', `Clicked on ${elementInfo}`, {
            elementType: target.tagName.toLowerCase(),
            elementId: target.id,
            elementClass: target.className,
            elementText: target.textContent?.slice(0, 100)
        });
    };

    const handleFormSubmit = (event: Event) => {
        const form = event.target as HTMLFormElement;
        const formId = form.id || 'unknown-form';
        
        trackActivity('form_submit', `Form submitted: ${formId}`, {
            formId,
            formAction: form.action,
            formMethod: form.method
        });
    };

    const trackActivity = async (activityType: string, details: string, metadata?: any) => {
        if (!sessionId) return;

        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'activity',
                    data: {
                        sessionId,
                        userId,
                        activityType,
                        details,
                        metadata,
                        ipAddress: 'client',
                        userAgent: navigator.userAgent
                    }
                })
            });
        } catch (error) {
            console.error('Failed to track activity:', error);
        }
    };

    const trackSessionEnd = async () => {
        if (!sessionId) return;

        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'activity',
                    data: {
                        sessionId,
                        userId,
                        activityType: 'page_view',
                        details: 'Session ended',
                        metadata: { sessionEnd: true },
                        ipAddress: 'client',
                        userAgent: navigator.userAgent
                    }
                })
            });
        } catch (error) {
            console.error('Failed to track session end:', error);
        }
    };

    // Helper functions
    const generateSessionId = () => {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    };

    const getClientInfo = () => {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString()
        };
    };

    const getClientIP = async (): Promise<string> => {
        try {
            // In production, you might want to use a more reliable IP detection service
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    };

    const getElementInfo = (element: HTMLElement): string => {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ').join('.')}`;
        if (element.textContent) return element.textContent.slice(0, 50);
        return element.tagName.toLowerCase();
    };

    // Public methods for manual tracking
    useEffect(() => {
        // Make tracking functions available globally for manual tracking
        (window as any).analytics = {
            track: (activityType: string, details: string, metadata?: any) => {
                trackActivity(activityType, details, metadata);
            },
            trackConversion: (type: 'registration' | 'quote_request' | 'order' | 'enquiry', details?: string) => {
                trackActivity(type, details || `Conversion: ${type}`, { conversion: true });
            }
        };
    }, []);

    // This component doesn't render anything visible
    return null;
}

// Types for global analytics object
declare global {
    interface Window {
        analytics?: {
            track: (activityType: string, details: string, metadata?: any) => void;
            trackConversion: (type: 'registration' | 'quote_request' | 'order' | 'enquiry', details?: string) => void;
        };
    }
}
