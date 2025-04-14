import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    // Skip middleware for static files, API routes, and special pages
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/static') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname === '/_not-found' ||
      request.nextUrl.pathname === '/not-found' ||
      request.nextUrl.pathname === '/favicon.ico' ||
      request.nextUrl.pathname.startsWith('/_not-found/')
    ) {
      return NextResponse.next();
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Allow access to public routes
    if (
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/sign-in') ||
      request.nextUrl.pathname.startsWith('/sign-up')
    ) {
      return res;
    }

    // Redirect to sign-in if not authenticated
    if (!session) {
      const signInUrl = new URL('/sign-in', request.url);
      return NextResponse.redirect(signInUrl);
    }

    // Handle dashboard route
    if (request.nextUrl.pathname === '/dashboard') {
      if (!session) {
        const signInUrl = new URL('/sign-in', request.url);
        return NextResponse.redirect(signInUrl);
      }
      return res;
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - _not-found (not found page)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|_not-found).*)',
  ],
}; 