# 🚀 Deployment Checklist

This checklist ensures your FoodFly app is ready for production deployment.

## ✅ Pre-Deployment Checks

### 1. Environment Variables
- [ ] **Production Environment Variables Set**
  - `MONGODB_URI` - Production database URL
  - `JWT_SECRET` - Secure random string (32+ characters)
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID
  - `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API Key
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay Key ID
  - `RAZORPAY_KEY_SECRET` - Razorpay Secret Key
  - `RAZORPAY_WEBHOOK_SECRET` - Razorpay Webhook Secret
  - `NEXT_PUBLIC_APP_URL` - Your production domain

### 2. Security Configuration
- [ ] **Google OAuth Origins Updated**
  - Add your production domain to Google Cloud Console
  - Include both `https://yourdomain.com` and `https://www.yourdomain.com`
- [ ] **Database Security**
  - MongoDB Atlas network access configured
  - Database user with proper permissions
- [ ] **API Keys Secured**
  - All API keys are environment variables
  - No hardcoded secrets in code

### 3. Build Configuration
- [ ] **Next.js Configuration**
  - `next.config.js` optimized for production
  - Image domains configured
  - Output set to 'standalone' for Docker
- [ ] **Package.json Scripts**
  - `build` script working
  - `start` script configured
  - `dev` script for development

### 4. Code Quality
- [ ] **TypeScript Errors Fixed**
  - Run `npm run type-check`
  - No TypeScript compilation errors
- [ ] **Linting Passed**
  - Run `npm run lint`
  - All linting issues resolved
- [ ] **Build Success**
  - Run `npm run build`
  - Build completes without errors

## 🔧 Deployment Platforms

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

### Docker
```bash
# Build Docker image
docker build -t foodfly-app .

# Run container
docker run -p 3000:3000 foodfly-app
```

### Manual Server
```bash
# Build the app
npm run build

# Start production server
npm start
```

## 🌐 Domain Configuration

### 1. DNS Settings
- [ ] **Domain Pointing to Server**
  - A record pointing to your server IP
  - CNAME for www subdomain
- [ ] **SSL Certificate**
  - HTTPS enabled
  - SSL certificate installed

### 2. Environment Variables on Server
```bash
# Create .env.production file
NODE_ENV=production
MONGODB_URI=your_production_mongodb_url
JWT_SECRET=your_secure_jwt_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
# ... other environment variables
```

## 🔍 Post-Deployment Verification

### 1. Functionality Tests
- [ ] **Homepage Loads**
- [ ] **User Registration/Login**
- [ ] **Google OAuth Works**
- [ ] **Menu Browsing**
- [ ] **Cart Functionality**
- [ ] **Order Placement**
- [ ] **Payment Integration**
- [ ] **Order Tracking**

### 2. Performance Checks
- [ ] **Page Load Speed**
- [ ] **Image Optimization**
- [ ] **Mobile Responsiveness**
- [ ] **API Response Times**

### 3. Security Verification
- [ ] **HTTPS Working**
- [ ] **No Console Errors**
- [ ] **Environment Variables Not Exposed**
- [ ] **API Endpoints Protected**

## 🛠️ Monitoring Setup

### 1. Error Tracking
- [ ] **Sentry Integration** (Optional)
- [ ] **Console Error Monitoring**
- [ ] **API Error Logging**

### 2. Performance Monitoring
- [ ] **Google Analytics**
- [ ] **Core Web Vitals**
- [ ] **Server Response Times**

## 📋 Deployment Commands

### Quick Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Manual Deployment
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build image
docker build -t foodfly-app .

# Run with environment variables
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_url \
  -e JWT_SECRET=your_jwt_secret \
  foodfly-app
```

## 🚨 Common Issues & Solutions

### 1. Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### 2. Environment Variables
- Ensure all required env vars are set
- Check for typos in variable names
- Verify MongoDB connection string

### 3. Google OAuth Issues
- Add production domain to Google Cloud Console
- Wait 5-10 minutes for changes to propagate
- Clear browser cache

### 4. Database Connection
- Verify MongoDB Atlas network access
- Check database user permissions
- Test connection string

## 📞 Support

If you encounter issues during deployment:

1. **Check the logs** for specific error messages
2. **Verify environment variables** are correctly set
3. **Test locally** with production environment variables
4. **Review the deployment platform's documentation**

## ✅ Final Checklist

Before going live:
- [ ] All functionality tested
- [ ] Performance optimized
- [ ] Security verified
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Documentation updated

Your FoodFly app is now ready for production deployment! 🎉 