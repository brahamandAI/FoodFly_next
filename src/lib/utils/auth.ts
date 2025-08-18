/**
 * Authentication utility functions
 */

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  isGuest: boolean;
}

/**
 * Check if user is authenticated by checking both localStorage and sessionStorage
 */
export function checkAuthState(): AuthState {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true';
    const isGuest = localStorage.getItem('guest') === 'true';
    
    let user = null;
    if (userData) {
      try {
        user = JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid user data
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }

    const isAuthenticated = !!(
      (token && user && isLoggedIn) || 
      (isGuest && user && isLoggedIn)
    );

    console.log('Auth state check:', {
      hasToken: !!token,
      hasUser: !!user,
      isLoggedIn,
      isGuest,
      isAuthenticated
    });

    return {
      isAuthenticated,
      token,
      user,
      isGuest
    };
  } catch (error) {
    console.error('Error checking auth state:', error);
    return {
      isAuthenticated: false,
      token: null,
      user: null,
      isGuest: false
    };
  }
}

/**
 * Get authentication token from localStorage or sessionStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

/**
 * Get user data from localStorage or sessionStorage
 */
export function getUserData(): any | null {
  const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  const authState = checkAuthState();
  return authState.isAuthenticated;
}

/**
 * Redirect to login with current page as redirect parameter
 */
export function redirectToLogin(): void {
  const currentPath = window.location.pathname;
  const redirectUrl = encodeURIComponent(currentPath);
  window.location.href = `/login?redirect=${redirectUrl}`;
}

/**
 * Logout user by clearing all authentication data
 */
export function logout(): void {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('guest');
  
  // Clear sessionStorage
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('isLoggedIn');
  
  // Clear cookies
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  
  // Trigger logout event
  window.dispatchEvent(new CustomEvent('authStateChanged', {
    detail: { isLoggedIn: false, user: null }
  }));
  
  // Redirect to home page
  window.location.href = '/';
}

/**
 * Force refresh authentication state and trigger events
 */
export function refreshAuthState(): void {
  try {
    const authState = checkAuthState();
    
    // Trigger auth state change event
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { 
        isLoggedIn: authState.isAuthenticated, 
        user: authState.user,
        source: 'refresh'
      }
    }));

    // Trigger storage event
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'isLoggedIn',
      newValue: authState.isAuthenticated ? 'true' : 'false'
    }));

    console.log('Auth state refreshed:', authState);
  } catch (error) {
    console.error('Error refreshing auth state:', error);
  }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  try {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('guest');
    
    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    console.log('All authentication data cleared');
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}
