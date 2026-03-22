const { db } = require('./lib/db');

try {
    console.log('Testing user creation...');
    const user = db.createUser('Test Buyer', 'test_buyer@thoon.com', 'password123', 'buyer');
    console.log('User created:', user);

    const pending = db.getPendingUsers();
    console.log('Pending users:', pending);
} catch (error) {
    console.error('Error:', error.message);
}
