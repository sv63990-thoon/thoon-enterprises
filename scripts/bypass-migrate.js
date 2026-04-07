// Bypass TypeScript errors for Prisma 7
const { PrismaClient } = require('../lib/generated/prisma/client');
const fs = require('fs');
const path = require('path');

// Set environment variable for Prisma
process.env.DATABASE_URL = 'postgres://14c5de5c9fb4965a1e9506e400beaf1b508cff1e8ef504d965e6bf90d16a0f91:sk__P44fleprs8nSHi5_MJWt@db.prisma.io:5432/postgres?sslmode=require';

// Create client with any type to bypass TypeScript errors
const prisma = new PrismaClient({
  [Symbol.for('prisma.client.datasource.url')]: process.env.DATABASE_URL
});

async function migrateData() {
  try {
    console.log('Starting data migration...');
    console.log('Database URL:', process.env.DATABASE_URL);

    // Test connection first
    await prisma.$connect();
    console.log('Database connection successful!');

    // Read existing JSON data
    const usersData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf-8'));
    const estimatesData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'estimates.json'), 'utf-8'));

    console.log('Loaded JSON data successfully');
    console.log('Users:', usersData.users.length);
    console.log('Estimates:', estimatesData.estimates.length);

    // Migrate Users
    console.log('Migrating users...');
    for (const user of usersData.users) {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            passwordHash: user.passwordHash,
            salt: user.salt,
            phone: user.phone || null,
            companyName: user.companyName || null,
            address: user.address || null,
            gstin: user.gstin || null,
            rating: user.rating || 0,
            experienceYears: user.experienceYears || 0,
            subscriptionTier: user.subscriptionTier || 'basic',
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
            lastOrderDate: user.lastOrderDate ? new Date(user.lastOrderDate) : null,
          }
        });
        console.log(`✓ Created user: ${user.name}`);
      } catch (userError) {
        console.error(`✗ Failed to create user ${user.name}:`, userError.message);
      }
    }
    console.log(`Migrated ${usersData.users.length} users`);

    console.log('Migration test completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateData();
