import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)

    // Get the session first
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if we're on the login or logout page
    const isLoginPage = request.nextUrl.pathname === '/login'
    const isLogoutPage = request.nextUrl.pathname === '/logout'

    // Protected routes
    const protectedRoutes = ['/dashboard', '/actions', '/records', '/logout']
    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    )

    // If user is logged in and trying to access login page, redirect to dashboard
    if (session && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user is logged in and accessing logout page, allow it
    if (isLogoutPage && session) {
      return response
    }

    // If user is not logged in and trying to access protected route, redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    return response
  } catch (e) {
    console.error('Middleware error:', e)
    // Only redirect to login if not already on login page to prevent loops
    if (request.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/actions/:path*',
    '/records/:path*',
  ],
}
