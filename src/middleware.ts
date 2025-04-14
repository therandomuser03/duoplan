import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/sign-in', '/sign-up', '/privacy', '/terms', '/not-found'];

// Define static routes that should bypass middleware
const staticRoutes = [
  '/_next',
  '/static',
  '/api',
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml'
];

// Helper function to check if path should bypass middleware
function shouldBypassMiddleware(pathname: string): boolean {
  return staticRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files and API routes
    if (shouldBypassMiddleware(pathname)) {
      return NextResponse.next();
    }

    // Create response and Supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Check session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      // On session error, redirect to sign-in
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    // Allow access to public routes
    if (publicRoutes.includes(pathname)) {
      // If user is logged in and trying to access auth pages, redirect to dashboard
      if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return res;
    }

    // Handle protected routes
    if (!session) {
      // Store the original URL to redirect back after sign in
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(signInUrl);
    }

    // User is authenticated, allow access to protected routes
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On critical error, redirect to sign-in
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (robots.txt, manifest.json, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.json|sitemap.xml).*)',
  ],
}; 