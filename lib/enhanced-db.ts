import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

// Enhanced User Types based on Arqonz model
export type UserRole = 'admin' | 'buyer' | 'seller' | 'architect' | 'engineer' | 'contractor' | 'developer' | 'supplier' | 'channel_partner';
export type UserStatus = 'pending' | 'active' | 'rejected' | 'verified' | 'premium';
export type SubscriptionTier = 'basic' | 'verified' | 'gold' | 'premium';

// Enhanced User Interface with Arqonz-inspired features
export interface EnhancedUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    phone?: string;
    companyName?: string;
    address?: string;
    gstin?: string;
    rating?: number;
    experienceYears?: number;
    subscriptionTier: SubscriptionTier;
    lastLogin?: string;
    lastOrderDate?: string;
    
    // Arqonz-inspired fields
    verificationStatus: 'pending' | 'verified' | 'rejected';
    verificationDocuments?: string[];
    businessLicense?: string;
    yearsInBusiness?: number;
    annualRevenue?: string;
    serviceAreas?: string[];
    specializations?: string[];
    certifications?: string[];
    portfolio?: Project[];
    preferredBrands?: string[];
    creditLimit?: number;
    paymentTerms?: string;
    
    // AI and Intelligence features
    aiScore?: number; // Trust score like Arqonz
    marketInsights?: MarketInsight[];
    recommendedProjects?: string[];
    
    createdAt: string;
}

// Project tracking like Arqonz
export interface Project {
    id: string;
    title: string;
    description: string;
    clientId: string;
    clientName: string;
    architectId?: string;
    engineerId?: string;
    contractorId?: string;
    status: 'planning' | 'approved' | 'construction' | 'completed' | 'on_hold';
    location: string;
    budget: number;
    startDate: string;
    expectedEndDate: string;
    actualEndDate?: string;
    specifications: ProjectSpecification[];
    requirements: string[]; // Linked requirement IDs
    createdAt: string;
    updatedAt: string;
}

export interface ProjectSpecification {
    id: string;
    projectId: string;
    category: string;
    brand: string;
    quantity: number;
    unit: string;
    specifications: string;
    status: 'specified' | 'sourced' | 'delivered';
    supplierId?: string;
    quoteId?: string;
}

// Enhanced Requirement with AI features
export interface EnhancedRequirement {
    id: string;
    buyerId: string;
    buyerName: string;
    projectId?: string;
    projectTitle?: string;
    product: string;
    category: string;
    brand?: string;
    quantity: number;
    unit: string;
    budget?: number;
    urgency: 'low' | 'medium' | 'high' | 'urgent';
    deliveryLocation: string;
    deliveryDate?: string;
    status: 'pending' | 'quoted' | 'negotiating' | 'estimated' | 'closed';
    
    // AI-powered features
    aiRecommendedPrice?: number;
    aiRecommendedSuppliers?: string[];
    marketPriceAnalysis?: PriceAnalysis;
    competingQuotes?: number;
    
    // E-negotiation features
    negotiationEnabled: boolean;
    bestPrice?: number;
    priceHistory: PriceHistory[];
    
    createdAt: string;
    updatedAt: string;
}

// Enhanced Quote with negotiation features
export interface EnhancedQuote {
    id: string;
    reqId: string;
    sellerId: string;
    sellerName: string;
    sellerRating: number;
    sellerVerificationStatus: string;
    sellerAiScore: number;
    
    // Pricing details
    basePrice: number;
    discountPercent: number;
    discountedPrice: number;
    gstAmount: number;
    deliveryCharges: number;
    thoonMargin: number;
    finalPrice: number;
    
    // Negotiation features
    negotiationEnabled: boolean;
    minPrice?: number;
    validUntil: string;
    priceBreakdown?: PriceBreakdown[];
    
    // Quality and trust features
    qualityGuarantee: boolean;
    deliveryTimeline: string;
    paymentTerms: string;
    warranty?: string;
    
    status: 'submitted' | 'negotiating' | 'accepted' | 'rejected' | 'expired';
    createdAt: string;
    updatedAt: string;
}

export interface PriceBreakdown {
    item: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface PriceHistory {
    price: number;
    timestamp: string;
    changedBy: 'seller' | 'ai' | 'admin';
    reason?: string;
}

export interface PriceAnalysis {
    currentMarketPrice: number;
    priceRange: { min: number; max: number };
    trend: 'increasing' | 'decreasing' | 'stable';
    lastUpdated: string;
}

// Market Intelligence like Arqonz
export interface MarketInsight {
    id: string;
    userId: string;
    category: string;
    location: string;
    insight: string;
    opportunityLevel: 'low' | 'medium' | 'high';
    recommendedAction: string;
    projectedDemand: number;
    competitionLevel: 'low' | 'medium' | 'high';
    validUntil: string;
    createdAt: string;
}

// Enhanced Order with tracking
export interface EnhancedOrder {
    id: string;
    orderNumber: string;
    reqId: string;
    quoteId: string;
    buyerId: string;
    buyerName: string;
    sellerId: string;
    sellerName: string;
    projectId?: string;
    
