import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

// Set environment variable for Prisma
process.env.DATABASE_URL = 'postgres://14c5de5c9fb4965a1e9506e400beaf1b508cff1e8ef504d965e6bf90d16a0f91:sk__P44fleprs8nSHi5_MJWt@db.prisma.io:5432/postgres?sslmode=require';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
  adapter
});

// Helper function to find user by ID
function findUserById(userId: string, users: any[]) {
  return users.find(user => user.id === userId);
}

async function migrateData() {
  try {
    console.log('Starting data migration...');

    // Read existing JSON data
    const usersData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf-8'));
    const estimatesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'estimates.json'), 'utf-8'));

    console.log('Loaded JSON data successfully');

    // Migrate Users
    console.log('Migrating users...');
    for (const user of usersData.users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          passwordHash: user.passwordHash,
          salt: user.salt,
          phone: user.phone || null,
          companyName: user.companyName || null,
          address: user.address || null,
          gstin: user.gstin || null,
          rating: user.rating || 0,
          experienceYears: user.experienceYears || 0,
          subscriptionTier: user.subscriptionTier || 'basic',
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
          lastOrderDate: user.lastOrderDate ? new Date(user.lastOrderDate) : null,
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          passwordHash: user.passwordHash,
          salt: user.salt,
          phone: user.phone || null,
          companyName: user.companyName || null,
          address: user.address || null,
          gstin: user.gstin || null,
          rating: user.rating || 0,
          experienceYears: user.experienceYears || 0,
          subscriptionTier: user.subscriptionTier || 'basic',
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
          lastOrderDate: user.lastOrderDate ? new Date(user.lastOrderDate) : null,
        }
      });
    }
    console.log(`Migrated ${usersData.users.length} users`);

    // Migrate Category Margins
    console.log('Migrating category margins...');
    for (const margin of usersData.margins || []) {
      await prisma.categoryMargin.upsert({
        where: { category: margin.category },
        update: {
          marginType: margin.marginType,
          value: margin.value,
        },
        create: {
          category: margin.category,
          marginType: margin.marginType,
          value: margin.value,
        }
      });
    }
    console.log(`Migrated ${(usersData.margins || []).length} margins`);

    // Migrate Requirements
    console.log('Migrating requirements...');
    for (const req of usersData.requirements || []) {
      await prisma.requirement.upsert({
        where: { id: req.id },
        update: {
          buyerId: req.buyerId,
          buyerName: req.buyerName,
          product: req.product,
          category: req.category,
          brand: req.brand,
          quantity: req.quantity,
          unit: req.unit,
          status: req.status,
          deliveryLocation: req.deliveryLocation || null,
          createdAt: new Date(req.createdAt),
        },
        create: {
          id: req.id,
          buyerId: req.buyerId,
          buyerName: req.buyerName,
          product: req.product,
          category: req.category,
          brand: req.brand,
          quantity: req.quantity,
          unit: req.unit,
          status: req.status,
          deliveryLocation: req.deliveryLocation || null,
          createdAt: new Date(req.createdAt),
        }
      });
    }
    console.log(`Migrated ${(usersData.requirements || []).length} requirements`);

    // Migrate Quotes
    console.log('Migrating quotes...');
    for (const quote of usersData.quotes || []) {
      await prisma.quote.upsert({
        where: { id: quote.id },
        update: {
          reqId: quote.reqId,
          sellerId: quote.sellerId,
          sellerName: quote.sellerName,
          sellerPrice: quote.sellerPrice,
          thoonMargin: quote.thoonMargin,
          finalPrice: quote.finalPrice,
          status: quote.status,
          createdAt: new Date(quote.createdAt),
        },
        create: {
          id: quote.id,
          reqId: quote.reqId,
          sellerId: quote.sellerId,
          sellerName: quote.sellerName,
          sellerPrice: quote.sellerPrice,
          thoonMargin: quote.thoonMargin,
          finalPrice: quote.finalPrice,
          status: quote.status,
          createdAt: new Date(quote.createdAt),
        }
      });
    }
    console.log(`Migrated ${(usersData.quotes || []).length} quotes`);

    // Migrate Market Prices
    console.log('Migrating market prices...');
    for (const price of usersData.marketPrices || []) {
      // Map category names to enum values
      let categoryEnum: any = price.category;
      if (price.category === 'AAC Blocks') categoryEnum = 'AAC_Blocks';
      if (price.category === 'Sand & Aggregates') categoryEnum = 'Sand_Aggregates';
      
      await prisma.marketPrice.upsert({
        where: { id: price.id },
        update: {
          category: categoryEnum,
          brand: price.brand,
          price: price.price,
          unit: price.unit,
          change: price.change,
          lastUpdated: new Date(price.lastUpdated),
        },
        create: {
          id: price.id,
          category: categoryEnum,
          brand: price.brand,
          price: price.price,
          unit: price.unit,
          change: price.change,
          lastUpdated: new Date(price.lastUpdated),
        }
      });
    }
    console.log(`Migrated ${(usersData.marketPrices || []).length} market prices`);

    // Migrate Orders
    console.log('Migrating orders...');
    for (const order of usersData.orders || []) {
      // Find buyer and seller names
      const buyer = findUserById(order.buyerId, usersData.users);
      const seller = findUserById(order.sellerId, usersData.users);
      
      // Create order
      await prisma.order.upsert({
        where: { id: order.id },
        update: {
          orderNumber: order.orderNumber,
          reqId: order.reqId,
          buyerName: buyer?.name || 'Unknown Buyer',
          sellerName: seller?.name || 'Unknown Seller',
          product: order.product,
          category: order.category,
          quantity: order.quantity,
          unit: order.unit,
          totalPrice: order.totalPrice,
          status: order.status,
          deliveryDate: order.deliveryDate || '',
          deliveryLocation: order.deliveryLocation || '',
          deliveryInstructions: order.deliveryInstructions || null,
          rating: order.rating || null,
          feedback: order.feedback || null,
          createdAt: new Date(order.createdAt),
        },
        create: {
          id: order.id,
          orderNumber: order.orderNumber,
          reqId: order.reqId,
          buyerName: buyer?.name || 'Unknown Buyer',
          sellerName: seller?.name || 'Unknown Seller',
          product: order.product,
          category: order.category,
          quantity: order.quantity,
          unit: order.unit,
          totalPrice: order.totalPrice,
          status: order.status,
          deliveryDate: order.deliveryDate || '',
          deliveryLocation: order.deliveryLocation || '',
          deliveryInstructions: order.deliveryInstructions || null,
          rating: order.rating || null,
          feedback: order.feedback || null,
          createdAt: new Date(order.createdAt),
          quote: {
            connect: { id: order.quoteId }
          },
          buyer: {
            connect: { id: order.buyerId }
          },
          seller: {
            connect: { id: order.sellerId }
          }
        }
      });

      // Create order history
      if (order.history && order.history.length > 0) {
        for (const historyItem of order.history) {
          await prisma.orderHistory.create({
            data: {
              orderId: order.id,
              status: historyItem.status,
              timestamp: new Date(historyItem.timestamp),
            }
          });
        }
      }
    }
    console.log(`Migrated ${(usersData.orders || []).length} orders`);

    // Migrate Audit Logs
    console.log('Migrating audit logs...');
    for (const log of usersData.auditLogs || []) {
      await prisma.auditLog.create({
        data: {
          id: log.id,
          userId: log.userId,
          userName: log.userName,
          action: log.action,
          details: log.details,
          timestamp: new Date(log.timestamp),
        }
      });
    }
    console.log(`Migrated ${(usersData.auditLogs || []).length} audit logs`);

    // Migrate Estimates
    console.log('Migrating estimates...');
    for (const estimate of estimatesData.estimates || []) {
      // Create estimate
      await prisma.estimate.create({
        data: {
          id: estimate.id,
          billingNo: estimate.billingNo,
          date: estimate.date,
          customerName: estimate.customerName,
          phone: estimate.phone,
          area: estimate.area,
          deliveryCharge: estimate.deliveryCharge,
          subtotal: estimate.subtotal,
          gstEnabled: estimate.gstEnabled,
          gstAmount: estimate.gstAmount,
          roundOff: estimate.roundOff,
          totalAmount: estimate.totalAmount,
          createdAt: new Date(estimate.createdAt),
          updatedAt: new Date(estimate.updatedAt),
        }
      });

      // Create estimate items
      for (const item of estimate.items || []) {
        await prisma.estimateItem.create({
          data: {
            sno: item.sno,
            category: item.category,
            size: item.size,
            type: item.type,
            quantity: parseInt(item.quantity),
            units: item.units,
            rate: item.rate,
            amount: item.amount,
            estimateId: estimate.id,
          }
        });
      }
    }
    console.log(`Migrated ${(estimatesData.estimates || []).length} estimates`);

    // Store order sequence
    if (usersData.orderSequence !== undefined) {
      await prisma.systemConfig.upsert({
        where: { key: 'orderSequence' },
        update: { value: usersData.orderSequence.toString() },
        create: {
          key: 'orderSequence',
          value: usersData.orderSequence.toString(),
          description: 'Sequence number for generating order numbers'
        }
      });
    }

    // Store estimate sequence
    if (estimatesData.sequence !== undefined) {
      await prisma.systemConfig.upsert({
        where: { key: 'estimateSequence' },
        update: { value: estimatesData.sequence.toString() },
        create: {
          key: 'estimateSequence',
          value: estimatesData.sequence.toString(),
          description: 'Sequence number for generating estimate billing numbers'
        }
      });
    }

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateData().catch(console.error);
