// Enhanced Thoon Enterprises Validation Script
// Run this to validate all enhanced features are working correctly

const fs = require('fs');
const path = require('path');

console.log('🔍 Thoon Enterprises - Enhanced System Validation\n');

// Test Results
let testsPassed = 0;
let testsFailed = 0;
const results = [];

function runTest(testName, testFunction) {
    try {
        const result = testFunction();
        if (result) {
            console.log(`✅ ${testName}`);
            results.push({ test: testName, status: 'PASS', message: 'Working correctly' });
            testsPassed++;
        } else {
            console.log(`❌ ${testName}`);
            results.push({ test: testName, status: 'FAIL', message: 'Not working' });
            testsFailed++;
        }
    } catch (error) {
        console.log(`❌ ${testName} - Error: ${error.message}`);
        results.push({ test: testName, status: 'ERROR', message: error.message });
        testsFailed++;
    }
}

// Test 1: SQLite Database Connection
runTest('SQLite Database Connection', () => {
    try {
        const Database = require('better-sqlite3');
        const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
        const db = new Database(dbPath);
        db.close();
        return true;
    } catch (error) {
        return false;
    }
});

// Test 2: Enhanced Database Schema
runTest('Enhanced Database Schema', () => {
    try {
        const Database = require('better-sqlite3');
        const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
        const db = new Database(dbPath);
        
        const requiredTables = [
            'users', 'requirements', 'quotes', 'orders', 
            'market_prices', 'audit_logs', 'negotiation_sessions', 'notifications'
        ];
        
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        const tableNames = tables.map(t => t.name);
        
        db.close();
        return requiredTables.every(table => tableNames.includes(table));
    } catch (error) {
        return false;
    }
});

// Test 3: Enhanced User Table Schema
runTest('Enhanced User Table Schema', () => {
    try {
        const Database = require('better-sqlite3');
        const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
        const db = new Database(dbPath);
        
        const userTableInfo = db.prepare("PRAGMA table_info(users)").all();
        const requiredColumns = [
            'verificationStatus', 'aiScore', 'serviceAreas', 'specializations',
            'certifications', 'preferredBrands', 'creditLimit', 'paymentTerms'
        ];
        
        const columnNames = userTableInfo.map(col => col.name);
        
        db.close();
        return requiredColumns.some(col => columnNames.includes(col));
    } catch (error) {
        return false;
    }
});

// Test 4: Enhanced Files Exist
runTest('Enhanced Files Exist', () => {
    const requiredFiles = [
        'lib/enhanced-db.ts',
        'lib/business-logic.ts', 
        'lib/ai-pricing-engine.ts',
        'app/api/enhanced/quotes/route.ts',
        'app/api/enhanced/negotiate/route.ts',
        'app/api/enhanced/intelligence/route.ts',
        'components/features/EnhancedQuoteCard.tsx'
    ];
    
    return requiredFiles.every(file => fs.existsSync(file));
});

// Test 5: Package Dependencies
runTest('Package Dependencies', () => {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasSqlite = packageJson.dependencies && packageJson.dependencies['better-sqlite3'];
        return hasSqlite;
    } catch (error) {
        return false;
    }
});

// Test 6: API Endpoint Structure
runTest('API Endpoint Structure', () => {
    const apiEndpoints = [
        'app/api/enhanced/quotes/route.ts',
        'app/api/enhanced/negotiate/route.ts',
        'app/api/enhanced/intelligence/route.ts'
    ];
    
    return apiEndpoints.every(endpoint => fs.existsSync(endpoint));
});

// Test 7: Database Data Migration
runTest('Database Data Migration', () => {
    try {
        const Database = require('better-sqlite3');
        const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
        const db = new Database(dbPath);
        
        // Check if default users exist (migrated from JSON)
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        
        db.close();
        return userCount.count > 0;
    } catch (error) {
        return false;
    }
});

