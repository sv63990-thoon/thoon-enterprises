import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import crypto from 'crypto';

// Set environment variable for Prisma
process.env.DATABASE_URL = 'postgres://14c5de5c9fb4965a1e9506e400beaf1b508cff1e8ef504d965e6bf90d16a0f91:sk__P44fleprs8nSHi5_MJWt@db.prisma.io:5432/postgres?sslmode=require';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
  adapter
});

export type UserRole = 'admin' | 'buyer' | 'seller';
export type UserStatus = 'pending' | 'active' | 'rejected';

function hashPassword(password: string): { salt: string; hash: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

export const db = {
    // Auth Methods
    findUserByEmail: async (email: string) => {
        const normalizedEmail = email.toLowerCase().trim();
        return await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                phone: true,
                companyName: true,
                address: true,
                gstin: true,
                rating: true,
                experienceYears: true,
                subscriptionTier: true,
                lastLogin: true,
                lastOrderDate: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },

    createUser: async (name: string, email: string, password: string, role: UserRole = 'buyer', details?: any) => {
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });
        
        if (existingUser) {
            throw new Error('User already exists');
        }

        const { salt, hash } = hashPassword(password);
        const userCount = await prisma.user.count();

        // First user is always admin and active
        const finalRole = userCount === 0 ? 'admin' : role;
        const finalStatus = finalRole === 'admin' ? 'active' : 'pending';

        const newUser = await prisma.user.create({
            data: {
                name,
                email: normalizedEmail,
                role: finalRole,
                status: finalStatus,
                passwordHash: hash,
                salt,
                phone: details?.phone,
                companyName: details?.companyName,
                address: details?.address,
                gstin: details?.gstin,
                rating: details?.rating ?? 0,
                experienceYears: details?.experienceYears ?? 0,
                subscriptionTier: details?.subscriptionTier ?? 'basic'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                phone: true,
                companyName: true,
                address: true,
                gstin: true,
                rating: true,
                experienceYears: true,
                subscriptionTier: true,
                lastLogin: true,
                lastOrderDate: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return newUser;
    },

    validateUser: async (email: string, password: string) => {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (!user) return null;
        if (!verifyPassword(password, user.salt, user.passwordHash)) return null;

        const { passwordHash, salt, ...safeUser } = user;
        return safeUser;
    },

    updateUserStatus: async (userId: string, status: UserStatus) => {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { status }
        });
        
        if (!user) throw new Error('User not found');
        return user;
    },

    getPendingUsers: async () => {
        return await prisma.user.findMany({
            where: { status: 'pending' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                phone: true,
                companyName: true,
                address: true,
                gstin: true,
                rating: true,
                experienceYears: true,
                subscriptionTier: true,
                lastLogin: true,
                lastOrderDate: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },

    getAllUsers: async () => {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                phone: true,
                companyName: true,
                address: true,
                gstin: true,
                rating: true,
                experienceYears: true,
                subscriptionTier: true,
                lastLogin: true,
                lastOrderDate: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },

    updateLastLogin: async (userId: string) => {
        await prisma.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() }
        });
    },

    // Margin Methods
    getMargins: async () => {
        return await prisma.categoryMargin.findMany();
    },

    upsertMargin: async (category: string, marginType: 'percent' | 'fixed', value: number) => {
        await prisma.categoryMargin.upsert({
            where: { category },
            update: { marginType, value },
            create: { category, marginType, value }
        });
        
        return await prisma.categoryMargin.findMany();
    },

    // Requirement Methods
    createRequirement: async (buyerId: string, buyerName: string, product: string, category: string, brand: string, quantity: number, unit: string, deliveryLocation?: string) => {
        return await prisma.requirement.create({
            data: {
                buyerId,
                buyerName,
                product,
                category,
                brand,
                quantity,
                unit,
                status: 'pending',
                deliveryLocation
            }
        });
    },

    getRequirements: async () => {
        return await prisma.requirement.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

    // Quote Methods
    submitQuote: async (reqId: string, sellerId: string, sellerName: string, sellerPrice: number) => {
        const requirement = await prisma.requirement.findUnique({
            where: { id: reqId }
        });
        
        if (!requirement) throw new Error('Requirement not found');

        const margin = await prisma.categoryMargin.findFirst({
            where: { category: requirement.category }
        }) || { marginType: 'percent', value: 10 }; // Default 10%

        let thoonMargin = 0;
        if (margin.marginType === 'fixed') {
            thoonMargin = margin.value;
        } else {
            thoonMargin = (sellerPrice * margin.value) / 100;
        }

        const finalPrice = sellerPrice + thoonMargin;

        // Check for existing quote
        const existingQuote = await prisma.quote.findFirst({
            where: { reqId, sellerId }
        });

        if (existingQuote) {
            // Update existing quote
            const updatedQuote = await prisma.quote.update({
                where: { id: existingQuote.id },
                data: {
                    sellerPrice,
                    thoonMargin,
                    finalPrice
                }
            });
            
            // Update requirement status
            await prisma.requirement.update({
                where: { id: reqId },
                data: { status: 'estimated' }
            });
            
            return updatedQuote;
        }

        const newQuote = await prisma.quote.create({
            data: {
                reqId,
                sellerId,
                sellerName,
                sellerPrice,
                thoonMargin,
                finalPrice
            }
        });

        // Update requirement status
        await prisma.requirement.update({
            where: { id: reqId },
            data: { status: 'estimated' }
        });

        return newQuote;
    },

    getQuotes: async () => {
        return await prisma.quote.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

    updateQuoteMargin: async (quoteId: string, newMargin: number) => {
        const quote = await prisma.quote.findUnique({
            where: { id: quoteId }
        });
        
        if (!quote) throw new Error('Quote not found');

        const updatedQuote = await prisma.quote.update({
            where: { id: quoteId },
            data: {
                thoonMargin: newMargin,
                finalPrice: quote.sellerPrice + newMargin
            }
        });

        return updatedQuote;
    },

    getQuotesForRequirement: async (reqId: string) => {
        const quotes = await prisma.quote.findMany({
            where: { reqId },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        rating: true,
                        experienceYears: true,
                        subscriptionTier: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Deduplicate: Keep only the latest quote per seller
        const unique: Record<string, any> = {};
        quotes.forEach(q => {
            if (!unique[q.sellerId] || new Date(q.createdAt) > new Date(unique[q.sellerId].createdAt)) {
                unique[q.sellerId] = q;
            }
        });
        
        return Object.values(unique);
    },

    getBestQuoteForRequirement: async (reqId: string) => {
        const quotes = await db.getQuotesForRequirement(reqId);
        if (quotes.length === 0) return null;

        let bestQuote: any = null;
        let highestScore = -Infinity;

        const lowestPrice = Math.min(...quotes.map((q: any) => q.sellerPrice));

        quotes.forEach(quote => {
            const seller = quote.seller;
            if (!seller) return;

            // Trust Score Calculation
            let trustScore = 0;

            // 1. Subscription Tier
            if (seller.subscriptionTier === 'gold') trustScore += 100;
            else if (seller.subscriptionTier === 'verified') trustScore += 60;

            // 2. Rating (20 points per star)
            trustScore += (seller.rating || 0) * 20;

            // 3. Experience (5 points per year, max 50)
            trustScore += Math.min((seller.experienceYears || 0) * 5, 50);

            // 4. Price Variance Penalty
            const priceVariancePercent = ((quote.sellerPrice - lowestPrice) / lowestPrice) * 100;
            const finalScore = trustScore - (priceVariancePercent * 10);

            if (finalScore > highestScore) {
                highestScore = finalScore;
                bestQuote = quote;
            }
        });

        return bestQuote;
    },

    // Market Price Methods
    getMarketPrices: async () => {
        return await prisma.marketPrice.findMany({
            orderBy: { category: 'asc' }
        });
    },

    updateMarketPrice: async (id: string, updates: any) => {
        const updatedPrice = await prisma.marketPrice.update({
            where: { id },
            data: {
                ...updates,
                lastUpdated: new Date()
            }
        });
        
        return await prisma.marketPrice.findMany();
    },

    addMarketPrice: async (category: any, brand: string, price: number, unit: string, change: number) => {
        await prisma.marketPrice.create({
            data: {
                category,
                brand,
                price,
                unit,
                change
            }
        });
        
        return await prisma.marketPrice.findMany();
    },

    // Order Methods
    createOrder: async (quoteId: string, deliveryDate: string, deliveryLocation: string, deliveryInstructions?: string) => {
        const quote = await prisma.quote.findUnique({
            where: { id: quoteId },
            include: { requirement: true }
        });
        
        if (!quote) throw new Error('Quote not found');
        if (!quote.requirement) throw new Error('Requirement not found');

        // Get next order sequence
        const orderSequence = await prisma.systemConfig.findUnique({
            where: { key: 'orderSequence' }
        });
        
        const currentSequence = orderSequence ? parseInt(orderSequence.value) : 1000;
        const newSequence = currentSequence + 1;
        const orderNum = `THN-ORD-${newSequence}`;

        // Update sequence
        await prisma.systemConfig.upsert({
            where: { key: 'orderSequence' },
            update: { value: newSequence.toString() },
            create: {
                key: 'orderSequence',
                value: newSequence.toString(),
                description: 'Sequence number for generating order numbers'
            }
        });

        const newOrder = await prisma.order.create({
            data: {
                orderNumber: orderNum,
                reqId: quote.requirement.id,
                quoteId: quote.id,
                buyerId: quote.requirement.buyerId,
                buyerName: quote.requirement.buyerName,
                sellerId: quote.sellerId,
                sellerName: quote.sellerName,
                product: quote.requirement.product,
                category: quote.requirement.category,
                quantity: quote.requirement.quantity,
                unit: quote.requirement.unit,
                totalPrice: quote.finalPrice,
                status: 'processing',
                deliveryDate,
                deliveryLocation,
                deliveryInstructions,
                quote: { connect: { id: quote.id } },
                buyer: { connect: { id: quote.requirement.buyerId } },
                seller: { connect: { id: quote.sellerId } }
            }
        });

        // Create initial order history
        await prisma.orderHistory.create({
            data: {
                orderId: newOrder.id,
                status: 'processing'
            }
        });

        // Update requirement status
        await prisma.requirement.update({
            where: { id: quote.requirement.id },
            data: { status: 'closed' }
        });

        // Update last order date for buyer and seller
        const now = new Date();
        await prisma.user.updateMany({
            where: { id: { in: [quote.requirement.buyerId, quote.sellerId] } },
            data: { lastOrderDate: now }
        });

        return newOrder;
    },

    getOrders: async () => {
        return await prisma.order.findMany({
            include: {
                buyer: {
                    select: { id: true, name: true, email: true }
                },
                seller: {
                    select: { id: true, name: true, email: true }
                },
                quote: {
                    select: { id: true, sellerPrice: true, thoonMargin: true, finalPrice: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    },

    updateOrderStatus: async (orderId: string, status: any) => {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        
        if (!order) throw new Error('Order not found');

        // Add to order history
        await prisma.orderHistory.create({
            data: {
                orderId,
                status
            }
        });

        return order;
    },

    rateOrder: async (orderId: string, rating: number, feedback?: string) => {
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });
        
        if (!order) throw new Error('Order not found');
        if (order.status !== 'delivered') throw new Error('Can only rate delivered orders');

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { rating, feedback }
        });

        // Update seller overall rating
        const sellerOrders = await prisma.order.findMany({
            where: { 
                sellerId: order.sellerId,
                rating: { not: null }
            }
        });

        const totalRating = sellerOrders.reduce((sum, o) => sum + (o.rating || 0), 0);
        const avgRating = Number((totalRating / sellerOrders.length).toFixed(1));

        await prisma.user.update({
            where: { id: order.sellerId },
            data: { rating: avgRating }
        });

        return updatedOrder;
    },

    // Audit Methods
    logAction: async (userId: string, action: string, details: string) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true }
        });
        
        const userName = user ? user.name : 'Unknown User';

        const newLog = await prisma.auditLog.create({
            data: {
                userId,
                userName,
                action,
                details
            }
        });

        // Keep only last 500 logs to prevent bloat
        const totalLogs = await prisma.auditLog.count();
        if (totalLogs > 500) {
            const logsToDelete = await prisma.auditLog.findMany({
                orderBy: { timestamp: 'desc' },
                skip: 500,
                select: { id: true }
            });
            
            if (logsToDelete.length > 0) {
                await prisma.auditLog.deleteMany({
                    where: {
                        id: {
                            in: logsToDelete.map(log => log.id)
                        }
                    }
                });
            }
        }

        return newLog;
    },

    getAuditLogs: async () => {
        return await prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 500
        });
    }
};
