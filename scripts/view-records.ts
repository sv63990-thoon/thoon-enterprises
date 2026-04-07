import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Set environment variable for Prisma
process.env.DATABASE_URL = 'postgres://14c5de5c9fb4965a1e9506e400beaf1b508cff1e8ef504d965e6bf90d16a0f91:sk__P44fleprs8nSHi5_MJWt@db.prisma.io:5432/postgres?sslmode=require';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
  adapter
});

async function getAllRecords() {
  try {
    console.log('=== DATABASE RECORDS ===\n');

    // Get Users
    console.log('--- USERS ---');
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
    });
    console.log('');

    // Get Category Margins
    console.log('--- CATEGORY MARGINS ---');
    const margins = await prisma.categoryMargin.findMany();
    console.log(`Found ${margins.length} margins:`);
    margins.forEach(margin => {
      console.log(`Category: ${margin.category}, Type: ${margin.marginType}, Value: ${margin.value}`);
    });
    console.log('');

    // Get Requirements
    console.log('--- REQUIREMENTS ---');
    const requirements = await prisma.requirement.findMany();
    console.log(`Found ${requirements.length} requirements:`);
    requirements.forEach(req => {
      console.log(`ID: ${req.id}, Buyer: ${req.buyerName}, Product: ${req.product}, Category: ${req.category}, Status: ${req.status}`);
    });
    console.log('');

    // Get Quotes
    console.log('--- QUOTES ---');
    const quotes = await prisma.quote.findMany();
    console.log(`Found ${quotes.length} quotes:`);
    quotes.forEach(quote => {
      console.log(`ID: ${quote.id}, ReqID: ${quote.reqId}, Seller: ${quote.sellerName}, Price: ${quote.finalPrice}, Status: ${quote.status}`);
    });
    console.log('');

    // Get Market Prices
    console.log('--- MARKET PRICES ---');
    const marketPrices = await prisma.marketPrice.findMany();
    console.log(`Found ${marketPrices.length} market prices:`);
    marketPrices.forEach(price => {
      console.log(`Category: ${price.category}, Brand: ${price.brand}, Price: ${price.price}, Unit: ${price.unit}`);
    });
    console.log('');

    // Get Orders
    console.log('--- ORDERS ---');
    const orders = await prisma.order.findMany();
    console.log(`Found ${orders.length} orders:`);
    orders.forEach(order => {
      console.log(`ID: ${order.id}, OrderNo: ${order.orderNumber}, Buyer: ${order.buyerName}, Seller: ${order.sellerName}, Product: ${order.product}, Status: ${order.status}`);
    });
    console.log('');

    // Get Order History
    console.log('--- ORDER HISTORY ---');
    const orderHistory = await prisma.orderHistory.findMany();
    console.log(`Found ${orderHistory.length} order history records:`);
    orderHistory.forEach(history => {
      console.log(`OrderID: ${history.orderId}, Status: ${history.status}, Timestamp: ${history.timestamp}`);
    });
    console.log('');

    // Get Audit Logs
    console.log('--- AUDIT LOGS ---');
    const auditLogs = await prisma.auditLog.findMany();
    console.log(`Found ${auditLogs.length} audit logs:`);
    auditLogs.slice(0, 10).forEach(log => { // Show first 10 to avoid too much output
      console.log(`User: ${log.userName}, Action: ${log.action}, Time: ${log.timestamp}`);
    });
    if (auditLogs.length > 10) {
      console.log(`... and ${auditLogs.length - 10} more audit logs`);
    }
    console.log('');

    // Get Estimates
    console.log('--- ESTIMATES ---');
    const estimates = await prisma.estimate.findMany();
    console.log(`Found ${estimates.length} estimates:`);
    estimates.forEach(estimate => {
      console.log(`ID: ${estimate.id}, BillingNo: ${estimate.billingNo}, Customer: ${estimate.customerName}, Total: ${estimate.totalAmount}`);
    });
    console.log('');

    // Get Estimate Items
    console.log('--- ESTIMATE ITEMS ---');
    const estimateItems = await prisma.estimateItem.findMany();
    console.log(`Found ${estimateItems.length} estimate items:`);
    estimateItems.forEach(item => {
      console.log(`EstimateID: ${item.estimateId}, Category: ${item.category}, Quantity: ${item.quantity}, Rate: ${item.rate}, Amount: ${item.amount}`);
    });
    console.log('');

    // Get System Config
    console.log('--- SYSTEM CONFIG ---');
    const systemConfig = await prisma.systemConfig.findMany();
    console.log(`Found ${systemConfig.length} config entries:`);
    systemConfig.forEach(config => {
      console.log(`Key: ${config.key}, Value: ${config.value}, Description: ${config.description || 'N/A'}`);
    });
    console.log('');

    console.log('=== END OF DATABASE RECORDS ===');

  } catch (error) {
    console.error('Error fetching records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
getAllRecords().catch(console.error);
