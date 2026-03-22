#!/bin/bash

# Thoon Enterprises Deployment Script
# This script handles manual deployment with data folder validation

set -e

echo "🚀 Starting Thoon Enterprises Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run from project root."
    exit 1
fi

# Validate data folder exists
print_status "Validating data folder..."
if [ ! -d "data" ]; then
    print_error "Data folder not found!"
    exit 1
fi

if [ ! -f "data/users.json" ]; then
    print_error "users.json not found in data folder!"
    exit 1
fi

if [ ! -f "data/estimates.json" ]; then
    print_error "estimates.json not found in data folder!"
    exit 1
fi

print_status "✅ Data folder validation passed"

# Check admin user
print_status "Validating admin user..."
if grep -q "thoon_admin@org.in" data/users.json; then
    print_status "✅ Admin user found in database"
else
    print_error "Admin user not found in database!"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run tests
print_status "Running database tests..."
npm run test

# Build project
print_status "Building project..."
npm run build

if [ $? -eq 0 ]; then
    print_status "✅ Build successful"
else
    print_error "Build failed!"
    exit 1
fi

# Deploy based on branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_status "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" = "main" ]; then
    print_status "Deploying to production..."
    npm run deploy:prod
elif [ "$CURRENT_BRANCH" = "pre-production" ]; then
    print_status "Deploying to preview..."
    npm run deploy:preview
else
    print_warning "Not on main or pre-production branch. Deploying to preview..."
    npm run deploy:preview
fi

if [ $? -eq 0 ]; then
    print_status "🎉 Deployment successful!"
    print_status "Your application is now live."
    
    if [ "$CURRENT_BRANCH" = "main" ]; then
        echo "🌐 Production URL: https://thoonenterprises.in"
    else
        echo "🌐 Preview URL: Check Vercel dashboard for URL"
    fi
    
    print_status "Admin login: thoon_admin@org.in / Thoon@2026"
else
    print_error "Deployment failed!"
    exit 1
fi
