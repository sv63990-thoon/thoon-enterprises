import { NextResponse } from 'next/server';
import { sqliteDb } from '@/lib/sqlite-db';
import { ThoonBusinessLogic } from '@/lib/business-logic';
import { AIPricingEngine } from '@/lib/ai-pricing-engine';

export async function POST(request: Request) {
    try {
        const { requirementId, sellerId } = await request.json();
        
        if (!requirementId || !sellerId) {
            return NextResponse.json(
                { error: 'Requirement ID and Seller ID are required' },
                { status: 400 }
            );
        }
        
        // Get requirement details
        const requirements = sqliteDb.getRequirements();
        const requirement = requirements.find(req => req.id === requirementId);
        
        if (!requirement) {
            return NextResponse.json(
                { error: 'Requirement not found' },
                { status: 404 }
            );
        }
        
        // Get seller details
        const seller = sqliteDb.findUserByEmail('') || { 
            id: sellerId, 
            name: 'Supplier', 
            rating: 4, 
            subscriptionTier: 'verified',
            verificationStatus: 'verified',
            specializations: [requirement.category],
            serviceAreas: [requirement.deliveryLocation]
        } as any;
        
        // Get market prices for AI analysis
        const marketPrices = sqliteDb.getMarketPrices();
        
        // Generate AI-powered quote
        const marketAnalysis = AIPricingEngine.analyzeMarketPrices(
            requirement.category,
            requirement.deliveryLocation,
            marketPrices
        );
        
        const dynamicPricing = AIPricingEngine.generateDynamicPrice(
            requirement as any,
            seller,
            marketAnalysis,
            []
        );
        
        // Create enhanced quote with AI insights
        const quote = {
            id: `quote-${Date.now()}`,
            reqId: requirementId,
            sellerId,
            sellerName: seller.name,
            sellerRating: seller.rating || 0,
            sellerVerificationStatus: seller.verificationStatus || 'pending',
            sellerAiScore: ThoonBusinessLogic.calculateTrustScore(seller),
            
            // AI-powered pricing
            basePrice: dynamicPricing.basePrice,
            marketPrice: marketAnalysis.currentPrice,
            dynamicPrice: dynamicPricing.dynamicPrice,
            discountPercent: Math.round((1 - dynamicPricing.dynamicPrice / marketAnalysis.currentPrice) * 100),
            
            // Price breakdown
            gstAmount: Math.round(dynamicPricing.dynamicPrice * 0.18),
            deliveryCharges: requirement.deliveryLocation.includes('Chennai') ? 500 : 1000,
            
            // Commission calculation
            commission: ThoonBusinessLogic.calculateCommission(
                dynamicPricing.dynamicPrice,
                seller.subscriptionTier || 'basic',
                'basic'
            ),
            
            // Final pricing
            finalPrice: 0, // Will be calculated below
            
            // AI insights
            priceAdjustments: dynamicPricing.priceAdjustments,
            aiConfidence: dynamicPricing.confidence,
            marketAnalysis: {
                trend: marketAnalysis.trend,
                priceRange: marketAnalysis.priceRange,
                confidence: marketAnalysis.confidence
            },
            
            // Negotiation features
            negotiationEnabled: seller.subscriptionTier !== 'basic',
            minPrice: dynamicPricing.dynamicPrice * 0.85,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            
            // Quality and trust features
            qualityGuarantee: seller.verificationStatus === 'verified',
            deliveryTimeline: requirement.urgency === 'urgent' ? '2-3 days' : '5-7 days',
            paymentTerms: '50% advance, 50% on delivery',
            
            status: 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Calculate final price
        quote.finalPrice = quote.dynamicPrice + quote.gstAmount + quote.deliveryCharges + quote.commission.commissionAmount;
        
        // Save quote to database
        const savedQuote = sqliteDb.submitQuote({
            reqId: requirementId,
            sellerId,
            sellerName: seller.name,
            sellerPrice: quote.dynamicPrice,
            thoonMargin: quote.commission.commissionAmount,
            finalPrice: quote.finalPrice,
            status: 'submitted'
        });
        
        // Generate AI insights for buyer
        const aiInsights = {
            priceCompetitiveness: quote.discountPercent > 0 ? 'Good' : 'Market Rate',
            trustScore: quote.sellerAiScore,
            deliveryReliability: seller.verificationStatus === 'verified' ? 'High' : 'Medium',
            recommendedAction: quote.discountPercent > 5 ? 'Accept this quote' : 'Consider negotiation'
        };
        
        return NextResponse.json({
            success: true,
            quote: {
                ...savedQuote,
                ...quote,
                aiInsights
            },
            message: 'AI-powered quote generated successfully'
        });
        
    } catch (error: any) {
        console.error('Enhanced quote generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate quote' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const requirementId = searchParams.get('requirementId');
        const sellerId = searchParams.get('sellerId');
        
        const quotes = sqliteDb.getQuotes();
        
        let filteredQuotes = quotes;
        
        if (requirementId) {
            filteredQuotes = filteredQuotes.filter(quote => quote.reqId === requirementId);
        }
        
        if (sellerId) {
            filteredQuotes = filteredQuotes.filter(quote => quote.sellerId === sellerId);
        }
        
        // Enhance quotes with AI insights
        const enhancedQuotes = filteredQuotes.map(quote => {
            const marketPrices = sqliteDb.getMarketPrices();
            const requirements = sqliteDb.getRequirements();
            const requirement = requirements.find(req => req.id === quote.reqId);
            
            if (requirement) {
                const marketAnalysis = AIPricingEngine.analyzeMarketPrices(
                    requirement.category,
                    requirement.deliveryLocation,
                    marketPrices
                );
                
                return {
                    ...quote,
                    marketAnalysis: {
                        trend: marketAnalysis.trend,
                        priceRange: marketAnalysis.priceRange,
                        currentMarketPrice: marketAnalysis.currentPrice
                    },
                    priceCompetitiveness: quote.sellerPrice <= marketAnalysis.currentPrice * 1.05 ? 'Competitive' : 'Premium'
                };
            }
            
            return quote;
        });
        
        return NextResponse.json({
            success: true,
            quotes: enhancedQuotes
        });
        
    } catch (error: any) {
        console.error('Get quotes error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quotes' },
            { status: 500 }
        );
    }
}
