import { NextResponse } from 'next/server';
import { AIPricingEngine } from '@/lib/ai-pricing-engine';
import { ThoonBusinessLogic } from '@/lib/business-logic';

// In-memory storage for demo (in production, use database)
const negotiationSessions = new Map();

export async function POST(request: Request) {
    try {
        const { action, sessionId, requirementId, quoteId, offerPrice, offerBy } = await request.json();
        
        switch (action) {
            case 'start':
                return await startNegotiation(requirementId, quoteId);
            case 'respond':
                return await respondToNegotiation(sessionId, offerPrice, offerBy);
            case 'analyze':
                return await analyzeNegotiation(sessionId);
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
        
    } catch (error: any) {
        console.error('Negotiation API error:', error);
        return NextResponse.json(
            { error: 'Negotiation failed' },
            { status: 500 }
        );
    }
}

async function startNegotiation(requirementId: string, quoteId: string) {
    // Mock data - in production, fetch from database
    const requirement = {
        id: requirementId,
        buyerId: 'buyer-123',
        category: 'Cement',
        deliveryLocation: 'Chennai',
        urgency: 'medium',
        quantity: 500,
        budget: 25000
    };
    
    const quote = {
        id: quoteId,
        sellerId: 'seller-456',
        finalPrice: 28000,
        sellerName: 'Ramco Traders'
    };
    
    const marketPrices = [
        { category: 'Cement', price: 26000, lastUpdated: new Date().toISOString() }
    ];
    
    const marketAnalysis = AIPricingEngine.analyzeMarketPrices(
        requirement.category,
        requirement.deliveryLocation,
        marketPrices
    );
    
    const session = AIPricingEngine.startNegotiationSession(
        requirement as any,
        quote as any,
        requirement.budget
    );
    
    // Store session
    negotiationSessions.set(session.id, session);
    
    // Generate AI strategy
    const strategy = ThoonBusinessLogic.generateNegotiationStrategy(
        requirement as any,
        quote as any,
        marketPrices
    );
    
    return NextResponse.json({
        success: true,
        session: {
            ...session,
            marketAnalysis,
            aiStrategy: strategy
        },
        message: 'Negotiation session started with AI assistance'
    });
}

async function respondToNegotiation(sessionId: string, offerPrice: number, offerBy: 'buyer' | 'seller') {
    const session = negotiationSessions.get(sessionId);
    
    if (!session) {
        return NextResponse.json(
            { error: 'Negotiation session not found' },
            { status: 404 }
        );
    }
    
    const marketPrices = [
        { category: 'Cement', price: 26000, lastUpdated: new Date().toISOString() }
    ];
    
    const marketAnalysis = AIPricingEngine.analyzeMarketPrices(
        'Cement',
        'Chennai',
        marketPrices
    );
    
    const aiResponse = AIPricingEngine.generateNegotiationResponse(
        session,
        offerPrice,
        offerBy,
        marketAnalysis
    );
    
    // Add round to session
    const round = {
        round: session.rounds.length + 1,
        proposedBy: offerBy,
        price: offerPrice,
        message: aiResponse.message,
        timestamp: new Date().toISOString(),
        counterOffer: aiResponse.counterPrice
    };
    
    session.rounds.push(round);
    session.currentPrice = offerPrice;
    session.updatedAt = new Date().toISOString();
    
    if (aiResponse.shouldAccept) {
        session.status = 'accepted';
    }
    
    // Update session
    negotiationSessions.set(sessionId, session);
    
    return NextResponse.json({
        success: true,
        session,
        aiResponse,
        message: aiResponse.shouldAccept ? 'Deal accepted!' : 'Negotiation continues'
    });
}

async function analyzeNegotiation(sessionId: string) {
    const session = negotiationSessions.get(sessionId);
    
    if (!session) {
        return NextResponse.json(
            { error: 'Negotiation session not found' },
            { status: 404 }
        );
    }
    
    // Analyze negotiation patterns
    const analysis = {
        totalRounds: session.rounds.length,
        priceMovement: session.rounds.length > 1 ? 
            ((session.rounds[session.rounds.length - 1].price - session.rounds[0].price) / session.rounds[0].price * 100) : 0,
        averageDiscount: session.rounds.reduce((sum, round) => sum + round.price, 0) / session.rounds.length,
        negotiationTrend: session.rounds.length > 2 ? 
            (session.rounds[session.rounds.length - 1].price < session.rounds[session.rounds.length - 2].price ? 'converging' : 'diverging') : 'stable',
        recommendedAction: session.status === 'active' ? 'Continue negotiation' : 'Negotiation completed',
        successProbability: calculateSuccessProbability(session)
    };
    
    return NextResponse.json({
        success: true,
        analysis,
        session
    });
}

function calculateSuccessProbability(session: any): number {
    let probability = 50; // Base probability
    
    // Price convergence increases probability
    if (session.rounds.length > 1) {
        const priceGap = Math.abs(session.rounds[session.rounds.length - 1].price - session.initialPrice) / session.initialPrice;
        probability += (1 - priceGap) * 30;
    }
    
    // More rounds indicate serious interest
    probability += Math.min(session.rounds.length * 5, 20);
    
    // Cap at 95%
    return Math.min(probability, 95);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');
        
        if (sessionId) {
            const session = negotiationSessions.get(sessionId);
            if (!session) {
                return NextResponse.json(
                    { error: 'Session not found' },
                    { status: 404 }
                );
            }
            
            return NextResponse.json({
                success: true,
                session
            });
        }
        
        // Return all active sessions
        const sessions = Array.from(negotiationSessions.values());
        
        return NextResponse.json({
            success: true,
            sessions
        });
        
    } catch (error: any) {
        console.error('Get negotiation sessions error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch sessions' },
            { status: 500 }
        );
    }
}
