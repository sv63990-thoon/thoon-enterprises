const { db } = require('./lib/db');

async function diagnostic() {
    const email = 'test_buyer@thoon.com';
    const passwords = ['password', 'password123', 'testing', 'buyer123'];

    console.log(`Checking user: ${email}`);
    const userExists = db.findUserByEmail(email);
    if (!userExists) {
        console.log('User not found by email!');
        return;
    }
    console.log('User found. Attempting password validation...');

    for (const pw of passwords) {
        const validated = db.validateUser(email, pw);
        if (validated) {
            console.log(`Matched! Password is: ${pw}`);
            return;
        }
    }
    console.log('No common passwords matched.');
}

// We need to polyfill/handle the 'next/server' and other imports if db.ts has them.
// db.ts only imports fs, path, crypto. It should be runnable in node.
diagnostic();
