const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Database path
const DB_PATH = path.join(__dirname, 'data', 'users.json');

// Password verification function
function verifyPassword(password, salt, hash) {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}

// Test admin login
function testAdminLogin() {
    try {
        // Read database
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        
        // Find admin user
        const adminUser = data.users.find(user => user.email === 'thoon_admin@org.in');
        
        if (!adminUser) {
            console.log('❌ Admin user not found!');
            return;
        }
        
        console.log('📋 Admin User Found:');
        console.log('  Email:', adminUser.email);
        console.log('  Name:', adminUser.name);
        console.log('  Role:', adminUser.role);
        console.log('  Status:', adminUser.status);
        console.log('  Last Login:', adminUser.lastLogin);
        
        // Test password
        const testPassword = 'Thoon@2026';
        const isValid = verifyPassword(testPassword, adminUser.salt, adminUser.passwordHash);
        
        console.log('\n🔐 Password Test:');
        console.log('  Test Password:', testPassword);
        console.log('  Password Valid:', isValid ? '✅ YES' : '❌ NO');
        
        if (isValid) {
            console.log('\n✅ Login should work with these credentials!');
        } else {
            console.log('\n❌ Password verification failed. Need to update password.');
            
            // Update password automatically
            const salt = crypto.randomBytes(32).toString('hex');
            const hash = crypto.pbkdf2Sync(testPassword, salt, 1000, 64, 'sha512').toString('hex');
            
            adminUser.passwordHash = hash;
            adminUser.salt = salt;
            adminUser.lastLogin = new Date().toISOString();
            
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
            
            console.log('🔄 Password has been updated automatically!');
            console.log('✅ Now login should work after redeployment.');
        }
        
    } catch (error) {
        console.error('❌ Error testing login:', error);
    }
}

testAdminLogin();
