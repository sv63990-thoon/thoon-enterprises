import { db } from '../lib/prisma-db';

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test users
    const users = await db.getAllUsers();
    console.log(`Found ${users.length} users in database`);
    
    // Test requirements
    const requirements = await db.getRequirements();
    console.log(`Found ${requirements.length} requirements in database`);
    
    // Test quotes
    const quotes = await db.getQuotes();
    console.log(`Found ${quotes.length} quotes in database`);
    
    // Test orders
    const orders = await db.getOrders();
    console.log(`Found ${orders.length} orders in database`);
    
    // Test market prices
    const marketPrices = await db.getMarketPrices();
    console.log(`Found ${marketPrices.length} market prices in database`);
    
    console.log('Database connection test completed successfully!');
    
  } catch (error) {
    console.error('Database connection test failed:', error);
  }
}

testDatabaseConnection();
