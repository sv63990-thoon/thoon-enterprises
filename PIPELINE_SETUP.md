# GitHub Actions CI/CD Pipeline Setup

## Overview
This pipeline automatically deploys your Thoon Enterprises application to Vercel whenever you push to GitHub.

## Setup Instructions

### 1. Get Vercel Credentials
1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Create a new token: **Create Token** → Name: `GitHub Actions` → Copy token
3. Go to Vercel Project → Settings → General → Copy **Project ID** and **Organization ID**

### 2. Add GitHub Secrets
1. Go to your GitHub repository: `sv63990-thoon/thoon-enterprises`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - `VERCEL_TOKEN`: (paste Vercel token)
   - `ORG_ID`: (paste Vercel organization ID)
   - `PROJECT_ID`: (paste Vercel project ID)

### 3. Push to Trigger Pipeline
```bash
git add .
git commit -m "Setup CI/CD pipeline with GitHub Actions"
git push
```

## Pipeline Features

### Automatic Triggers:
- **Push to main** → Production deployment
- **Push to pre-production** → Preview deployment
- **Pull requests** → Preview deployment
- **Manual dispatch** → On-demand deployment

### Pipeline Steps:
1. ✅ Checkout code
2. ✅ Setup Node.js 18
3. ✅ Install dependencies
4. ✅ Verify data folder exists
5. ✅ Test database connection
6. ✅ Deploy to Vercel

### Environment Variables:
- Production: `https://thoonenterprises.in`
- Preview: `https://thoon-enterprises-xyz.vercel.app`

## Monitoring

### Check Pipeline Status:
- Go to GitHub repository → **Actions** tab
- See running/completed deployments
- View logs and error messages

### Deployment URLs:
- Production: `https://thoonenterprises.in`
- Preview: Available in Actions logs

## Commands

### Manual Deployment:
```bash
# Production
npm run deploy:prod

# Preview
npm run deploy:preview

# Validate before deployment
npm run validate
```

### Branch Strategy:
```bash
# Development work
git checkout pre-production
git add .
git commit -m "Feature updates"
git push

# Production deployment
git checkout main
git merge pre-production
git push
```

## Troubleshooting

### Common Issues:
1. **Secrets not set** → Add Vercel credentials to GitHub Secrets
2. **Data folder missing** → Check vercel.json includedFiles configuration
3. **Build failures** → Check Actions logs for error details
4. **Domain not working** → Verify DNS settings in GoDaddy

### Debug Steps:
1. Check GitHub Actions logs
2. Verify Vercel deployment status
3. Test with preview deployment first
4. Check data folder contents in pipeline

## Benefits

✅ **Automatic deployments** on every push
✅ **Data folder included** in every deployment
✅ **Environment-specific URLs** (prod vs preview)
✅ **Build validation** before deployment
✅ **Rollback capability** via Vercel dashboard
✅ **Pipeline monitoring** and logging

## Next Steps

1. Add Vercel credentials to GitHub Secrets
2. Push code to trigger pipeline
3. Monitor deployment in GitHub Actions
4. Test deployed application
5. Configure custom domain `thoonenterprises.in`
