
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected routes (add more as needed)
const protectedRoutes = ['/dashboard', '/profile', '/projects', '/services'];

// Helper to decode JWT (without verifying signature)
function parseJwt(token: string) {
          try {
                    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
          } catch {
                    return null;
          }
}

export function middleware(request: NextRequest) {
          const { pathname } = request.nextUrl;
          const tokenCookie = request.cookies.get('auth_token');
          let tokenStr = '';
          if (tokenCookie) {
                    tokenStr = typeof tokenCookie === 'string' ? tokenCookie : tokenCookie.value;
          }

          let user = null;
          let isVerified = false;
          if (tokenStr) {
                    const payload = parseJwt(tokenStr);
                    user = payload;
                    // Adjust this property name if your JWT uses a different field
                    isVerified = !!(user && (user.is_verified || user.verified || user.email_verified));
          }

          // If user is authenticated and hits /auth*
          if (pathname.startsWith('/auth') && tokenStr) {
                    if (isVerified) {
                              // If verified, always redirect to dashboard
                              return NextResponse.redirect(new URL('/dashboard', request.url));
                    } else {
                              // If not verified, redirect to /auth/verify (unless already there)
                              if (!pathname.startsWith('/auth/verify')) {
                                        return NextResponse.redirect(new URL('/auth/verify', request.url));
                              }
                    }
          }

          // Only protect routes in the list
          if (protectedRoutes.some(route => pathname.startsWith(route))) {
                    if (!tokenStr) {
                              // Redirect to login page if not authenticated
                              return NextResponse.redirect(new URL('/auth', request.url));
                    }
          }

          // Allow request to proceed
          return NextResponse.next();
}

export const config = {
          matcher: [
                    '/dashboard/:path*',
                    '/profile/:path*',
                    '/projects/:path*',
                    '/services/:path*',
                    '/auth/:path*',
                    '/auth',
          ],
};
