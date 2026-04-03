# 🚀 Thoon Enterprises Enhanced System Deployment

## ⚡ Quick Start (3 Commands)

Run these commands in PowerShell/CMD as Administrator:

```powershell
# 1. Allow script execution (if needed)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 2. Install SQLite packages
cd "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"
npm install better-sqlite3 @types/better-sqlite3

# 3. Start the enhanced system
npm run dev
```

---

## 📋 Detailed Deployment Steps

### **Step 1: Prepare PowerShell Environment**

1. **Open PowerShell as Administrator**
   - Right-click Start → PowerShell (Admin)
   - Or search for PowerShell, right-click → Run as administrator

2. **Set Execution Policy** (if needed)
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
   ```

3. **Navigate to Project Directory**
   ```powershell
   cd "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"
   ```

### **Step 2: Install SQLite Packages**

```powershell
npm install better-sqlite3 @types/better-sqlite3
```

**If you get an error about execution policy:**
```powershell
# Try this alternative method
npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"
npm install better-sqlite3 @types/better-sqlite3
```

### **Step 3: Migrate Existing Data**

```powershell
# Run the migration script
node scripts/migrate-to-sqlite.js
```

**If migration script doesn't exist:**
```powershell
# Create data directory
mkdir data
# The system will automatically create the SQLite database
```

### **Step 4: Verify Installation**

Check that these files exist:
- `node_modules/better-sqlite3/` ✅
- `data/thoon-enterprise.db` ✅ (will be created automatically)
- `lib/sqlite-db.ts` ✅
- `lib/enhanced-db.ts` ✅

### **Step 5: Start Enhanced System**

```powershell
npm run dev
```

The server will start at: **http://localhost:3000**

---

## 🔧 Alternative Installation Methods

### **Method 1: Using Git Bash**
1. Open Git Bash
2. Navigate to project: `cd /c/Users/kumar/.gemini/antigravity/scratch/thoon-enterprise`
3. Install: `npm install better-sqlite3 @types/better-sqlite3`
4. Start: `npm run dev`

### **Method 2: Using Command Prompt**
1. Open CMD as Administrator
2. Navigate: `cd "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"`
3. Install: `npm install better-sqlite3 @types/better-sqlite3`
4. Start: `npm run dev`

### **Method 3: Manual PowerShell Script**
1. Right-click `deploy-enhanced-system.ps1`
2. Select "Run with PowerShell"
3. Follow the prompts

---

## 🗄️ Database Setup

### **Automatic Setup**
The enhanced system will automatically:
- Create `data/thoon-enterprise.db` if it doesn't exist
- Set up all required tables
- Migrate existing JSON data
- Initialize default values

### **Manual Database Check**
```sql
-- Open database with SQLite Browser or command line
sqlite3 data/thoon-enterprise.db

-- Check tables
.tables

-- Check users
SELECT COUNT(*) FROM users;

-- Exit
.quit
```

---

## 🧪 Testing the Enhanced Features

### **1. Test AI-Powered Quotes**
Visit: `http://localhost:3000/api/enhanced/quotes`
```json
{
  "requirementId": "test-req-1",
  "sellerId": "test-seller-1"
}
```

### **2. Test Market Intelligence**
Visit: `http://localhost:3000/api/enhanced/intelligence?type=market-analysis&category=Cement&location=Chennai`

### **3. Test Negotiation System**
Visit: `http://localhost:3000/api/enhanced/negotiate`

---

## 🔍 Troubleshooting

### **Common Issues & Solutions**

#### **Issue: "Cannot load npm"**
```powershell
# Solution: Restart PowerShell and try again
# Or use this command:
npm config set script-shell powershell
```

#### **Issue: "better-sqlite3 installation failed"**
```powershell
# Solution: Clear npm cache and retry
npm cache clean --force
npm install better-sqlite3 @types/better-sqlite3
```

#### **Issue: "Database not found"**
```powershell
# Solution: Create data directory manually
mkdir data
# The database will be created automatically on first run
```

#### **Issue: "Port 3000 already in use"**
```powershell
# Solution: Kill existing process or use different port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
# Or use: npm run dev -- -p 3001
```

#### **Issue: "Module not found"**
```powershell
# Solution: Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📊 Verification Checklist

### **✅ Pre-Launch Checklist**
- [ ] SQLite packages installed successfully
- [ ] Database created and accessible
- [ ] Migration completed (if upgrading from JSON)
- [ ] Development server starts without errors
- [ ] Enhanced API endpoints respond correctly
- [ ] Frontend components load properly
- [ ] AI features are functional

### **✅ Post-Launch Testing**
- [ ] User registration works with OTP
- [ ] Quote generation includes AI insights
- [ ] Negotiation system functions correctly
- [ ] Market intelligence displays properly
- [ ] Trust scores calculate correctly
- [ ] Commission tracking works

---

## 🚀 Going Live

### **Production Deployment**
```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Environment Variables**
Create `.env.local` file:
```env
NODE_ENV=production
DATABASE_URL=./data/thoon-enterprise.db
AI_API_KEY=your_ai_api_key
JWT_SECRET=your_jwt_secret
```

---

## 📞 Support

If you encounter issues:

1. **Check the console** for error messages
2. **Verify file permissions** on the data directory
3. **Ensure Node.js version** is 18+ (`node --version`)
4. **Check available disk space** (at least 1GB recommended)
5. **Restart the server** after any configuration changes

---

## 🎉 Success Indicators

You'll know the deployment is successful when:

- ✅ Server starts at `http://localhost:3000`
- ✅ Database file appears in `data/` folder
- ✅ Registration form works with new features
- ✅ Enhanced quote cards display AI insights
- ✅ Market intelligence loads correctly
- ✅ No console errors on page load

**🚀 Your enhanced Thoon Enterprises platform is now live with Arqonz-inspired features!**
