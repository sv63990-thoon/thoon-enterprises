# 🚀 Quick Commands for Enhanced Thoon Enterprises

## ⚡ Option 1: Easiest (Batch File)
Double-click this file:
```
install-enhanced.bat
```

## ⚡ Option 2: PowerShell Script
Right-click this file → "Run with PowerShell" → "Run as Administrator":
```
setup-enhanced.ps1
```

## ⚡ Option 3: Manual Commands

### In PowerShell (as Administrator):
```powershell
# Step 1: Allow scripts
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# Step 2: Go to project
cd "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"

# Step 3: Install packages
npm install better-sqlite3 @types/better-sqlite3

# Step 4: Test system
node test-enhanced-system.js

# Step 5: Start server
npm run dev
```

### In CMD (regular):
```cmd
cd "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"
npm install better-sqlite3 @types/better-sqlite3
node test-enhanced-system.js
npm run dev
```

### In Git Bash:
```bash
cd /c/Users/kumar/.gemini/antigravity/scratch/thoon-enterprise
npm install better-sqlite3 @types/better-sqlite3
node test-enhanced-system.js
npm run dev
```

## 🔍 What to Expect

1. **Installation**: npm will download and install SQLite packages
2. **Test Script**: Will verify all enhanced features are ready
3. **Database**: Will automatically create `data/thoon-enterprise.db`
4. **Server**: Will start at http://localhost:3000

## ✅ Success Indicators

You'll see these messages:
- ✅ "SQLite packages installed successfully!"
- ✅ "All database tables created successfully"
- ✅ "Enhanced system test completed"
- ✅ "Server started at http://localhost:3000"

## 🧪 Test URLs (after server starts)

Open these in your browser:
- Main site: http://localhost:3000
- Register: http://localhost:3000/register
- Market Intelligence: http://localhost:3000/api/enhanced/intelligence?type=market-analysis&category=Cement

## 🆘 Troubleshooting

**If npm fails:**
```cmd
npm cache clean --force
npm install better-sqlite3 @types/better-sqlite3
```

**If port 3000 is busy:**
```cmd
npm run dev -- -p 3001
```

**If database errors:**
```cmd
rmdir /s data
npm run dev
```

---

## 🎯 Recommended Approach

**Easiest:** Double-click `install-enhanced.bat`

**Most Reliable:** Right-click `setup-enhanced.ps1` → Run as Administrator

**Full Control:** Use manual commands in PowerShell

Choose whichever works best for you! 🚀
