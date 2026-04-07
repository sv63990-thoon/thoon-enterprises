import { NextResponse } from 'next/server';
import { AIPricingEngine } from '@/lib/ai-pricing-engine';
import { ThoonBusinessLogic } from '@/lib/business-logic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const category = searchParams.get('category');
        const location = searchParams.get('location');
        const userId = searchParams.get('userId');
        
        switch (type) {
            case 'market-analysis':
                return await getMarketAnalysis(category, location);
            case 'price-forecast':
                return await getPriceForecast(category, location);
            case 'competition':
                return await getCompetitionAnalysis(category, location);
            case 'insights':
                return await getPersonalizedInsights(userId, location);
            case 'recommendations':
                return await getRecommendations(userId, category, location);
            default:
                return NextResponse.json(
                    { error: 'Invalid intelligence type' },
                    { status: 400 }
                );
        }
        
    } catch (error: any) {
        console.error('Intelligence API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch intelligence data' },
            { status: 500 }
        );
    }
}

async function getMarketAnalysis(category: string, location: string) {
    // Mock market prices - in production, fetch from database
    const marketPrices = [
        {
            category: 'Cement',
            brand: 'Ramco',
            price: 420,
            unit: 'bag',
            change: 5,
            lastUpdated: new Date().toISOString()
        },
        {
            category: 'Cement',
            brand: 'ACC',
            price: 450,
            unit: 'bag',
            change: 3,
            lastUpdated: new Date().toISOString()
        },
        {
            category: 'Cement',
            brand: 'Ultratech',
            price: 460,
            unit: 'bag',
            change: -2,
            lastUpdated: new Date().toISOString()
        }
    ];
    
    const analysis = AIPricingEngine.analyzeMarketPrices(category, location, marketPrices);
    
    // Add demand analysis
    const demandAnalysis = {
        currentDemand: 'high',
        projectedDemand: 'increasing',
        seasonalFactor: 1.1,
        influencingFactors: [
            'Construction season peak',
            'Government infrastructure projects',
            'Monsoon season approaching'
        ]
    };
    
    // Add supply analysis
    const supplyAnalysis = {
        availability: 'adequate',
        leadTime: '3-5 days',
        supplyConstraints: [
            'Transportation delays in some regions',
            'Raw material cost fluctuations'
        ]
    };
    
    return NextResponse.json({
        success: true,
        marketAnalysis: {
            ...analysis,
            demandAnalysis,
            supplyAnalysis,
            recommendations: generateMarketRecommendations(analysis, demandAnalysis)
        }
    });
}

