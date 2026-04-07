@echo off
echo 🚀 Installing Enhanced Thoon Enterprises System...
echo.

REM Change to project directory
cd /d "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"

echo 📦 Installing SQLite packages...
npm install better-sqlite3 @types/better-sqlite3

if %ERRORLEVEL% neq 0 (
    echo ❌ npm install failed
    pause
    exit /b 1
)

echo ✅ SQLite packages installed successfully!

echo.
echo 🧪 Running system test...
node test-enhanced-system.js

echo.
echo 🚀 Starting development server...
echo Server will start at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
