const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Database path
const DB_PATH = path.join(__dirname, 'data', 'users.json');

// Password hashing functions
function hashPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

// Update admin password
function updateAdminPassword(newPassword) {
    try {
        // Read current database
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
        
        // Find admin user
        const adminUser = data.users.find(user => user.email === 'thoon_admin@org.in');
        
        if (!adminUser) {
            console.log('Admin user not found!');
            return;
        }
        
        // Hash new password
        const { salt, hash } = hashPassword(newPassword);
        
        // Update password
        adminUser.passwordHash = hash;
        adminUser.salt = salt;
        adminUser.lastLogin = new Date().toISOString();
        
        // Save updated database
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        
        console.log('✅ Admin password updated successfully!');
        console.log('Email: thoon_admin@org.in');
        console.log('New Password:', newPassword);
        console.log('Role:', adminUser.role);
        console.log('Status:', adminUser.status);
        
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

// Update with your desired password
updateAdminPassword('Thoon@2026');
