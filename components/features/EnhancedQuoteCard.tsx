import React, { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
    TrendingUp, 
    TrendingDown, 
    Minus, 
    Star, 
    Shield, 
    Truck, 
    Clock,
    DollarSign,
    Brain,
    Target,
    Award,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';

interface EnhancedQuoteCardProps {
    quote: any;
    onAccept?: () => void;
    onNegotiate?: () => void;
    onViewDetails?: () => void;
}

export default function EnhancedQuoteCard({ 
    quote, 
    onAccept, 
    onNegotiate, 
    onViewDetails 
}: EnhancedQuoteCardProps) {
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAIAnalysis();
    }, [quote.id]);

    const fetchAIAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/enhanced/intelligence?type=market-analysis&category=${quote.category}&location=Chennai`);
            const data = await response.json();
            setAiAnalysis(data.marketAnalysis);
        } catch (error) {
            console.error('Failed to fetch AI analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriceTrendIcon = (trend: string) => {
        switch (trend) {
            case 'increasing':
                return <TrendingUp className="h-4 w-4 text-red-500" />;
            case 'decreasing':
                return <TrendingDown className="h-4 w-4 text-green-500" />;
            default:
                return <Minus className="h-4 w-4 text-gray-500" />;
        }
    };

    const getTrustScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getCompetitivenessBadge = (price: number, marketPrice: number) => {
        const difference = ((price - marketPrice) / marketPrice) * 100;
        
        if (difference <= -5) {
            return { text: 'Excellent Deal', color: 'bg-green-100 text-green-800' };
        } else if (difference <= 0) {
            return { text: 'Good Deal', color: 'bg-blue-100 text-blue-800' };
        } else if (difference <= 5) {
            return { text: 'Market Rate', color: 'bg-gray-100 text-gray-800' };
        } else {
            return { text: 'Premium', color: 'bg-orange-100 text-orange-800' };
        }
    };

    const competitiveness = getCompetitivenessBadge(quote.finalPrice, quote.marketPrice || quote.finalPrice);

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardBody className="p-6">
                {/* Header with AI Badge */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <Brain className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-purple-600">AI-Powered</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${competitiveness.color}`}>
                            {competitiveness.text}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Verified</span>
                    </div>
                </div>

                {/* Supplier Info */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{quote.sellerName}</h3>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{quote.sellerRating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-blue-500" />
                            <span className={`text-sm font-medium ${getTrustScoreColor(quote.sellerAiScore)}`}>
                                {quote.sellerAiScore}% Trust Score
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Final Price</span>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">₹{quote.finalPrice.toLocaleString()}</div>
                            {quote.marketPrice && (
                                <div className="text-xs text-gray-500">
                                    Market: ₹{quote.marketPrice.toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Base Price</span>
                            <span>₹{quote.dynamicPrice?.toLocaleString() || quote.finalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">GST (18%)</span>
                            <span>₹{quote.gstAmount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Delivery</span>
                            <span>₹{quote.deliveryCharges?.toLocaleString() || 0}</span>
                        </div>
                        {quote.commission && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Platform Fee</span>
                                <span>₹{quote.commission.commissionAmount?.toLocaleString() || 0}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Insights */}
                {quote.aiInsights && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">AI Insights</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-gray-700">
                                    Price Competitiveness: {quote.aiInsights.priceCompetitiveness}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-gray-700">
                                    Delivery Reliability: {quote.aiInsights.deliveryReliability}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-gray-700">
                                    {quote.aiInsights.recommendedAction}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Market Analysis */}
                {aiAnalysis && !loading && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">Market Analysis</span>
                            </div>
                            {getPriceTrendIcon(aiAnalysis.trend)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-gray-600">Price Range:</span>
                                <div className="font-medium">
                                    ₹{aiAnalysis.priceRange?.min?.toLocaleString()} - ₹{aiAnalysis.priceRange?.max?.toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-600">Confidence:</span>
                                <div className="font-medium">{aiAnalysis.confidence}%</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">{quote.deliveryTimeline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">{quote.qualityGuarantee ? 'Quality Guaranteed' : 'Standard Quality'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">{quote.paymentTerms}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">{quote.negotiationEnabled ? 'Negotiable' : 'Fixed Price'}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        onClick={onAccept}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                        Accept Quote
                    </Button>
                    {quote.negotiationEnabled && (
                        <Button
                            onClick={onNegotiate}
                            variant="outline"
                            className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                            <Brain className="h-4 w-4 mr-2" />
                            AI Negotiate
                        </Button>
                    )}
                    <Button
                        onClick={onViewDetails}
                        variant="outline"
                        className="px-4"
                    >
                        Details
                    </Button>
                </div>

                {/* Valid Until */}
                {quote.validUntil && (
                    <div className="mt-3 text-center">
                        <span className="text-xs text-gray-500">
                            Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
