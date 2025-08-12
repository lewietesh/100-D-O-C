import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes (add more as needed)
const protectedRoutes = ['/dashboard', '/profile', '/projects', '/services'];

export function middleware(request: NextRequest) {
          const { pathname } = request.nextUrl;
          const token = request.cookies.get('auth_token');

          // Redirect authenticated users away from /auth to /dashboard
          if (pathname.startsWith('/auth') && token) {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
          }

          // Only protect routes in the list
          if (protectedRoutes.some(route => pathname.startsWith(route))) {
                    if (!token) {
                              // Redirect to login page if not authenticated
                              return NextResponse.redirect(new URL('/auth', request.url));
                    }
          }

          // Allow request to proceed
          return NextResponse.next();
}

export const config = {
          matcher: ['/dashboard/:path*', '/profile/:path*', '/projects/:path*', '/services/:path*'],
};
