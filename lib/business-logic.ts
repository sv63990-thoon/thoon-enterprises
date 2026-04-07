import { EnhancedUser, EnhancedRequirement, EnhancedQuote, EnhancedOrder, Project, MarketInsight, AIInsight, NegotiationSession, SupplierProfile, CommissionRecord, Notification } from './enhanced-db';

export class ThoonBusinessLogic {
    
    // AI-Powered Trust Score Calculation (like Arqonz)
    static calculateTrustScore(user: EnhancedUser): number {
        let score = 0;
        
        // Subscription Tier (40 points max)
        if (user.subscriptionTier === 'premium') score += 40;
        else if (user.subscriptionTier === 'gold') score += 30;
        else if (user.subscriptionTier === 'verified') score += 20;
        else score += 10;
        
        // Rating (25 points max)
        score += Math.min((user.rating || 0) * 5, 25);
        
        // Experience (20 points max)
        score += Math.min((user.experienceYears || 0) * 2, 20);
        
        // Verification Status (15 points max)
        if (user.verificationStatus === 'verified') score += 15;
        else if (user.verificationStatus === 'pending') score += 5;
        
        return Math.min(score, 100);
    }
    
    // AI-Powered Price Recommendation (like Arqonz's e-negotiate)
    static getRecommendedPrice(requirement: EnhancedRequirement, marketPrices: any[]): number {
        const categoryPrices = marketPrices.filter(p => p.category === requirement.category);
        if (categoryPrices.length === 0) return 0;
        
        const avgPrice = categoryPrices.reduce((sum, p) => sum + p.price, 0) / categoryPrices.length;
        
        // Adjust for urgency
        let multiplier = 1;
        if (requirement.urgency === 'urgent') multiplier = 1.1;
        else if (requirement.urgency === 'high') multiplier = 1.05;
        
        // Adjust for quantity (bulk discount)
        if (requirement.quantity > 1000) multiplier *= 0.95;
        else if (requirement.quantity > 500) multiplier *= 0.98;
        
        return Math.round(avgPrice * multiplier);
    }
    
    // Smart Supplier Matching (AI-powered like Arqonz)
    static getRecommendedSuppliers(requirement: EnhancedRequirement, suppliers: EnhancedUser[]): string[] {
        return suppliers
            .filter(supplier => {
                // Must be verified and active
                if (supplier.status !== 'active' || supplier.verificationStatus !== 'verified') return false;
                
                // Check if supplier deals in this category
                if (!supplier.specializations?.includes(requirement.category)) return false;
                
                // Check service area
                if (!supplier.serviceAreas?.some(area => 
                    requirement.deliveryLocation.toLowerCase().includes(area.toLowerCase())
                )) return false;
                
                return true;
            })
            .sort((a, b) => {
                // Sort by trust score
                const scoreA = this.calculateTrustScore(a);
                const scoreB = this.calculateTrustScore(b);
                return scoreB - scoreA;
            })
            .slice(0, 5) // Top 5 recommendations
            .map(supplier => supplier.id);
    }
    
    // E-Negotiation AI Assistant
    static generateNegotiationStrategy(
        requirement: EnhancedRequirement, 
        quote: EnhancedQuote,
        marketPrices: any[]
    ): {
        recommendedPrice: number;
        minAcceptablePrice: number;
        negotiationPoints: string[];
        confidence: number;
    } {
        const marketPrice = this.getRecommendedPrice(requirement, marketPrices);
        const currentPrice = quote.finalPrice;
        
        // Calculate recommended price (5-10% below market)
        const recommendedPrice = Math.round(marketPrice * 0.92);
        
        // Calculate minimum acceptable price (15% below market)
        const minAcceptablePrice = Math.round(marketPrice * 0.85);
        
        // Generate negotiation points
        const negotiationPoints = [];
        
        if (currentPrice > marketPrice * 1.1) {
            negotiationPoints.push("Current price is 10% above market rate");
        }
        
        if (quote.sellerRating < 3) {
            negotiationPoints.push("Consider discount based on seller rating");
        }
        
        if (requirement.quantity > 500) {
            negotiationPoints.push("Bulk order discount applicable");
        }
        
        if (requirement.urgency === 'low') {
            negotiationPoints.push("Flexible delivery timeline allows for better pricing");
        }
        
        // Calculate confidence based on data availability
        let confidence = 70;
        if (marketPrices.length > 5) confidence += 10;
        if (quote.sellerAiScore > 80) confidence += 10;
        if (requirement.budget && requirement.budget > recommendedPrice) confidence += 10;
        
        return {
            recommendedPrice,
            minAcceptablePrice,
            negotiationPoints,
            confidence: Math.min(confidence, 100)
        };
    }
    
