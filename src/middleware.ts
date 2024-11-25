import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)

    // Get the authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Check if we're on the login or logout page
    const isLoginPage = request.nextUrl.pathname === '/login'
    const isLogoutPage = request.nextUrl.pathname === '/logout'

    // Protected routes and public auth routes
    const protectedRoutes = ['/dashboard', '/actions', '/records']
    const publicAuthRoutes = ['/login', '/signup', '/reset-password']
    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    )
    const isPublicAuthRoute = publicAuthRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    )

    // Special handling for logout page
    if (isLogoutPage) {
      return response
    }

    // If user is logged in and trying to access public auth pages, redirect to dashboard
    if (user && isPublicAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user is not logged in and trying to access protected route, redirect to login
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return response
  } catch (e) {
    console.error('Middleware error:', e)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/actions/:path*',
    '/records/:path*',
    '/reset-password',
  ],
}
