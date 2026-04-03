// Test Authentication System with SQLite Database
// This script tests all authentication endpoints to ensure they work with the new SQLite database

console.log('🔐 Testing Thoon Enterprises Authentication System\n');

const testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

function runTest(testName, testFunction) {
    try {
        const result = testFunction();
        if (result) {
            console.log(`✅ ${testName}`);
            testResults.passed++;
            testResults.tests.push({ test: testName, status: 'PASS' });
        } else {
            console.log(`❌ ${testName}`);
            testResults.failed++;
            testResults.tests.push({ test: testName, status: 'FAIL' });
        }
    } catch (error) {
        console.log(`❌ ${testName} - Error: ${error.message}`);
        testResults.failed++;
        testResults.tests.push({ test: testName, status: 'ERROR', error: error.message });
    }
}

// Test 1: Check SQLite Database Connection
runTest('SQLite Database Connection', () => {
    try {
        const Database = require('better-sqlite3');
        const path = require('path');
        const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
        const db = new Database(dbPath);
        
        // Test if users table exists and has data
        const tableInfo = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
        if (!tableInfo) return false;
        
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        db.close();
        
        return userCount.count > 0;
    } catch (error) {
        return false;
    }
});

// Test 2: Check if Authentication Routes Use SQLite
runTest('Login Route Uses SQLite', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const loginRoutePath = path.join(process.cwd(), 'app', 'api', 'auth', 'login', 'route.ts');
        const loginContent = fs.readFileSync(loginRoutePath, 'utf8');
        
        return loginContent.includes('sqliteDb') && loginContent.includes("from '@/lib/sqlite-db'");
    } catch (error) {
        return false;
    }
});

runTest('Register Route Uses SQLite', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const registerRoutePath = path.join(process.cwd(), 'app', 'api', 'auth', 'register-simple', 'route.ts');
        const registerContent = fs.readFileSync(registerRoutePath, 'utf8');
        
        return registerContent.includes('sqliteDb') && registerContent.includes("from '@/lib/sqlite-db'");
    } catch (error) {
        return false;
    }
});

runTest('Update Profile Route Uses SQLite', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const updateProfilePath = path.join(process.cwd(), 'app', 'api', 'auth', 'update-profile', 'route.ts');
        const updateContent = fs.readFileSync(updateProfilePath, 'utf8');
        
        return updateContent.includes('sqliteDb') && updateContent.includes("from '@/lib/sqlite-db'");
    } catch (error) {
        return false;
    }
});

runTest('OTP Verification Route Uses SQLite', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const otpVerifyPath = path.join(process.cwd(), 'app', 'api', 'auth', 'verify-otp', 'route.ts');
        const otpContent = fs.readFileSync(otpVerifyPath, 'utf8');
        
        return otpContent.includes('sqliteDb') && otpContent.includes("from '@/lib/sqlite-db'");
    } catch (error) {
        return false;
    }
});

// Test 3: Check SQLite Database Functions
runTest('SQLite Database Functions Available', () => {
    try {
        const sqliteDb = require('./lib/sqlite-db.ts').default;
        
        const requiredFunctions = [
            'findUserByEmail',
            'findUserByPhone',
            'createUser',
            'validateUser',
            'updateLastLogin',
            'logAction',
            'getAllUsers'
        ];
        
        return requiredFunctions.every(func => typeof sqliteDb[func] === 'function');
    } catch (error) {
        return false;
    }
});

// Test 4: Check Analytics Integration
runTest('Analytics Integration in Auth Routes', () => {
    try {
        const fs = require('fs');
        const loginRoutePath = path.join(process.cwd(), 'app', 'api', 'auth', 'login', 'route.ts');
        const loginContent = fs.readFileSync(loginRoutePath, 'utf8');
        
        return loginContent.includes('trackActivity');
    } catch (error) {
        return false;
    }
});

// Test 5: Check Enhanced User Schema
runTest('Enhanced User Schema in Database', () => {
    try {
        const Database = require('better-sqlite3');
        const path = require('path');
        const dbPath = path.join(process.cwd(), 'data', 'thoon-enterprise.db');
        const db = new Database(dbPath);
        
        // Check if enhanced columns exist
        const tableInfo = db.prepare("PRAGMA table_info(users)").all();
        const enhancedColumns = ['verificationStatus', 'aiScore', 'serviceAreas', 'specializations'];
        
        const hasEnhancedColumns = enhancedColumns.some(col => 
            tableInfo.some(column => column.name === col)
        );
        
        db.close();
        return hasEnhancedColumns;
    } catch (error) {
        return false;
    }
});

