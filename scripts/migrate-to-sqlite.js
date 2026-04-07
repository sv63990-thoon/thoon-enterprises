const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Paths
const jsonDbPath = path.join(__dirname, '../data/users.json');
const sqliteDbPath = path.join(__dirname, '../data/thoon-enterprise.db');

console.log('🔄 Starting migration from JSON to SQLite...');

try {
    // Read JSON data
    const jsonData = JSON.parse(fs.readFileSync(jsonDbPath, 'utf-8'));
    
    // Initialize SQLite
    const db = new Database(sqliteDbPath);
    
    console.log(`📊 Found ${jsonData.users?.length || 0} users to migrate`);
    
    // Migrate users
    if (jsonData.users && jsonData.users.length > 0) {
        const insertUser = db.prepare(`
            INSERT OR REPLACE INTO users (
                id, name, email, role, status, phone, companyName, address, gstin,
                rating, experienceYears, subscriptionTier, passwordHash, salt,
                lastLogin, lastOrderDate, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        jsonData.users.forEach(user => {
            insertUser.run(
                user.id,
                user.name,
                user.email,
                user.role,
                user.status,
                user.phone || null,
                user.companyName || null,
                user.address || null,
                user.gstin || null,
                user.rating || 0,
                user.experienceYears || 0,
                user.subscriptionTier || 'basic',
                user.passwordHash,
                user.salt,
                user.lastLogin || null,
                user.lastOrderDate || null,
                user.createdAt || new Date().toISOString()
            );
        });
        
        console.log('✅ Users migrated successfully');
    }
    
    // Migrate requirements
    if (jsonData.requirements && jsonData.requirements.length > 0) {
        const insertReq = db.prepare(`
            INSERT OR REPLACE INTO requirements (
                id, buyerId, buyerName, product, category, brand, quantity, unit,
                status, deliveryLocation, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        jsonData.requirements.forEach(req => {
            insertReq.run(
                req.id,
                req.buyerId,
                req.buyerName,
                req.product,
                req.category,
                req.brand,
                req.quantity,
                req.unit,
                req.status,
                req.deliveryLocation || null,
                req.createdAt
            );
        });
        
        console.log('✅ Requirements migrated successfully');
    }
    
    // Migrate quotes
    if (jsonData.quotes && jsonData.quotes.length > 0) {
        const insertQuote = db.prepare(`
            INSERT OR REPLACE INTO quotes (
                id, reqId, sellerId, sellerName, sellerPrice, thoonMargin,
                finalPrice, status, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        jsonData.quotes.forEach(quote => {
            insertQuote.run(
                quote.id,
                quote.reqId,
                quote.sellerId,
                quote.sellerName,
                quote.sellerPrice,
                quote.thoonMargin,
                quote.finalPrice,
                quote.status,
                quote.createdAt
            );
        });
        
        console.log('✅ Quotes migrated successfully');
    }
    
    // Migrate orders
    if (jsonData.orders && jsonData.orders.length > 0) {
        const insertOrder = db.prepare(`
            INSERT OR REPLACE INTO orders (
                id, orderNumber, reqId, quoteId, buyerId, buyerName, sellerId, sellerName,
                product, category, quantity, unit, totalPrice, status, deliveryDate,
                deliveryLocation, deliveryInstructions, rating, feedback, createdAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        jsonData.orders.forEach(order => {
            insertOrder.run(
                order.id,
                order.orderNumber,
                order.reqId,
                order.quoteId,
                order.buyerId,
                order.buyerName,
                order.sellerId,
                order.sellerName,
                order.product,
                order.category,
                order.quantity,
                order.unit,
                order.totalPrice,
                order.status,
                order.deliveryDate,
                order.deliveryLocation,
                order.deliveryInstructions || null,
                order.rating || null,
                order.feedback || null,
                order.createdAt
            );
        });
        
        console.log('✅ Orders migrated successfully');
    }
    
    // Migrate market prices
    if (jsonData.marketPrices && jsonData.marketPrices.length > 0) {
        const insertPrice = db.prepare(`
            INSERT OR REPLACE INTO market_prices (
                id, category, brand, price, unit, change, lastUpdated
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        jsonData.marketPrices.forEach(price => {
            insertPrice.run(
                price.id,
                price.category,
                price.brand,
                price.price,
                price.unit,
                price.change,
                price.lastUpdated
            );
        });
        
        console.log('✅ Market prices migrated successfully');
    }
    
    // Migrate audit logs
    if (jsonData.auditLogs && jsonData.auditLogs.length > 0) {
        const insertLog = db.prepare(`
            INSERT OR REPLACE INTO audit_logs (
                id, userId, userName, action, details, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        jsonData.auditLogs.forEach(log => {
            insertLog.run(
                log.id,
                log.userId,
                log.userName,
                log.action,
                log.details,
                log.timestamp
            );
        });
        
        console.log('✅ Audit logs migrated successfully');
    }
    
    // Migrate margins
    if (jsonData.margins && jsonData.margins.length > 0) {
        const insertMargin = db.prepare(`
            INSERT OR REPLACE INTO margins (category, marginType, value)
            VALUES (?, ?, ?)
        `);
        
        jsonData.margins.forEach(margin => {
            insertMargin.run(margin.category, margin.marginType, margin.value);
        });
        
        console.log('✅ Margins migrated successfully');
    }
    
    // Set order sequence
    if (jsonData.orderSequence) {
        const updateSeq = db.prepare('UPDATE order_sequence SET next_value = ? WHERE id = 1');
        updateSeq.run(jsonData.orderSequence + 1);
        console.log('✅ Order sequence updated');
    }
    
    db.close();
    
    // Backup original JSON file
    const backupPath = jsonDbPath + '.backup';
    fs.copyFileSync(jsonDbPath, backupPath);
    console.log(`💾 Original JSON file backed up to: ${backupPath}`);
    
    console.log('🎉 Migration completed successfully!');
    console.log(`📁 SQLite database created at: ${sqliteDbPath}`);
    console.log('\n📋 Migration Summary:');
    console.log(`   - Users: ${jsonData.users?.length || 0}`);
    console.log(`   - Requirements: ${jsonData.requirements?.length || 0}`);
    console.log(`   - Quotes: ${jsonData.quotes?.length || 0}`);
    console.log(`   - Orders: ${jsonData.orders?.length || 0}`);
    console.log(`   - Market Prices: ${jsonData.marketPrices?.length || 0}`);
    console.log(`   - Audit Logs: ${jsonData.auditLogs?.length || 0}`);
    console.log(`   - Margins: ${jsonData.margins?.length || 0}`);
    
} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
}
