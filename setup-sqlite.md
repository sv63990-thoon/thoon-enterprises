# SQLite Database Setup Guide

## 🎯 **Why SQLite?**
- ✅ **100% Free** - No costs whatsoever
- ✅ **File-based** - Like your current JSON system
- ✅ **Much Faster** - Proper indexing and queries
- ✅ **SQL Support** - Powerful data operations
- ✅ **Scalable** - Handles millions of records
- ✅ **Portable** - Single file backup

## 📦 **Installation Steps**

### 1. Install SQLite Package
```bash
# Open PowerShell/CMD in your project folder
cd "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"

# Install the package
npm install better-sqlite3 @types/better-sqlite3
```

### 2. Run Migration Script
```bash
# Migrate existing JSON data to SQLite
node scripts/migrate-to-sqlite.js
```

### 3. Update Package.json Scripts
Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "migrate": "node scripts/migrate-to-sqlite.js",
    "db:backup": "copy data\\thoon-enterprise.db data\\backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').db",
    "db:view": "sqlite3 data\\thoon-enterprise.db '.tables'"
  }
}
```

## 🗄️ **Database Location**

After setup, your database will be at:
```
c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise\data\thoon-enterprise.db
```

## 🔍 **How to View SQLite Data**

### Option 1: DB Browser for SQLite (Recommended)
1. Download: https://sqlitebrowser.org/
2. Install and open the app
3. Open File: `data/thoon-enterprise.db`
4. Browse all tables and data visually

### Option 2: Command Line
```bash
# Install SQLite CLI (if not installed)
# Download from: https://sqlite.org/download.html

# Open database
sqlite3 data/thoon-enterprise.db

# View tables
.tables

# View users
SELECT * FROM users LIMIT 10;

# Exit
.quit
```

### Option 3: VS Code Extension
1. Install "SQLite" extension by Alexis
2. Open `thoon-enterprise.db` in VS Code
3. Browse tables with GUI

## 📊 **Database Schema**

Your new SQLite database has these tables:

- **users** - User accounts and profiles
- **requirements** - Material requirements from buyers
- **quotes** - Price quotes from sellers
- **orders** - Completed orders
- **market_prices** - Current market prices
- **audit_logs** - System activity logs
- **margins** - Profit margins by category
- **order_sequence** - Auto-incrementing order numbers

## 🔄 **Migration Details**

The migration script will:
1. ✅ Backup your original `users.json` file
2. ✅ Transfer all existing data to SQLite
3. ✅ Maintain all relationships and data integrity
4. ✅ Create proper indexes for performance
5. ✅ Set up auto-incrementing sequences

## 🚀 **Performance Benefits**

| Feature | JSON File | SQLite |
|---------|-----------|---------|
| **Query Speed** | Slow (full file read) | Fast (indexed) |
| **Concurrent Users** | Not supported | Fully supported |
| **Data Integrity** | Manual | Built-in constraints |
| **Backup** | Copy file | Copy file |
| **Scalability** | Limited | Millions of records |
| **Memory Usage** | High | Optimized |

## 🛠️ **Maintenance**

### Backup Database
```bash
# Simple file copy
cp data/thoon-enterprise.db data/backup-$(date +%Y%m%d).db
```

### Check Database Health
```bash
sqlite3 data/thoon-enterprise.db "PRAGMA integrity_check;"
```

### View Database Size
```bash
# Check file size
ls -lh data/thoon-enterprise.db
```

## 🎉 **After Migration**

Your registration system will automatically:
- Use SQLite for all new registrations
- Keep all existing data intact
- Provide much better performance
- Support multiple concurrent users

## 🆘 **Troubleshooting**

### If npm install fails:
```bash
# Try clearing npm cache
npm cache clean --force
npm install better-sqlite3 @types/better-sqlite3
```

### If migration fails:
1. Check if `data/users.json` exists
2. Ensure `data/` folder is writable
3. Check console error messages

### If app doesn't start:
1. Ensure `better-sqlite3` is installed
2. Check if `data/thoon-enterprise.db` exists
3. Restart the development server

---

**🎯 Result: You'll have a production-ready, free database that's much better than JSON files!**
