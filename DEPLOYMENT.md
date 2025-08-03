# Deployment Guide

This guide covers deploying the Unfollow Mini App to various platforms.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. **Connect GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js settings

2. **Set Environment Variables:**
   - Add your environment variables in Vercel dashboard
   - Required variables (see `env.example`)

3. **Automatic Deployments:**
   - Every push to `main` branch triggers deployment
   - Pull requests create preview deployments

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
# Farcaster API Keys
NEXT_PUBLIC_FARCASTER_DEVELOPER_MNEMONIC=your_mnemonic_here
NEXT_PUBLIC_FARCASTER_DEVELOPER_SIGNER_UUID=your_uuid_here

# Neynar API (for enhanced data)
NEYNER_API_KEY=your_neynar_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 📱 GitHub Actions Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to Vercel.

### Setup GitHub Secrets:

1. **Get Vercel Tokens:**
   ```bash
   vercel token list
   ```

2. **Add Secrets in GitHub:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID

## 🌐 Manual Deployment Steps

### 1. Build the Project
```bash
npm run build
```

### 2. Test Locally
```bash
npm start
```

### 3. Deploy
```bash
vercel --prod
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check Node.js version (requires 18+)
   - Ensure all dependencies are installed
   - Verify environment variables are set

2. **Authentication Issues:**
   - Verify Farcaster developer credentials
   - Check API key permissions

3. **Runtime Errors:**
   - Check Vercel function logs
   - Verify API endpoints are working

### Debug Commands:
```bash
# Check build output
npm run build

# Test API routes locally
curl -X POST http://localhost:3000/api/scan

# Check Vercel deployment status
vercel ls
```

## 📊 Monitoring

### Vercel Analytics:
- View deployment status in Vercel dashboard
- Monitor function performance
- Check error logs

### GitHub Actions:
- View workflow runs in Actions tab
- Check deployment logs
- Monitor build status

## 🔄 Continuous Deployment

The app is configured for continuous deployment:

- **Main Branch:** Automatic production deployment
- **Feature Branches:** Preview deployments
- **Pull Requests:** Preview deployments with comments

## 🛡️ Security

### Environment Variables:
- Never commit `.env.local` to git
- Use Vercel's environment variable system
- Rotate API keys regularly

### API Security:
- Rate limiting on API routes
- Input validation
- Error handling without exposing internals

## 📈 Performance Optimization

### Build Optimizations:
- Next.js automatic optimizations
- Image optimization enabled
- Code splitting for better loading

### Runtime Optimizations:
- API response caching
- Efficient database queries
- Minimal bundle size

## 🎯 Production Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] API keys valid and working
- [ ] Build passes locally
- [ ] Tests passing
- [ ] Error handling implemented
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Monitoring configured

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Farcaster Developer Portal](https://docs.farcaster.xyz/) 