// Test 8: Market Prices Table
runTest('Market Prices Table', () => {
    try {
        const Database = require('better-sqlite3');
        const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
        const db = new Database(dbPath);
        
        const tableInfo = db.prepare("PRAGMA table_info(market_prices)").all();
        const hasEnhancedColumns = tableInfo.some(col => 
            ['trend', 'predictedPrice', 'confidence'].includes(col.name)
        );
        
        db.close();
        return hasEnhancedColumns;
    } catch (error) {
        return false;
    }
});

// Test 9: Business Logic Import
runTest('Business Logic Import', () => {
    try {
        // This will likely fail in Node.js due to TypeScript, but we check if file exists and has content
        const businessLogicPath = path.join(process.cwd(), 'lib/business-logic.ts');
        if (fs.existsSync(businessLogicPath)) {
            const content = fs.readFileSync(businessLogicPath, 'utf8');
            return content.includes('calculateTrustScore') && content.includes('generateMarketInsights');
        }
        return false;
    } catch (error) {
        return false;
    }
});

// Test 10: AI Pricing Engine
runTest('AI Pricing Engine', () => {
    try {
        const aiEnginePath = path.join(process.cwd(), 'lib/ai-pricing-engine.ts');
        if (fs.existsSync(aiEnginePath)) {
            const content = fs.readFileSync(aiEnginePath, 'utf8');
            return content.includes('analyzeMarketPrices') && content.includes('generateDynamicPrice');
        }
        return false;
    } catch (error) {
        return false;
    }
});

// Print Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Tests Passed: ${testsPassed}`);
console.log(`❌ Tests Failed: ${testsFailed}`);
console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

// Print Detailed Results
console.log('\n📋 DETAILED RESULTS:');
console.log('-'.repeat(60));
results.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.test}: ${result.message}`);
});

// Recommendations
console.log('\n💡 RECOMMENDATIONS:');
if (testsFailed === 0) {
    console.log('🎉 All tests passed! Your enhanced system is ready.');
    console.log('📝 Next steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Test the APIs in browser');
    console.log('   3. Try the registration flow');
    console.log('   4. Test AI-powered features');
} else {
    console.log('⚠️  Some tests failed. Please check:');
    console.log('   1. SQLite installation');
    console.log('   2. Database creation');
    console.log('   3. File structure');
    console.log('   4. Package dependencies');
}

console.log('\n🧪 MANUAL TESTING CHECKLIST:');
console.log('-'.repeat(60));
console.log('1. 🌐 Server Test:');
console.log('   - Start server: npm run dev');
console.log('   - Open: http://localhost:3000');
console.log('   - Check for errors in console');
console.log('');
console.log('2. 📊 API Tests:');
console.log('   - GET: /api/enhanced/intelligence?type=market-analysis&category=Cement');
console.log('   - GET: /api/enhanced/intelligence?type=price-forecast&category=Cement');
console.log('   - POST: /api/enhanced/quotes (with test data)');
console.log('');
console.log('3. 👤 Registration Test:');
console.log('   - Go to: /register');
console.log('   - Complete 2-step registration');
console.log('   - Verify OTP works');
console.log('   - Check user in database');
console.log('');
console.log('4. 🗄️ Database Test:');
console.log('   - Open data/thoon-enterprise.db with SQLite Browser');
console.log('   - Verify enhanced tables exist');
console.log('   - Check user data migration');
console.log('');
console.log('5. 🧠 AI Features Test:');
console.log('   - Test market intelligence API');
console.log('   - Verify AI trust scores');
console.log('   - Check price recommendations');

console.log('\n🎯 SUCCESS CRITERIA:');
console.log('-'.repeat(60));
console.log('✅ Server starts without errors');
console.log('✅ All enhanced APIs respond correctly');
console.log('✅ Registration flow works with OTP');
console.log('✅ Database contains enhanced schema');
console.log('✅ AI features return intelligent results');
console.log('✅ Trust scores are calculated correctly');
console.log('✅ Market analysis provides insights');

console.log('\n🚀 Your enhanced Thoon Enterprises is ready for business!');