    // Market Intelligence Generator (like Arqonz's AQIQ)
    static generateMarketInsights(
        userId: string,
        userRole: string,
        location: string,
        requirements: EnhancedRequirement[],
        orders: EnhancedOrder[]
    ): MarketInsight[] {
        const insights: MarketInsight[] = [];
        
        // Analyze demand trends
        const categoryDemand = this.analyzeDemandTrends(requirements, location);
        categoryDemand.forEach(trend => {
            if (trend.growth > 20) {
                insights.push({
                    id: `insight-${Date.now()}-${Math.random()}`,
                    userId,
                    category: trend.category,
                    location,
                    insight: `High demand growth for ${trend.category} in your area`,
                    opportunityLevel: 'high',
                    recommendedAction: `Increase stock of ${trend.category} products`,
                    projectedDemand: trend.projectedDemand,
                    competitionLevel: trend.competition,
                    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    createdAt: new Date().toISOString()
                });
            }
        });
        
        // Price optimization opportunities
        const priceOpportunities = this.analyzePriceOpportunities(orders, requirements);
        priceOpportunities.forEach(opportunity => {
            insights.push({
                id: `insight-${Date.now()}-${Math.random()}`,
                userId,
                category: opportunity.category,
                location,
                insight: `Price optimization opportunity for ${opportunity.category}`,
                opportunityLevel: opportunity.savings > 10000 ? 'high' : 'medium',
                recommendedAction: `Negotiate better rates for ${opportunity.category}`,
                projectedDemand: opportunity.demand,
                competitionLevel: 'medium',
                validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString()
            });
        });
        
        return insights;
    }
    
    private static analyzeDemandTrends(requirements: EnhancedRequirement[], location: string) {
        const categoryCount: { [key: string]: number } = {};
        
        requirements
            .filter(req => req.deliveryLocation.toLowerCase().includes(location.toLowerCase()))
            .forEach(req => {
                categoryCount[req.category] = (categoryCount[req.category] || 0) + 1;
            });
        
        return Object.entries(categoryCount).map(([category, count]) => ({
            category,
            growth: Math.random() * 30, // Simulated growth percentage
            projectedDemand: count * 1.2,
            competition: Math.random() > 0.5 ? 'high' : 'medium'
        }));
    }
    
    private static analyzePriceOpportunities(orders: EnhancedOrder[], requirements: EnhancedRequirement[]) {
        const categoryPrices: { [key: string]: { total: number; count: number; demand: number } } = {};
        
        orders.forEach(order => {
            if (!categoryPrices[order.category]) {
                categoryPrices[order.category] = { total: 0, count: 0, demand: 0 };
            }
            categoryPrices[order.category].total += order.totalPrice;
            categoryPrices[order.category].count += 1;
        });
        
        requirements.forEach(req => {
            if (categoryPrices[req.category]) {
                categoryPrices[req.category].demand += req.quantity;
            }
        });
        
        return Object.entries(categoryPrices).map(([category, data]) => ({
            category,
            avgPrice: data.total / data.count,
            demand: data.demand,
            savings: Math.random() * 20000 // Simulated savings opportunity
        }));
    }
    
    // Commission Calculation (Arqonz-style revenue model)
    static calculateCommission(orderValue: number, sellerTier: string, buyerTier: string): {
        commissionType: 'percentage' | 'fixed';
        commissionValue: number;
        commissionAmount: number;
    } {
        // Base commission rates
        let commissionRate = 0.05; // 5% base
        
        // Adjust based on seller tier
        if (sellerTier === 'premium') commissionRate -= 0.01;
        else if (sellerTier === 'basic') commissionRate += 0.01;
        
        // Adjust based on buyer tier
        if (buyerTier === 'premium') commissionRate -= 0.005;
        
        // Minimum commission
        const minCommission = 100;
        const calculatedCommission = orderValue * commissionRate;
        
        return {
            commissionType: 'percentage',
            commissionValue: commissionRate * 100,
            commissionAmount: Math.max(calculatedCommission, minCommission)
        };
    }
    
