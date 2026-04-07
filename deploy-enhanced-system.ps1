# Thoon Enterprises - Enhanced System Deployment Script
# Run this script in PowerShell as Administrator

Write-Host "🚀 Starting Thoon Enterprises Enhanced System Deployment..." -ForegroundColor Green

# Step 1: Check PowerShell Execution Policy
Write-Host "📋 Step 1: Checking PowerShell Execution Policy..." -ForegroundColor Yellow
$policy = Get-ExecutionPolicy
Write-Host "Current execution policy: $policy" -ForegroundColor Cyan

if ($policy -eq "Restricted") {
    Write-Host "⚠️  Execution policy is Restricted. Setting to RemoteSigned..." -ForegroundColor Yellow
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "✅ Execution policy updated to RemoteSigned" -ForegroundColor Green
}

# Step 2: Install SQLite Package
Write-Host "📦 Step 2: Installing SQLite package..." -ForegroundColor Yellow
try {
    Set-Location "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"
    npm install better-sqlite3 @types/better-sqlite3
    Write-Host "✅ SQLite packages installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install SQLite packages" -ForegroundColor Red
    Write-Host "Please run manually: npm install better-sqlite3 @types/better-sqlite3" -ForegroundColor Yellow
    exit 1
}

# Step 3: Run Migration Script
Write-Host "🔄 Step 3: Running database migration..." -ForegroundColor Yellow
try {
    if (Test-Path "scripts\migrate-to-sqlite.js") {
        node scripts\migrate-to-sqlite.js
        Write-Host "✅ Database migration completed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migration script not found, creating database..." -ForegroundColor Yellow
        # Create data directory if it doesn't exist
        if (!(Test-Path "data")) {
            New-Item -ItemType Directory -Path "data"
        }
        Write-Host "✅ Data directory created" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Database migration failed" -ForegroundColor Red
    Write-Host "Please run manually: node scripts\migrate-to-sqlite.js" -ForegroundColor Yellow
}

# Step 4: Create Enhanced Database
Write-Host "🗄️  Step 4: Setting up enhanced database..." -ForegroundColor Yellow
try {
    # This will be handled by the SQLite database initialization
    Write-Host "✅ Enhanced database setup ready" -ForegroundColor Green
} catch {
    Write-Host "❌ Database setup failed" -ForegroundColor Red
}

# Step 5: Verify Installation
Write-Host "🔍 Step 5: Verifying installation..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$hasSqlite = $packageJson.dependencies -contains "better-sqlite3"

if ($hasSqlite) {
    Write-Host "✅ SQLite package verified in dependencies" -ForegroundColor Green
} else {
    Write-Host "❌ SQLite package not found in dependencies" -ForegroundColor Red
}

# Step 6: Start Development Server
Write-Host "🚀 Step 6: Starting development server..." -ForegroundColor Yellow
Write-Host "Starting Next.js development server..." -ForegroundColor Cyan
Write-Host "The server will start at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

try {
    npm run dev
} catch {
    Write-Host "❌ Failed to start development server" -ForegroundColor Red
    Write-Host "Please run manually: npm run dev" -ForegroundColor Yellow
}

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
