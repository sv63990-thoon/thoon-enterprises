import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log('Database connection successful!');

    // Test a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database query test passed!');

    // Get database info
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('Database version:', result);

  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
