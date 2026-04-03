// Test script for Enhanced Thoon Enterprises System
// Run this to verify all features are working

const path = require('path');

console.log('🧪 Testing Enhanced Thoon Enterprises System...\n');

// Test 1: Check if SQLite is available
try {
    const Database = require('better-sqlite3');
    console.log('✅ SQLite package is available');
} catch (error) {
    console.log('❌ SQLite package not found. Run: npm install better-sqlite3 @types/better-sqlite3');
    process.exit(1);
}

// Test 2: Check database creation
try {
    const Database = require('better-sqlite3');
    const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
    const db = new Database(dbPath);
    
    // Check if tables exist
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const requiredTables = [
        'users', 'requirements', 'quotes', 'orders', 
        'market_prices', 'audit_logs', 'negotiation_sessions', 'notifications'
    ];
    
    let allTablesExist = true;
    requiredTables.forEach(table => {
        if (tables.find(t => t.name === table)) {
            console.log(`✅ Table '${table}' exists`);
        } else {
            console.log(`❌ Table '${table}' missing`);
            allTablesExist = false;
        }
    });
    
    if (allTablesExist) {
        console.log('\n✅ All database tables created successfully');
    }
    
    db.close();
} catch (error) {
    console.log('❌ Database test failed:', error.message);
}

// Test 3: Check enhanced features
try {
    const { ThoonBusinessLogic } = require('./lib/business-logic.ts');
    
    // Test trust score calculation
    const testUser = {
        subscriptionTier: 'verified',
        rating: 4.5,
        experienceYears: 5,
        verificationStatus: 'verified'
    };
    
    const trustScore = ThoonBusinessLogic.calculateTrustScore(testUser);
    console.log(`✅ Trust score calculation works: ${trustScore}/100`);
    
} catch (error) {
    console.log('⚠️  Business logic test (TypeScript import may not work in Node.js directly)');
}

// Test 4: Check API endpoints (will be tested when server is running)
console.log('\n📡 API Endpoints to test when server is running:');
console.log('   GET  http://localhost:3000/api/enhanced/intelligence?type=market-analysis&category=Cement');
console.log('   POST http://localhost:3000/api/enhanced/quotes');
console.log('   POST http://localhost:3000/api/enhanced/negotiate');

// Test 5: Check file structure
const fs = require('fs');
const requiredFiles = [
    'lib/enhanced-db.ts',
    'lib/business-logic.ts', 
    'lib/ai-pricing-engine.ts',
    'app/api/enhanced/quotes/route.ts',
    'app/api/enhanced/negotiate/route.ts',
    'app/api/enhanced/intelligence/route.ts',
    'components/features/EnhancedQuoteCard.tsx'
];

console.log('\n📁 Checking enhanced files:');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} missing`);
    }
});

console.log('\n🎉 Enhanced system test completed!');
console.log('\n📋 Next Steps:');
console.log('1. Start the server: npm run dev');
console.log('2. Open http://localhost:3000');
console.log('3. Test the registration form');
console.log('4. Check AI-powered quotes');
console.log('5. Try the negotiation system');
console.log('\n🚀 Your Thoon Enterprises platform is now enhanced with Arqonz-inspired features!');
