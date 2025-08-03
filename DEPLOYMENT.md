# Deployment Guide - Unfollow Mini App

## 🚀 **Deploy to Vercel**

### **1. Prepare for Deployment**

#### **Build Test:**
```bash
npm run build
```

#### **Environment Variables:**
Make sure these are set in Vercel:
- `NEYNAR_API_KEY=BD9B92A0-6451-4284-B376-8CC521C01754`
- `NEYNAR_SIGNER_UUID=8c23047d-185d-462e-96a7-c70826ad8340`

### **2. Deploy to Vercel**

#### **Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: unfollow-mini-app
# - Directory: ./
# - Override settings? No
```

#### **Option B: GitHub + Vercel Dashboard**
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

### **3. Environment Variables Setup**

In Vercel Dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add:
   ```
   NEYNAR_API_KEY=BD9B92A0-6451-4284-B376-8CC521C01754
   NEYNAR_SIGNER_UUID=8c23047d-185d-462e-96a7-c70826ad8340
   ```

### **4. Custom Domain (Optional)**

1. Go to Vercel Dashboard
2. Domains section
3. Add your domain
4. Configure DNS

## 📋 **Pre-Deployment Checklist**

- [ ] **Build Success** - `npm run build` works
- [ ] **Environment Variables** - Set in Vercel
- [ ] **API Keys** - Valid Neynar credentials
- [ ] **Testing** - All functionality works locally
- [ ] **Responsive** - Mobile/desktop tested
- [ ] **Dark Mode** - Light/dark themes work

## 🔧 **Post-Deployment Testing**

### **1. Basic Functionality**
- [ ] App loads without errors
- [ ] Dark mode toggle works
- [ ] Scan functionality works
- [ ] Unfollow functionality works

### **2. API Testing**
```bash
# Test production API
curl -X POST "https://your-app.vercel.app/api/scan" \
  -H "Content-Type: application/json" \
  -d '{"fid": "3"}' | jq .
```

### **3. Cross-Browser Testing**
- [ ] Chrome
- [ ] Firefox  
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## 🎯 **Production Features**

### **✅ What's Working:**
- Real Neynar API integration
- Dark/light mode toggle
- Responsive design
- Interactive unfollow functionality
- Error handling
- Loading states

### **🔮 Future Enhancements:**
- Real Farcaster authentication
- Actual unfollow operations
- Database integration
- User preferences
- Analytics dashboard

## 📊 **Monitoring**

### **Vercel Analytics:**
- Page views
- Performance metrics
- Error tracking

### **API Monitoring:**
- Neynar API usage
- Rate limiting
- Error responses

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Build Failures**
   - Check TypeScript errors
   - Verify all imports
   - Test locally first

2. **API Errors**
   - Verify environment variables
   - Check Neynar API key
   - Test API endpoints

3. **Styling Issues**
   - Check Tailwind CSS
   - Verify dark mode classes
   - Test responsive breakpoints

## 🎉 **Success Metrics**

- [ ] App deploys successfully
- [ ] All functionality works in production
- [ ] Mobile/desktop responsive
- [ ] Dark mode toggle works
- [ ] API calls succeed
- [ ] No console errors

## 📞 **Support**

If you encounter issues:
1. Check Vercel logs
2. Test API endpoints
3. Verify environment variables
4. Check browser console for errors 