    // Lead Scoring for Suppliers
    static scoreLead(requirement: EnhancedRequirement, supplier: EnhancedUser): number {
        let score = 0;
        
        // Location match
        if (supplier.serviceAreas?.some(area => 
            requirement.deliveryLocation.toLowerCase().includes(area.toLowerCase())
        )) score += 30;
        
        // Category specialization
        if (supplier.specializations?.includes(requirement.category)) score += 25;
        
        // Trust score
        score += this.calculateTrustScore(supplier) * 0.2;
        
        // Capacity availability
        if (supplier.subscriptionTier === 'premium') score += 15;
        else if (supplier.subscriptionTier === 'gold') score += 10;
        
        // Past performance
        if (supplier.rating && supplier.rating > 4) score += 10;
        
        return Math.min(score, 100);
    }
    
    // Automated Quote Generation
    static generateQuote(
        requirement: EnhancedRequirement,
        supplier: EnhancedUser,
        marketPrices: any[]
    ): EnhancedQuote {
        const basePrice = this.getRecommendedPrice(requirement, marketPrices);
        
        // Supplier-specific adjustments
        let priceMultiplier = 1;
        
        if (supplier.subscriptionTier === 'premium') priceMultiplier += 0.05; // Premium suppliers charge more
        if (supplier.rating > 4.5) priceMultiplier += 0.03; // High rating allows premium pricing
        if (requirement.quantity > 1000) priceMultiplier -= 0.05; // Bulk discount
        
        const discountedPrice = Math.round(basePrice * priceMultiplier);
        const gstAmount = Math.round(discountedPrice * 0.18); // 18% GST
        const deliveryCharges = requirement.deliveryLocation.includes('Chennai') ? 500 : 1000;
        
        const commission = this.calculateCommission(discountedPrice, supplier.subscriptionTier, requirement.buyerId ? 'basic' : 'basic');
        
        return {
            id: `quote-${Date.now()}`,
            reqId: requirement.id,
            sellerId: supplier.id,
            sellerName: supplier.name,
            sellerRating: supplier.rating || 0,
            sellerVerificationStatus: supplier.verificationStatus,
            sellerAiScore: this.calculateTrustScore(supplier),
            
            basePrice: discountedPrice,
            discountPercent: Math.round((1 - priceMultiplier) * 100),
            discountedPrice,
            gstAmount,
            deliveryCharges,
            thoonMargin: commission.commissionAmount,
            finalPrice: discountedPrice + gstAmount + deliveryCharges + commission.commissionAmount,
            
            negotiationEnabled: supplier.subscriptionTier !== 'basic',
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            
            qualityGuarantee: supplier.verificationStatus === 'verified',
            deliveryTimeline: requirement.urgency === 'urgent' ? '2-3 days' : '5-7 days',
            paymentTerms: '50% advance, 50% on delivery',
            
            status: 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    
    // Notification System
    static generateNotification(
        userId: string,
        type: 'quote_received' | 'order_status' | 'payment_due' | 'ai_insight' | 'market_alert' | 'verification_update',
        title: string,
        message: string,
        data?: any,
        priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
    ): Notification {
        return {
            id: `notif-${Date.now()}-${Math.random()}`,
            userId,
            type,
            title,
            message,
            data,
            read: false,
            priority,
            createdAt: new Date().toISOString()
        };
    }
    
    // Project Tracking (Arqonz-style)
    static trackProjectProgress(project: Project, orders: EnhancedOrder[]): {
        completionPercentage: number;
        onTimeDelivery: boolean;
        budgetUtilization: number;
        issues: string[];
    } {
        const totalRequirements = project.requirements.length;
        const completedRequirements = orders.filter(order => 
            project.requirements.includes(order.reqId) && order.status === 'delivered'
        ).length;
        
        const completionPercentage = totalRequirements > 0 ? (completedRequirements / totalRequirements) * 100 : 0;
        
        const totalSpent = orders
            .filter(order => project.requirements.includes(order.reqId))
            .reduce((sum, order) => sum + order.totalPrice, 0);
        
        const budgetUtilization = project.budget > 0 ? (totalSpent / project.budget) * 100 : 0;
        
        const delayedOrders = orders.filter(order => 
            project.requirements.includes(order.reqId) && 
            new Date(order.deliveryDate) < new Date() && 
            order.status !== 'delivered'
        );
        
        const issues = [];
        if (delayedOrders.length > 0) {
            issues.push(`${delayedOrders.length} orders are delayed`);
        }
        if (budgetUtilization > 100) {
            issues.push('Project over budget');
        }
        
        return {
            completionPercentage,
            onTimeDelivery: delayedOrders.length === 0,
            budgetUtilization,
            issues
        };
    }
}

export default ThoonBusinessLogic;
