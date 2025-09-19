import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


function getCookie(request: NextRequest, name: string): string | null {
  const cookie = request.cookies.get(name);
  return cookie ? cookie.value : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getCookie(request, 'token');
  
  const protectedRoutes = ['/admin', '/user', '/dashboard'];
  const authRoutes = ['/login', '/sign-up'];
  

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(pathname);
  
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
