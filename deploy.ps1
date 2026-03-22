# Thoon Enterprises Deployment Script (PowerShell)
# This script handles manual deployment with data folder validation

param(
    [string]$Environment = "auto"
)

Write-Host "🚀 Starting Thoon Enterprises Deployment..." -ForegroundColor Green

# Function to write colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "package.json not found. Please run from project root."
    exit 1
}

# Validate data folder exists
Write-Status "Validating data folder..."
if (-not (Test-Path "data")) {
    Write-Error "Data folder not found!"
    exit 1
}

if (-not (Test-Path "data\users.json")) {
    Write-Error "users.json not found in data folder!"
    exit 1
}

if (-not (Test-Path "data\estimates.json")) {
    Write-Error "estimates.json not found in data folder!"
    exit 1
}

Write-Status "✅ Data folder validation passed"

# Check admin user
Write-Status "Validating admin user..."
$usersContent = Get-Content "data\users.json" -Raw
if ($usersContent -match "thoon_admin@org.in") {
    Write-Status "✅ Admin user found in database"
} else {
    Write-Error "Admin user not found in database!"
    exit 1
}

# Install dependencies
Write-Status "Installing dependencies..."
npm ci

if ($LASTEXITCODE -ne 0) {
    Write-Error "npm install failed!"
    exit 1
}

# Run tests
Write-Status "Running database tests..."
npm run test

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Tests failed, but continuing deployment..."
}

# Build project
Write-Status "Building project..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed!"
    exit 1
}

Write-Status "✅ Build successful"

# Get current branch
try {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Status "Current branch: $currentBranch"
} catch {
    Write-Warning "Could not determine git branch. Assuming preview deployment."
    $currentBranch = "unknown"
}

# Deploy based on branch or parameter
if ($Environment -eq "prod" -or $currentBranch -eq "main") {
    Write-Status "Deploying to production..."
    npm run deploy:prod
} elseif ($Environment -eq "preview" -or $currentBranch -eq "pre-production") {
    Write-Status "Deploying to preview..."
    npm run deploy:preview
} else {
    Write-Status "Auto-detecting environment..."
    if ($currentBranch -eq "main") {
        npm run deploy:prod
    } else {
        npm run deploy:preview
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Status "Your application is now live."
    
    if ($Environment -eq "prod" -or $currentBranch -eq "main") {
        Write-Host "🌐 Production URL: https://thoonenterprises.in" -ForegroundColor Cyan
    } else {
        Write-Host "🌐 Preview URL: Check Vercel dashboard for URL" -ForegroundColor Cyan
    }
    
    Write-Status "Admin login: thoon_admin@org.in / Thoon@2026"
} else {
    Write-Error "Deployment failed!"
    exit 1
}

Write-Host "Deployment completed!" -ForegroundColor Green
