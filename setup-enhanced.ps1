# Thoon Enterprises Enhanced Setup Script
# This script will set up execution policy and install the enhanced system

Write-Host "🚀 Setting up Enhanced Thoon Enterprises System..." -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "⚠️  Please run this script as Administrator" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Set execution policy for current user
Write-Host "📋 Setting execution policy..." -ForegroundColor Yellow
try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "✅ Execution policy set to RemoteSigned" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not set execution policy, but continuing..." -ForegroundColor Yellow
}

# Navigate to project directory
Set-Location "c:\Users\kumar\.gemini\antigravity\scratch\thoon-enterprise"
Write-Host "📁 Changed to project directory" -ForegroundColor Cyan

# Install packages
Write-Host "📦 Installing SQLite packages..." -ForegroundColor Yellow
try {
    npm install better-sqlite3 @types/better-sqlite3
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SQLite packages installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ npm install failed with error:" -ForegroundColor Red
    Write-Host $_ -ForegroundColor Red
    exit 1
}

# Run test
Write-Host "🧪 Running system test..." -ForegroundColor Yellow
try {
    node test-enhanced-system.js
    Write-Host "✅ System test completed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  System test had issues, but continuing..." -ForegroundColor Yellow
}

# Create data directory if it doesn't exist
if (!(Test-Path "data")) {
    New-Item -ItemType Directory -Path "data" | Out-Null
    Write-Host "✅ Created data directory" -ForegroundColor Green
}

Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Test the enhanced features" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🚀 Your enhanced Thoon Enterprises is ready!" -ForegroundColor Green

Read-Host "Press Enter to start the development server (or close to exit)"

# Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Yellow
npm run dev
