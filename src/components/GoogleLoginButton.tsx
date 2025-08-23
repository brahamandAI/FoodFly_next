'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { refreshAuthState } from '@/lib/utils/auth';

interface GoogleLoginButtonProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
  text?: string;
  className?: string;
  isLoading?: boolean;
}

export default function GoogleLoginButton({ 
  onSuccess, 
  onError, 
  text = "Continue with Google",
  className = "",
  isLoading: propIsLoading = false
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  // Combine prop loading state with internal loading state
  const isButtonLoading = isLoading || propIsLoading;

  // Check if Google OAuth is properly configured
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isConfigured = clientId && clientId.includes('googleusercontent.com');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      const errorMessage = 'No credential received from Google';
      toast.error(errorMessage);
      if (onError) onError(errorMessage);
      return;
    }

    setIsLoading(true);
    try {
      // Send the actual Google ID token to your backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          credential: credentialResponse.credential 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Google authentication failed');
      }

      const data = await response.json();

      // Clear any existing guest state first
      localStorage.removeItem('guest');
      
      // Store authentication data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');

      // Also store in sessionStorage as backup
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('isLoggedIn', 'true');

      // Set cookies for middleware access (same as normal login)
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      // Debug: Log what we're setting
      console.log('🔐 Google login - Setting cookies:', {
        token: data.token ? 'SET' : 'MISSING',
        user: data.user ? 'SET' : 'MISSING',
        tokenLength: data.token?.length || 0
      });

      // Immediately trigger auth state change events
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'isLoggedIn',
        newValue: 'true'
      }));

      // Additional event to ensure all components are notified
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { isLoggedIn: true, user: data.user, source: 'google' }
      }));

      // Force refresh auth state to ensure all components are updated
      refreshAuthState();

      // Debug: Check if cookies are set
      console.log('🔍 Google login - Checking cookies after set:', {
        tokenCookie: document.cookie.includes('token='),
        userCookie: document.cookie.includes('user='),
        allCookies: document.cookie
      });

      // Migrate guest cart and load user cart from database
      try {
        const { unifiedCartService } = await import('@/lib/api');
        await unifiedCartService.migrateGuestCartOnLogin();
        await unifiedCartService.loadUserCartFromDatabase();
      } catch (error) {
        console.error('Error migrating guest cart:', error);
      }

      toast.success(data.message || 'Successfully signed in with Google!');
      
      // Call onSuccess immediately to close the popup
      onSuccess();

      // Force a page reload only if on login page or home page to ensure smooth transition
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/') {
        // Small delay to ensure the popup closes first
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }

    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.message || 'Google authentication failed';
      toast.error(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    const errorMessage = 'Google authentication failed. Please try again.';
    toast.error(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  };

  // If Google OAuth is not configured or disabled, show a disabled button
  if (!isConfigured || isDisabled) {
    return (
      <div className={`w-full ${className}`}>
        <button
          onClick={() => {
            toast.error('Google OAuth is not configured. Please use email login instead.');
            if (onError) onError('Google OAuth not configured');
          }}
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 font-bold rounded-xl cursor-not-allowed border-2 border-gray-200"
        >
          Google Sign-In (Not Available)
        </button>
        <p className="text-xs text-gray-400 mt-1 text-center">
          Use email login instead
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
          auto_select={false}
          text="continue_with"
          shape="rectangular"
          theme="outline"
          size="large"
          logo_alignment="left"
          type="standard"
          context="signin"
        />
        {isButtonLoading && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-700 font-medium">Signing in...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 