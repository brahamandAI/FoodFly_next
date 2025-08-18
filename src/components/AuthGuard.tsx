'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { checkAuthState, redirectToLogin } from '@/lib/utils/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const authState = checkAuthState();
      
      console.log('AuthGuard check:', {
        token: !!authState.token,
        user: !!authState.user,
        isAuthenticated: authState.isAuthenticated,
        isGuest: authState.isGuest,
        pathname
      });
      
      setIsAuthenticated(authState.isAuthenticated);
      setIsLoading(false);

      if (!authState.isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        redirectToLogin();
      }
    };

    // Initial check with a slight delay to allow for Google login completion
    const initialCheck = setTimeout(() => {
      checkAuth();
    }, 100);

    // Listen for auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'token' || e.key === 'user') {
        console.log('Storage changed:', e.key, e.newValue);
        // Add a small delay to ensure storage is fully updated
        setTimeout(() => {
          checkAuth();
        }, 50);
      }
    };

    const handleAuthStateChange = (e: CustomEvent) => {
      console.log('Auth state changed:', e.detail);
      // Add a small delay to ensure storage is fully updated
      setTimeout(() => {
        checkAuth();
      }, 100);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthStateChange as EventListener);

    return () => {
      clearTimeout(initialCheck);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthStateChange as EventListener);
    };
  }, [router, pathname]);

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 