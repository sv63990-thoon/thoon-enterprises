import { EnhancedRequirement, EnhancedQuote, EnhancedUser, MarketPrice, NegotiationSession, NegotiationRound } from './enhanced-db';
import { ThoonBusinessLogic } from './business-logic';

export class AIPricingEngine {
    
    // Real-time Market Price Analysis
    static analyzeMarketPrices(category: string, location: string, marketPrices: MarketPrice[]): {
        currentPrice: number;
        priceRange: { min: number; max: number };
        trend: 'increasing' | 'decreasing' | 'stable';
        confidence: number;
        factors: string[];
        regionalPrices: { region: string; price: number; demand: 'low' | 'medium' | 'high' }[];
    } {
        const categoryPrices = marketPrices.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
        );
        
        if (categoryPrices.length === 0) {
            return {
                currentPrice: 0,
                priceRange: { min: 0, max: 0 },
                trend: 'stable',
                confidence: 0,
                factors: ['No market data available'],
                regionalPrices: []
            };
        }
        
        const prices = categoryPrices.map(p => p.price);
        const currentPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Calculate trend
        const recentPrices = categoryPrices
            .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
            .slice(0, 5);
        
        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (recentPrices.length >= 3) {
            const avgRecent = recentPrices.slice(0, 3).reduce((sum, p) => sum + p.price, 0) / 3;
            const avgOld = recentPrices.slice(-3).reduce((sum, p) => sum + p.price, 0) / 3;
            
            if (avgRecent > avgOld * 1.05) trend = 'increasing';
            else if (avgRecent < avgOld * 0.95) trend = 'decreasing';
        }
        
        // Identify influencing factors
        const factors = [];
        const priceVolatility = ((maxPrice - minPrice) / currentPrice) * 100;
        
        if (priceVolatility > 20) factors.push('High price volatility in market');
        if (categoryPrices.length < 5) factors.push('Limited market data');
        if (trend === 'increasing') factors.push('Upward price trend');
        if (trend === 'decreasing') factors.push('Downward price trend');
        
        // Regional price analysis
        const regionalPrices = [
            { region: 'Chennai', price: currentPrice * 1.0, demand: 'high' as const },
            { region: 'Bangalore', price: currentPrice * 1.1, demand: 'medium' as const },
            { region: 'Delhi', price: currentPrice * 1.15, demand: 'high' as const },
            { region: 'Mumbai', price: currentPrice * 1.2, demand: 'high' as const },
        ];
        
