import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { EdgeAuthValidator } from '@/lib/backend/utils/edgeAuth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes that don't need auth and static assets
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && 
      !pathname.startsWith('/api/chef/') && !pathname.startsWith('/api/delivery/') && 
      !pathname.startsWith('/api/users/')) {
    return NextResponse.next();
  }
  
  // Skip middleware for static assets and Next.js internals
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') || 
      pathname.startsWith('/images/') ||
      pathname.startsWith('/.well-known/') ||
      pathname.includes('.') ||
      pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // Validate session using JWT (Edge Runtime compatible)
  const sessionValidation = EdgeAuthValidator.getUserFromRequest(request);
  const user = sessionValidation.isValid ? sessionValidation.user : null;

  // Debug logging
  console.log('🔍 Middleware Debug:', { 
    pathname, 
    hasUser: !!user, 
    userRole: user?.role,
    isAdminRoute: pathname.startsWith('/admin/'),
    isAdminLogin: pathname === '/admin/login',
    referrer: request.headers.get('referer')
  });

  // ADMIN ROUTE PROTECTION - STRICT ENFORCEMENT
  if (pathname.startsWith('/admin/')) {
    // Allow access to admin login page for unauthenticated users
    if (pathname === '/admin/login') {
      console.log('✅ Admin login page - allowing access');
      return NextResponse.next();
    }

    // For all other admin routes, require admin authentication
    if (!user) {
      console.log('🔒 Admin route accessed without authentication - redirecting to admin login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      console.log('❌ Non-admin user trying to access admin route - redirecting to appropriate dashboard');
      
      // Redirect based on user role
      switch (user.role) {
        case 'chef':
          return NextResponse.redirect(new URL('/chef/dashboard', request.url));
        case 'delivery':
          return NextResponse.redirect(new URL('/delivery/dashboard', request.url));
        case 'customer':
        case 'user':
          return NextResponse.redirect(new URL('/dashboard', request.url));
        default:
          return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Admin user accessing admin route - allow access
    console.log('✅ Admin user accessing admin route - allowing access');
    return NextResponse.next();
  }

  // ROLE-BASED ROUTE PROTECTION FOR OTHER ROLES
  if (user) {
    console.log('🔐 Middleware check:', { role: user.role, pathname });

    // CHEF ROLE PROTECTION
    if (user.role === 'chef') {
      // Allow access to chef dashboard and chef-specific routes
      if (pathname === '/chef/dashboard' || pathname.startsWith('/chef/')) {
        return NextResponse.next();
      }
      
      // Allow access to auth pages for role switching
      const authPages = ['/login', '/register', '/delivery/login', '/delivery/register'];
      if (authPages.includes(pathname)) {
        return NextResponse.next();
      }
      
      // Block chef from protected customer and delivery routes
      if (pathname.startsWith('/dashboard') || 
          pathname.startsWith('/delivery/') ||
          pathname.startsWith('/orders') || 
          pathname.startsWith('/profile')) {
        console.log('❌ Chef blocked from protected route:', pathname);
        return NextResponse.redirect(new URL('/chef/dashboard', request.url));
      }
    }

    // DELIVERY ROLE PROTECTION
    if (user.role === 'delivery') {
      // Allow access to delivery dashboard and delivery-specific routes
      if (pathname === '/delivery/dashboard' || pathname.startsWith('/delivery/')) {
        return NextResponse.next();
      }
      
      // Allow access to auth pages for role switching
      const authPages = ['/login', '/register', '/chef/login', '/chef/register'];
      if (authPages.includes(pathname)) {
        return NextResponse.next();
      }
      
      // Block delivery agent from protected customer and chef routes
      if (pathname.startsWith('/dashboard') || 
          pathname.startsWith('/chef/') ||
          pathname.startsWith('/orders') || 
          pathname.startsWith('/profile')) {
        console.log('❌ Delivery agent blocked from protected route:', pathname);
        return NextResponse.redirect(new URL('/delivery/dashboard', request.url));
      }
    }

    // CUSTOMER/USER ROLE PROTECTION
    if (user.role === 'customer' || user.role === 'user') {
      // Allow access to customer dashboard and customer-specific routes
      if (pathname === '/dashboard' || pathname.startsWith('/orders') || pathname.startsWith('/profile')) {
        return NextResponse.next();
      }
      
      // Allow access to auth pages for role switching
      const authPages = ['/chef/login', '/chef/register', '/delivery/login', '/delivery/register'];
      if (authPages.includes(pathname)) {
        return NextResponse.next();
      }
      
      // Block customer from protected chef and delivery routes
      if (pathname.startsWith('/chef/') || pathname.startsWith('/delivery/')) {
        console.log('❌ Customer blocked from protected route:', pathname);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  // PUBLIC ROUTES AND AUTHENTICATION REDIRECTS
  const publicRoutes = ['/chef-services', '/', '/api/chef-services/chefs'];
  const customerAuthRoutes = ['/login', '/register'];
  const chefAuthRoutes = ['/chef/login', '/chef/register'];
  const deliveryAuthRoutes = ['/delivery/login', '/delivery/register'];
  
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isCustomerAuthRoute = customerAuthRoutes.some(route => pathname === route);
  const isChefAuthRoute = chefAuthRoutes.some(route => pathname === route);
  const isDeliveryAuthRoute = deliveryAuthRoutes.some(route => pathname === route);

  // Allow access to public routes and auth pages
  if (isPublicRoute || isCustomerAuthRoute || isChefAuthRoute || isDeliveryAuthRoute) {
    return NextResponse.next();
  }

  // PROTECTED ROUTE REDIRECTS FOR UNAUTHENTICATED USERS
  if (!user) {
    // Redirect to appropriate login based on route
    if (pathname.startsWith('/chef/')) {
      console.log('🔒 Redirecting to chef login');
      return NextResponse.redirect(new URL('/chef/login', request.url));
    }
    
    if (pathname.startsWith('/delivery/')) {
      console.log('🔒 Redirecting to delivery login');
      return NextResponse.redirect(new URL('/delivery/login', request.url));
    }
    
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/orders') || pathname.startsWith('/profile')) {
      console.log('🔒 Redirecting to customer login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};