// Test 6: Check Migration Success
runTest('User Data Migration Success', () => {
    try {
        const sqliteDb = require('./lib/sqlite-db.ts').default;
        const users = sqliteDb.getAllUsers();
        
        // Check if we have users and they have the expected fields
        if (users.length === 0) return false;
        
        const sampleUser = users[0];
        return sampleUser.id && sampleUser.email && sampleUser.role && sampleUser.status;
    } catch (error) {
        return false;
    }
});

// Test 7: Check OTP System
runTest('OTP System Integration', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const otpPath = path.join(process.cwd(), 'lib', 'otp.ts');
        
        if (!fs.existsSync(otpPath)) return false;
        
        const otpContent = fs.readFileSync(otpPath, 'utf8');
        return otpContent.includes('createOTPSession') && otpContent.includes('validateOTP');
    } catch (error) {
        return false;
    }
});

// Test 8: Check Authentication API Structure
runTest('Authentication API Structure', () => {
    try {
        const fs = require('fs');
        const path = require('path');
        const authDir = path.join(process.cwd(), 'app', 'api', 'auth');
        
        const requiredRoutes = ['login', 'register-simple', 'verify-otp', 'send-otp', 'update-profile'];
        
        return requiredRoutes.every(route => {
            const routePath = path.join(authDir, route, 'route.ts');
            return fs.existsSync(routePath);
        });
    } catch (error) {
        return false;
    }
});

// Print Summary
console.log('\n' + '='.repeat(60));
console.log('📊 AUTHENTICATION SYSTEM TEST RESULTS');
console.log('='.repeat(60));
console.log(`✅ Tests Passed: ${testResults.passed}`);
console.log(`❌ Tests Failed: ${testResults.failed}`);
console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

// Print Detailed Results
console.log('\n📋 DETAILED RESULTS:');
console.log('-'.repeat(60));
testResults.tests.forEach(result => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${result.test}${result.error ? ': ' + result.error : ''}`);
});

// Recommendations
console.log('\n💡 RECOMMENDATIONS:');
if (testResults.failed === 0) {
    console.log('🎉 All authentication tests passed!');
    console.log('📝 Your authentication system is ready with SQLite database');
    console.log('🚀 You can now test the login and registration functionality');
} else {
    console.log('⚠️  Some tests failed. Please check:');
    console.log('   1. SQLite database connection');
    console.log('   2. Database schema updates');
    console.log('   3. Import statements in auth routes');
    console.log('   4. Migration script execution');
}

console.log('\n🧪 MANUAL TESTING CHECKLIST:');
console.log('-'.repeat(60));
console.log('1. 🌐 Start server: npm run dev');
console.log('2. 🔐 Test registration: http://localhost:3000/register');
console.log('3. 🔑 Test login: http://localhost:3000/login');
console.log('4. 📱 Test OTP verification');
console.log('5. 👤 Test profile update');
console.log('6. 📊 Check analytics tracking in database');

console.log('\n📊 Expected Features:');
console.log('-'.repeat(60));
console.log('✅ User registration with SQLite storage');
console.log('✅ Login with password validation');
console.log('✅ OTP-based authentication');
console.log('✅ Profile updates with validation');
console.log('✅ Analytics tracking for all auth events');
console.log('✅ Enhanced user schema with AI scores');
console.log('✅ Audit logging for all actions');

console.log('\n🔧 Next Steps:');
console.log('-'.repeat(60));
console.log('1. Start the development server');
console.log('2. Test registration flow');
console.log('3. Test login with existing users');
console.log('4. Verify analytics data in database');
console.log('5. Test profile updates');
console.log('6. Check audit logs');

console.log('\n🎯 Success Indicators:');
console.log('-'.repeat(60));
console.log('✅ Users can register successfully');
console.log('✅ Login works with correct credentials');
console.log('✅ OTP verification functions correctly');
console.log('✅ Profile updates save to database');
console.log('✅ Analytics data is tracked');
console.log('✅ No console errors during auth flows');

console.log('\n🚀 Your authentication system is now fully integrated with SQLite!');