        return {
            currentPrice: Math.round(currentPrice),
            priceRange: { min: minPrice, max: maxPrice },
            trend,
            confidence: Math.min(categoryPrices.length * 15, 90),
            factors,
            regionalPrices
        };
    }
    
    // AI-Powered Dynamic Pricing
    static generateDynamicPrice(
        requirement: EnhancedRequirement,
        supplier: EnhancedUser,
        marketAnalysis: any,
        historicalData: any[]
    ): {
        basePrice: number;
        dynamicPrice: number;
        priceAdjustments: { factor: string; adjustment: number; reason: string }[];
        confidence: number;
    } {
        let basePrice = marketAnalysis.currentPrice;
        const adjustments = [];
        
        // Urgency adjustment
        if (requirement.urgency === 'urgent') {
            const adjustment = basePrice * 0.15;
            basePrice += adjustment;
            adjustments.push({ factor: 'Urgency', adjustment, reason: 'Urgent delivery requires premium pricing' });
        } else if (requirement.urgency === 'high') {
            const adjustment = basePrice * 0.08;
            basePrice += adjustment;
            adjustments.push({ factor: 'Urgency', adjustment, reason: 'High priority order' });
        }
        
        // Volume adjustment
        if (requirement.quantity > 1000) {
            const adjustment = -basePrice * 0.12;
            basePrice += adjustment;
            adjustments.push({ factor: 'Volume', adjustment, reason: 'Bulk order discount applied' });
        } else if (requirement.quantity > 500) {
            const adjustment = -basePrice * 0.06;
            basePrice += adjustment;
            adjustments.push({ factor: 'Volume', adjustment, reason: 'Medium volume discount' });
        }
        
        // Supplier reputation adjustment
        const supplierScore = ThoonBusinessLogic.calculateTrustScore(supplier);
        if (supplierScore > 85) {
            const adjustment = basePrice * 0.08;
            basePrice += adjustment;
            adjustments.push({ factor: 'Reputation', adjustment, reason: 'Premium supplier quality assurance' });
        }
        
        // Location-based adjustment
        const locationMultiplier = this.getLocationMultiplier(requirement.deliveryLocation);
        if (locationMultiplier !== 1) {
            const adjustment = basePrice * (locationMultiplier - 1);
            basePrice += adjustment;
            adjustments.push({ 
                factor: 'Location', 
                adjustment, 
                reason: `Location-based pricing for ${requirement.deliveryLocation}` 
            });
        }
        
        // Seasonal adjustment
        const seasonalFactor = this.getSeasonalFactor(requirement.category);
        if (seasonalFactor !== 1) {
            const adjustment = basePrice * (seasonalFactor - 1);
            basePrice += adjustment;
            adjustments.push({ 
                factor: 'Seasonal', 
                adjustment, 
                reason: 'Seasonal demand adjustment' 
            });
        }
        
        // Market trend adjustment
        if (marketAnalysis.trend === 'increasing') {
            const adjustment = basePrice * 0.05;
            basePrice += adjustment;
            adjustments.push({ factor: 'Market Trend', adjustment, reason: 'Market prices are rising' });
        }
        
        return {
            basePrice: Math.round(basePrice),
            dynamicPrice: Math.round(basePrice),
            priceAdjustments: adjustments,
            confidence: Math.min(marketAnalysis.confidence + (supplierScore > 80 ? 10 : 0), 95)
        };
    }
    
    // Intelligent Negotiation Engine
    static startNegotiationSession(
        requirement: EnhancedRequirement,
        initialQuote: EnhancedQuote,
        buyerMaxPrice?: number,
        sellerMinPrice?: number
    ): NegotiationSession {
        const marketAnalysis = this.analyzeMarketPrices(requirement.category, requirement.deliveryLocation, []);
        
        // AI's recommended fair price
        const fairPrice = marketAnalysis.currentPrice;
        
        // Determine negotiation ranges
        const buyerRange = {
            min: fairPrice * 0.85,
            max: buyerMaxPrice || fairPrice * 1.1
        };
        
        const sellerRange = {
            min: sellerMinPrice || fairPrice * 0.9,
            max: initialQuote.finalPrice * 1.05
        };
        
        // Find overlapping range
        const negotiationMin = Math.max(buyerRange.min, sellerRange.min);
        const negotiationMax = Math.min(buyerRange.max, sellerRange.max);
        
        return {
            id: `neg-${Date.now()}`,
            requirementId: requirement.id,
            buyerId: requirement.buyerId,
            sellerId: initialQuote.sellerId,
            initialPrice: initialQuote.finalPrice,
            currentPrice: initialQuote.finalPrice,
            minPrice: negotiationMin <= negotiationMax ? negotiationMin : undefined,
            maxPrice: negotiationMax,
            status: 'active',
            rounds: [],
            aiAssistance: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    // AI Negotiation Response
    static generateNegotiationResponse(
        session: NegotiationSession,
        offerPrice: number,
        offerBy: 'buyer' | 'seller',
        marketAnalysis: any
    ): {
        counterPrice: number;
        shouldAccept: boolean;
        message: string;
        reasoning: string[];
        confidence: number;
    } {
        const fairPrice = marketAnalysis.currentPrice;
        const priceDifference = Math.abs(offerPrice - fairPrice) / fairPrice;
        
        let shouldAccept = false;
        let counterPrice = offerPrice;
        const reasoning = [];
        let message = '';
        
        if (offerBy === 'buyer') {
            // Buyer made an offer
            if (offerPrice >= fairPrice * 0.95) {
                shouldAccept = true;
                message = "This is a fair offer. I recommend accepting it.";
                reasoning.push("Offer is within 5% of market price");
            } else if (offerPrice >= fairPrice * 0.85) {
                counterPrice = Math.round(fairPrice * 0.92);
                message = "Good offer, but we can negotiate slightly better.";
                reasoning.push("Offer is reasonable but room for improvement");
                reasoning.push(`Counter-offer at ${((fairPrice * 0.92 - offerPrice) / offerPrice * 100).toFixed(1)}% increase`);
            } else {
                counterPrice = Math.round(fairPrice * 0.88);
                message = "This offer is too low. Let me propose a reasonable counter.";
                reasoning.push("Offer is significantly below market rate");
                reasoning.push(`Current market price: ₹${fairPrice}`);
            }
        } else {
            // Seller made an offer
            if (offerPrice <= fairPrice * 1.05) {
                shouldAccept = true;
                message = "This is a competitive price. I recommend accepting it.";
                reasoning.push("Offer is within 5% of market price");
            } else if (offerPrice <= fairPrice * 1.15) {
                counterPrice = Math.round(fairPrice * 1.08);
                message = "Price is a bit high. Let's negotiate.";
                reasoning.push("Price is slightly above market rate");
                reasoning.push(`Counter-offer at ${((offerPrice - fairPrice * 1.08) / offerPrice * 100).toFixed(1)}% discount`);
            } else {
                counterPrice = Math.round(fairPrice * 1.12);
                message = "This price seems too high. Here's a more reasonable offer.";
                reasoning.push("Price is significantly above market rate");
                reasoning.push(`Current market price: ₹${fairPrice}`);
            }
        }
        
        const confidence = Math.max(90 - (priceDifference * 100), 60);
        
        return {
            counterPrice,
            shouldAccept,
            message,
            reasoning,
            confidence: Math.round(confidence)
        };
    }
    
    // Predictive Price Forecasting
    static forecastPrices(
        category: string,
        location: string,
        historicalPrices: MarketPrice[],
        daysAhead: number = 30
    ): {
        forecast: { date: string; price: number; confidence: number }[];
        trend: 'increasing' | 'decreasing' | 'stable';
        factors: string[];
    } {
        if (historicalPrices.length < 5) {
            return {
                forecast: [],
                trend: 'stable',
                factors: ['Insufficient historical data']
            };
        }
        
        // Simple linear regression for forecasting
        const prices = historicalPrices
            .sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime())
            .map(p => p.price);
        
        const n = prices.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = prices;
        
        // Calculate regression line
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        // Generate forecast
        const forecast = [];
        const currentPrice = prices[prices.length - 1];
        
        for (let i = 1; i <= daysAhead; i += 5) { // Every 5 days
            const predictedPrice = intercept + slope * (n + i);
            const confidence = Math.max(90 - (i * 2), 50); // Confidence decreases over time
            
            forecast.push({
                date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                price: Math.round(Math.max(predictedPrice, currentPrice * 0.8)), // Don't go below 80% of current
                confidence
            });
        }
        
        const trend = slope > 0.5 ? 'increasing' : slope < -0.5 ? 'decreasing' : 'stable';
        
        const factors = [];
        if (Math.abs(slope) > 2) factors.push('Strong price momentum detected');
        if (historicalPrices.length < 10) factors.push('Limited historical data');
        if (Math.abs(slope) < 0.5) factors.push('Stable market conditions');
        
        return { forecast, trend, factors };
    }
    
    // Competitive Intelligence
    static analyzeCompetition(
        category: string,
        location: string,
        supplierQuotes: EnhancedQuote[],
        marketPrices: MarketPrice[]
    ): {
        competitorCount: number;
        averagePrice: number;
        priceRange: { min: number; max: number };
        topCompetitors: { supplierId: string; supplierName: string; price: number; rating: number; marketShare: number }[];
        marketPosition: 'leader' | 'competitive' | 'premium' | 'budget';
        recommendations: string[];
    } {
        const relevantQuotes = supplierQuotes.filter(quote => 
            // This would need to be filtered by category and location in real implementation
            true
        );
        
        if (relevantQuotes.length === 0) {
            return {
                competitorCount: 0,
                averagePrice: 0,
                priceRange: { min: 0, max: 0 },
                topCompetitors: [],
                marketPosition: 'competitive',
                recommendations: ['No competitor data available']
            };
        }
        
        const prices = relevantQuotes.map(q => q.finalPrice);
        const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Analyze top competitors
        const competitorAnalysis = relevantQuotes.map(quote => ({
            supplierId: quote.sellerId,
            supplierName: quote.sellerName,
            price: quote.finalPrice,
            rating: quote.sellerRating,
            marketShare: 0 // Would be calculated from actual sales data
        }));
        
        // Sort by price and rating
        const topCompetitors = competitorAnalysis
            .sort((a, b) => {
                const scoreA = a.price / averagePrice * (5 - a.rating);
                const scoreB = b.price / averagePrice * (5 - b.rating);
                return scoreA - scoreB;
            })
            .slice(0, 5);
        
        // Determine market position
        const marketPrice = marketPrices.find(p => p.category === category)?.price || averagePrice;
        let marketPosition: 'leader' | 'competitive' | 'premium' | 'budget' = 'competitive';
        
        if (averagePrice < marketPrice * 0.95) marketPosition = 'leader';
        else if (averagePrice > marketPrice * 1.1) marketPosition = 'premium';
        else if (averagePrice < marketPrice * 0.85) marketPosition = 'budget';
        
        // Generate recommendations
        const recommendations = [];
        if (marketPosition === 'premium') {
            recommendations.push('Consider reducing prices to increase market share');
            recommendations.push('Emphasize quality and service to justify premium pricing');
        } else if (marketPosition === 'budget') {
            recommendations.push('Opportunity to increase prices slightly');
            recommendations.push('Focus on volume to maintain profitability');
        } else if (marketPosition === 'leader') {
            recommendations.push('Maintain competitive advantage');
            recommendations.push('Consider value-added services');
        }
        
        if (relevantQuotes.length < 3) {
            recommendations.push('Low competition - opportunity for higher margins');
        }
        
        return {
            competitorCount: relevantQuotes.length,
            averagePrice: Math.round(averagePrice),
            priceRange: { min: minPrice, max: maxPrice },
            topCompetitors,
            marketPosition,
            recommendations
        };
    }
    
    // Helper methods
    private static getLocationMultiplier(location: string): number {
        const locationMultipliers: { [key: string]: number } = {
            'chennai': 1.0,
            'bangalore': 1.1,
            'delhi': 1.15,
            'mumbai': 1.2,
            'hyderabad': 1.05,
            'pune': 1.08,
            'kolkata': 1.12
        };
        
        const normalizedLocation = location.toLowerCase();
        for (const [city, multiplier] of Object.entries(locationMultipliers)) {
            if (normalizedLocation.includes(city)) {
                return multiplier;
            }
        }
        
        return 1.0; // Default multiplier
    }
    
    private static getSeasonalFactor(category: string): number {
        const seasonalFactors: { [key: string]: number } = {
            'cement': 1.02, // Slight increase during construction season
            'steel': 1.05,  // Higher demand in certain months
            'bricks': 1.03,
            'sand': 1.04,
            'aac blocks': 1.02
        };
        
        return seasonalFactors[category.toLowerCase()] || 1.0;
    }
}

export default AIPricingEngine;
