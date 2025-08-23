# 🔐 Google OAuth Setup Guide

This guide will help you fix the Google OAuth 403 errors and configuration issues.

## 🚨 Current Issues

You're experiencing these errors:
- `403 Forbidden` when loading Google OAuth
- `The given origin is not allowed for the given client ID`
- `Provided button width is invalid: 100%`

## 🔧 Quick Fix Steps

### Step 1: Update Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID or create a new one

### Step 2: Configure Authorized JavaScript Origins

In your OAuth 2.0 Client ID settings, add these **Authorized JavaScript origins**:

```
http://localhost:3000
https://your-domain.com
https://*.vercel.app
https://*.netlify.app
```

**Important**: Replace `your-domain.com` with your actual domain.

### Step 3: Configure Authorized Redirect URIs

Add these **Authorized redirect URIs**:

```
http://localhost:3000
http://localhost:3000/
https://your-domain.com
https://your-domain.com/
```

### Step 4: Update Environment Variables

Create or update your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### Step 5: Restart Your Development Server

```bash
npm run dev
```

## 🔍 Troubleshooting

### If you still get 403 errors:

1. **Check your domain**: Make sure your current domain is in the authorized origins
2. **Clear browser cache**: Hard refresh (Ctrl+F5) or clear browser cache
3. **Check environment variables**: Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
4. **Verify project**: Make sure you're using the correct Google Cloud project

### If you get "Invalid button width" warning:

This is just a warning and doesn't affect functionality. The button width has been fixed in the code.

## 🛠️ Alternative: Disable Google OAuth Temporarily

If you want to disable Google OAuth temporarily while fixing the configuration:

1. The app will automatically show a fallback message when Google OAuth fails
2. Users can still login with email/password
3. The "Try Google again" button allows retrying

## 📝 Environment Variables Reference

```env
# Required for Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Optional: Google Maps (separate from OAuth)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key_here
```

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Library](https://www.npmjs.com/package/@react-oauth/google)

## ✅ Verification

After following these steps:

1. Google OAuth should work without 403 errors
2. The button width warning should be gone
3. Users should be able to login with Google
4. Authentication should persist properly (no more logout issues)

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check the browser console for specific error messages
2. Verify your Google Cloud project has billing enabled
3. Ensure the OAuth consent screen is configured
4. Check that the Google+ API is enabled (if required)

The app includes fallback mechanisms, so users can still login with email/password even if Google OAuth is not working.

## 🚨 URGENT FIX FOR YOUR CURRENT ISSUE

Since you're getting "The given origin is not allowed for the given client ID", you need to:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Find your OAuth 2.0 Client ID** (the one ending in `216865863676-ed9c4cpkav3lrk0f4apoh00ngstdf6aj.apps.googleusercontent.com`)
4. **Click on it to edit**
5. **In "Authorized JavaScript origins"**, add:
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
6. **In "Authorized redirect URIs"**, add:
   ```
   http://localhost:3000
   http://localhost:3000/
   http://127.0.0.1:3000
   http://127.0.0.1:3000/
   ```
7. **Click "Save"**
8. **Wait 5-10 minutes** for changes to propagate
9. **Clear your browser cache** and restart your dev server

This should fix the 403 error immediately! 