async function getPriceForecast(category: string, location: string) {
    // Mock historical prices
    const historicalPrices = [
        { category, price: 400, lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
        { category, price: 410, lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
        { category, price: 415, lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { category, price: 420, lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { category, price: 425, lastUpdated: new Date().toISOString() }
    ];
    
    const forecast = AIPricingEngine.forecastPrices(category, location, historicalPrices, 30);
    
    // Add buying recommendations
    const recommendations = forecast.trend === 'increasing' ? 
        ['Buy now to avoid higher prices', 'Consider bulk purchasing'] :
        forecast.trend === 'decreasing' ? 
        ['Wait for better prices', 'Monitor market for 1-2 weeks'] :
        ['Current prices are stable', 'Buy as needed'];
    
    return NextResponse.json({
        success: true,
        forecast: {
            ...forecast,
            recommendations,
            bestTimeToBuy: forecast.trend === 'decreasing' ? '2-3 weeks' : 'Now',
            priceVolatility: Math.abs(forecast.forecast[forecast.forecast.length - 1].price - forecast.forecast[0].price) / forecast.forecast[0].price * 100
        }
    });
}

async function getCompetitionAnalysis(category: string, location: string) {
    // Mock competitor quotes
    const supplierQuotes = [
        {
            sellerId: 'supplier-1',
            sellerName: 'Ramco Traders',
            finalPrice: 420,
            sellerRating: 4.5
        },
        {
            sellerId: 'supplier-2',
            sellerName: 'ACC Distributors',
            finalPrice: 450,
            sellerRating: 4.2
        },
        {
            sellerId: 'supplier-3',
            sellerName: 'Ultratech Dealers',
            finalPrice: 460,
            sellerRating: 4.8
        }
    ];
    
    const marketPrices = [
        { category, price: 435, lastUpdated: new Date().toISOString() }
    ];
    
    const competition = AIPricingEngine.analyzeCompetition(category, location, supplierQuotes, marketPrices);
    
    // Add market share analysis
    const marketShare = {
        leader: 'Ramco Traders',
        yourPosition: 2,
        totalMarketSize: 1000000, // Monthly market size in rupees
        growthRate: 12 // Annual growth rate
    };
    
    return NextResponse.json({
        success: true,
        competition: {
            ...competition,
            marketShare,
            strategicInsights: generateStrategicInsights(competition)
        }
    });
}

async function getPersonalizedInsights(userId: string, location: string) {
    // Mock user data
    const user = {
        id: userId,
        role: 'buyer',
        subscriptionTier: 'verified',
        pastOrders: 15,
        totalSpent: 500000,
        preferredCategories: ['Cement', 'Steel']
    };
    
    // Generate personalized insights
    const insights = [
        {
            type: 'cost_saving',
            title: 'Potential Savings Opportunity',
            description: 'You could save 8% on cement by negotiating with verified suppliers',
            potentialSavings: 40000,
            confidence: 85,
            action: 'Start negotiation for next cement order'
        },
        {
            type: 'market_trend',
            title: 'Price Drop Expected',
            description: 'Cement prices likely to decrease by 5% in the next 2 weeks',
            confidence: 75,
            action: 'Delay bulk purchases if possible'
        },
        {
            type: 'supplier',
            title: 'New Verified Supplier',
            description: 'A new supplier with excellent ratings joined your area',
            confidence: 90,
            action: 'Check out their quotes for better pricing'
        }
    ];
    
    return NextResponse.json({
        success: true,
        insights,
        summary: {
            totalPotentialSavings: insights.reduce((sum, insight) => sum + (insight.potentialSavings || 0), 0),
            highConfidenceInsights: insights.filter(i => i.confidence > 80).length,
            recommendedActions: insights.map(i => i.action)
        }
    });
}

async function getRecommendations(userId: string, category: string, location: string) {
    // Mock user preferences and history
    const userProfile = {
        subscriptionTier: 'verified',
        budgetRange: { min: 20000, max: 100000 },
        preferredDeliveryTime: '5-7 days',
        qualityPreference: 'high',
        pastSuppliers: ['supplier-1', 'supplier-2']
    };
    
    // Generate supplier recommendations
    const supplierRecommendations = [
        {
            supplierId: 'supplier-3',
            supplierName: 'Premium Cement Co.',
            rating: 4.8,
            verificationStatus: 'verified',
            trustScore: 92,
            priceCompetitiveness: 'excellent',
            deliveryReliability: 'high',
            matchScore: 95,
            reasons: ['Best rated in your area', 'Competitive pricing', 'Verified quality']
        },
        {
            supplierId: 'supplier-4',
            supplierName: 'FastBuild Materials',
            rating: 4.5,
            verificationStatus: 'verified',
            trustScore: 88,
            priceCompetitiveness: 'good',
            deliveryReliability: 'excellent',
            matchScore: 87,
            reasons: ['Fastest delivery', 'Good quality', 'Reliable service']
        }
    ];
    
    // Generate pricing recommendations
    const pricingRecommendations = {
        optimalPrice: 415,
        priceRange: { min: 400, max: 435 },
        bestTimeToBuy: 'This week',
        negotiationPotential: 'High (up to 10% discount possible)',
        bulkDiscountThreshold: 1000,
        expectedSavings: 25000
    };
    
    return NextResponse.json({
        success: true,
        recommendations: {
            suppliers: supplierRecommendations,
            pricing: pricingRecommendations,
            strategy: generateBuyingStrategy(userProfile, pricingRecommendations)
        }
    });
}

function generateMarketRecommendations(analysis: any, demandAnalysis: any): string[] {
    const recommendations = [];
    
    if (analysis.trend === 'increasing' && demandAnalysis.currentDemand === 'high') {
        recommendations.push('Consider bulk purchasing now to lock in current prices');
        recommendations.push('Stock up for next 2-3 months if storage allows');
    }
    
    if (analysis.confidence < 70) {
        recommendations.push('Monitor market closely for price stabilization');
        recommendations.push('Consider multiple suppliers to hedge against volatility');
    }
    
    if (demandAnalysis.projectedDemand === 'increasing') {
        recommendations.push('Secure supply agreements with reliable suppliers');
        recommendations.push('Explore long-term contracts for price stability');
    }
    
    return recommendations;
}

function generateStrategicInsights(competition: any): string[] {
    const insights = [];
    
    if (competition.marketPosition === 'leader') {
        insights.push('You\'re in a strong position - maintain competitive pricing');
        insights.push('Focus on value-added services to strengthen market leadership');
    } else if (competition.marketPosition === 'premium') {
        insights.push('Justify premium pricing with superior quality and service');
        insights.push('Target high-value customers who prioritize quality over price');
    } else if (competition.marketPosition === 'budget') {
        insights.push('Opportunity to increase prices while remaining competitive');
        insights.push('Focus on volume growth to improve profitability');
    } else {
        insights.push('Competitive pricing is crucial for market share growth');
        insights.push('Consider differentiating through service or quality');
    }
    
    if (competition.competitorCount < 3) {
        insights.push('Low competition presents growth opportunity');
        insights.push('Consider aggressive marketing to capture market share');
    }
    
    return insights;
}

function generateBuyingStrategy(userProfile: any, pricing: any): any {
    return {
        approach: userProfile.qualityPreference === 'high' ? 'quality_focused' : 'price_focused',
        timing: pricing.bestTimeToBuy === 'This week' ? 'immediate' : 'wait',
        negotiation: pricing.negotiationPotential === 'High' ? 'aggressive' : 'moderate',
        orderSize: userProfile.budgetRange.max > 50000 ? 'bulk' : 'regular',
        supplierDiversification: userProfile.pastSuppliers.length < 2 ? 'recommended' : 'optional',
        riskMitigation: [
            'Get quotes from at least 3 suppliers',
            'Verify supplier credentials before ordering',
            'Consider partial advance payments for large orders'
        ]
    };
}
