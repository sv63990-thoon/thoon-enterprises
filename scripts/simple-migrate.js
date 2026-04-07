// Simple migration using the working connection pattern
const fs = require('fs');
const path = require('path');

// Import Prisma client using the working pattern from test-db-connection.ts
const { PrismaClient } = require('../lib/generated/prisma/client');

// Create client with explicit configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgres://14c5de5c9fb4965a1e9506e400beaf1b508cff1e8ef504d965e6bf90d16a0f91:sk__P44fleprs8nSHi5_MJWt@db.prisma.io:5432/postgres?sslmode=require'
    }
  }
});

async function simpleMigrate() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connection successful!');
    
    // Read JSON data
    const usersData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf-8'));
    console.log('Found users data:', usersData.users.length, 'users');
    
    // Test creating one user
    if (usersData.users.length > 0) {
      const testUser = usersData.users[0];
      console.log('Creating test user:', testUser.name);
      
      const result = await prisma.user.create({
        data: {
          id: testUser.id,
          name: testUser.name,
          email: testUser.email,
          role: testUser.role,
          status: testUser.status,
          passwordHash: testUser.passwordHash,
          salt: testUser.salt,
        }
      });
      
      console.log('Successfully created user:', result.name);
    }
    
    console.log('Basic migration test completed!');
    
  } catch (error) {
    console.error('Migration error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleMigrate();
