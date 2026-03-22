const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function addUser() {
    try {
        const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

        const email = 'thoon_buyer@org.in';
        const password = 'password123';

        if (dbData.users.find(u => u.email === email)) {
            console.log('User already exists!');
            return;
        }

        const { salt, hash } = hashPassword(password);

        const newUser = {
            id: crypto.randomUUID(),
            name: 'Thoon Buyer',
            email: email,
            role: 'buyer',
            status: 'active',
            passwordHash: hash,
            salt: salt
        };

        dbData.users.push(newUser);
        fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));

        console.log(`Successfully added ${email} with password: ${password}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

addUser();
