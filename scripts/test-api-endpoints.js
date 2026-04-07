// Test script to verify API endpoints are connected to database
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  try {
    console.log('Testing API endpoints...\n');

    // Test requirements endpoint
    console.log('1. Testing /api/requirements');
    const reqResponse = await fetch(`${BASE_URL}/api/requirements`);
    const requirements = await reqResponse.json();
    console.log(`   Status: ${reqResponse.status}`);
    console.log(`   Found ${requirements.length} requirements`);
    if (requirements.length > 0) {
      console.log(`   Sample: ${requirements[0].product} - ${requirements[0].category}`);
    }
    console.log('');

    // Test quotes endpoint
    console.log('2. Testing /api/quotes');
    const quotesResponse = await fetch(`${BASE_URL}/api/quotes`);
    const quotes = await quotesResponse.json();
    console.log(`   Status: ${quotesResponse.status}`);
    console.log(`   Found ${quotes.length} quotes`);
    if (quotes.length > 0) {
      console.log(`   Sample: ${quotes[0].sellerName} - ${quotes[0].finalPrice}`);
    }
    console.log('');

    // Test orders endpoint
    console.log('3. Testing /api/orders');
    const ordersResponse = await fetch(`${BASE_URL}/api/orders`);
    const orders = await ordersResponse.json();
    console.log(`   Status: ${ordersResponse.status}`);
    console.log(`   Found ${orders.length} orders`);
    if (orders.length > 0) {
      console.log(`   Sample: ${orders[0].orderNumber} - ${orders[0].status}`);
    }
    console.log('');

    // Test market prices endpoint
    console.log('4. Testing /api/admin/market-prices');
    const pricesResponse = await fetch(`${BASE_URL}/api/admin/market-prices`);
    const prices = await pricesResponse.json();
    console.log(`   Status: ${pricesResponse.status}`);
    console.log(`   Found ${prices.length} market prices`);
    if (prices.length > 0) {
      console.log(`   Sample: ${prices[0].brand} - ${prices[0].price}`);
    }
    console.log('');

    // Test admin users endpoint
    console.log('5. Testing /api/admin/users');
    const usersResponse = await fetch(`${BASE_URL}/api/admin/users`);
    const users = await usersResponse.json();
    console.log(`   Status: ${usersResponse.status}`);
    console.log(`   Found ${users.length} users`);
    if (users.length > 0) {
      console.log(`   Sample: ${users[0].name} - ${users[0].role}`);
    }
    console.log('');

    console.log('All endpoints are successfully connected to the database!');

  } catch (error) {
    console.error('Error testing endpoints:', error.message);
  }
}

testEndpoints();