    // Product details
    product: string;
    category: string;
    brand: string;
    quantity: number;
    unit: string;
    totalPrice: number;
    
    // Order management
    status: 'processing' | 'confirmed' | 'manufacturing' | 'quality_check' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue';
    
    // Logistics
    deliveryDate: string;
    deliveryLocation: string;
    deliveryInstructions?: string;
    trackingNumber?: string;
    logisticsPartner?: string;
    
    // Quality and feedback
    qualityInspection: boolean;
    inspectionReport?: string;
    rating?: number;
    feedback?: string;
    
    // Financial
    paymentTerms: string;
    dueDate: string;
    invoiceNumber?: string;
    
    // History tracking
    history: OrderHistory[];
    documents: OrderDocument[];
    
    createdAt: string;
    updatedAt: string;
}

export interface OrderHistory {
    status: string;
    timestamp: string;
    updatedBy: string;
    comments?: string;
}

export interface OrderDocument {
    id: string;
    type: 'invoice' | 'receipt' | 'quality_report' | 'delivery_note' | 'warranty';
    url: string;
    uploadedAt: string;
}

// Supplier/Dealer Management like Arqonz
export interface SupplierProfile {
    userId: string;
    companyName: string;
    businessType: 'manufacturer' | 'distributor' | 'dealer' | 'retailer';
    establishedYear: number;
    annualTurnover: string;
    employeeCount: number;
    
    // Product catalog
    productCategories: string[];
    brands: string[];
    certifications: string[];
    
    // Operations
    serviceAreas: ServiceArea[];
    warehouses: Warehouse[];
    deliveryCapacity: DeliveryCapacity;
    
    // Financial
    creditRating: string;
    paymentTerms: string;
    minimumOrderValue: number;
    
    // Performance
    fulfillmentRate: number;
    averageDeliveryTime: number;
    qualityScore: number;
    
    // Verification
    verificationDocuments: VerificationDocument[];
    verifiedBy?: string;
    verificationDate?: string;
}

export interface ServiceArea {
    state: string;
    cities: string[];
    deliveryTime: number; // in days
    deliveryCost: number;
}

export interface Warehouse {
    id: string;
    location: string;
    capacity: number;
    products: string[];
    contactPerson: string;
    phone: string;
}

export interface DeliveryCapacity {
    dailyCapacity: number;
    vehicleTypes: string[];
    coverageRadius: number; // in km
}

export interface VerificationDocument {
    type: 'gst' | 'license' | 'certification' | 'bank_statement' | 'address_proof';
    documentUrl: string;
    verified: boolean;
    verifiedDate?: string;
    expiryDate?: string;
}

// AI-Powered Intelligence System
export interface AIInsight {
    id: string;
    type: 'price_optimization' | 'demand_forecast' | 'supplier_recommendation' | 'market_trend';
    userId: string;
    title: string;
    description: string;
    confidence: number; // 0-100
    potentialSavings?: number;
    recommendedAction: string;
    data: any;
    createdAt: string;
    expiresAt: string;
}

// E-Negotiation System
export interface NegotiationSession {
    id: string;
    requirementId: string;
    buyerId: string;
    sellerId: string;
    initialPrice: number;
    currentPrice: number;
    minPrice?: number;
    maxPrice?: number;
    status: 'active' | 'accepted' | 'rejected' | 'expired';
    rounds: NegotiationRound[];
    aiAssistance: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface NegotiationRound {
    round: number;
    proposedBy: 'buyer' | 'seller' | 'ai';
    price: number;
    message?: string;
    timestamp: string;
    counterOffer?: number;
}

// Commission and Revenue Tracking
export interface CommissionRecord {
    id: string;
    orderId: string;
    sellerId: string;
    buyerId: string;
    orderValue: number;
    commissionType: 'percentage' | 'fixed';
    commissionValue: number;
    commissionAmount: number;
    status: 'pending' | 'earned' | 'paid';
    paidDate?: string;
    createdAt: string;
}

// Enhanced interfaces for existing types
export interface EnhancedMarketPrice {
    id: string;
    category: string;
    brand: string;
    price: number;
    unit: string;
    change: number;
    changePercent: number;
    lastUpdated: string;
    
    // AI-powered insights
    trend: 'increasing' | 'decreasing' | 'stable';
    predictedPrice?: number;
    confidence?: number;
    factors?: string[];
    
    // Regional pricing
    regionalPrices: RegionalPrice[];
}

export interface RegionalPrice {
    region: string;
    price: number;
    demand: 'low' | 'medium' | 'high';
}

// Enhanced Audit with AI tracking
export interface EnhancedAuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    details: string;
    module: string;
    ip?: string;
    userAgent?: string;
    sessionId?: string;
    
    // AI features
    aiDetected: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    
    timestamp: string;
}

// Notification System
export interface Notification {
    id: string;
    userId: string;
    type: 'quote_received' | 'order_status' | 'payment_due' | 'ai_insight' | 'market_alert' | 'verification_update';
    title: string;
    message: string;
    data?: any;
    read: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    readAt?: string;
}

export default EnhancedUser;
