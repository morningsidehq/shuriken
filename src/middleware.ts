import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Define route configurations
    const protectedRoutes = ['/dashboard', '/actions', '/records']
    const publicAuthRoutes = ['/login', '/signup', '/reset-password']
    const currentPath = request.nextUrl.pathname

    // Check route types
    const isProtectedRoute = protectedRoutes.some((route) =>
      currentPath.startsWith(route),
    )
    const isPublicAuthRoute = publicAuthRoutes.some((route) =>
      currentPath.startsWith(route),
    )
    const isLogoutPage = currentPath === '/logout'

    // Special handling for logout page - allow the logout process to complete
    if (isLogoutPage) {
      return response
    }

    // Redirect authenticated users away from auth pages
    if (user && isPublicAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect unauthenticated users to login with return URL
    if (!user && isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', currentPath)
      return NextResponse.redirect(redirectUrl)
    }

    return response
  } catch (e) {
    // Log the error but don't expose details in production
    console.error('Middleware error:', e)

    // Safely redirect to login while preserving the intended destination
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
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
