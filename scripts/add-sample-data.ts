import { db } from '../lib/prisma-db';

async function addSampleData() {
  try {
    console.log('Adding sample data...');

    // Add sample market prices first
    await db.addMarketPrice('Steel', 'TMT Steel', 58000, 'ton', -2.5);
    await db.addMarketPrice('Cement', 'OPC Cement 53', 450, 'bag', 1.2);
    await db.addMarketPrice('AAC_Blocks', 'AAC Blocks 6inch', 85, 'nos', -0.8);
    await db.addMarketPrice('Bricks', 'Red Bricks', 8, 'unit', 0.5);
    await db.addMarketPrice('Sand_Aggregates', 'River Sand', 1200, 'cubic feet', -3.2);

    console.log('Sample market prices added');

    // Create sample users
    const buyer1 = await db.createUser('John Construction', 'john@construction.com', 'password123', 'buyer', {
      phone: '9876543210',
      companyName: 'John Construction Co',
      address: 'Chennai, T. Nagar',
      rating: 4.5,
      experienceYears: 5
    });

    const buyer2 = await db.createUser('XYZ Builders', 'xyz@builders.com', 'password123', 'buyer', {
      phone: '9876543211',
      companyName: 'XYZ Builders Pvt Ltd',
      address: 'Chennai, OMR',
      rating: 4.2,
      experienceYears: 8
    });

    const seller1 = await db.createUser('Steel Supplier', 'steel@supplier.com', 'password123', 'seller', {
      phone: '9876543212',
      companyName: 'Steel Supply Co',
      address: 'Chennai, Ambattur',
      rating: 4.8,
      experienceYears: 10
    });

    console.log('Sample users created');

    // Create sample requirements
    const req1 = await db.createRequirement(
      buyer1.id,
      buyer1.name,
      'TMT Steel 12mm',
      'Steel',
      'TMT',
      10,
      'tons',
      'Chennai, T. Nagar'
    );

    const req2 = await db.createRequirement(
      buyer2.id,
      buyer2.name,
      'OPC Cement 53',
      'Cement',
      'OPC',
      100,
      'bags',
      'Chennai, OMR'
    );

    console.log('Sample requirements created');

    // Create sample quotes
    const quote1 = await db.submitQuote(req1.id, seller1.id, seller1.name, 55000);
    const quote2 = await db.submitQuote(req2.id, seller1.id, seller1.name, 420);

    console.log('Sample quotes created');

    // Create sample orders
    const order1 = await db.createOrder(
      quote1.id,
      '2024-04-10',
      'Chennai, T. Nagar',
      'Deliver to site entrance'
    );

    const order2 = await db.createOrder(
      quote2.id,
      '2024-04-11',
      'Chennai, OMR',
      'Deliver before 10 AM'
    );

    console.log('Sample orders created');

    // Update some orders to different statuses
    await db.updateOrderStatus(order1.id, 'shipped');
    await db.updateOrderStatus(order2.id, 'processing');

    console.log('Sample data added successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
