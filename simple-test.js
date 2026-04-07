// Simple connection test without Prisma client
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('Database connection successful!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();
