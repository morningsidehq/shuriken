/**
 * Middleware module for handling authentication and route protection.
 * For more details on authentication flow, see Authentication section in app-documentation.md
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'

// Simple in-memory store for rate limiting
const rateLimit = new Map()

/**
 * Checks rate limiting for API routes
 * @param request - The incoming Next.js request object
 * @returns NextResponse if rate limit exceeded, null otherwise
 */
function checkRateLimit(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for') ||
      'anonymous'
    const now = Date.now()
    const timeframe = 60 * 1000 // 1 minute
    const limit = 20 // requests per timeframe

    const rateLimitData = rateLimit.get(ip) ?? { count: 0, start: now }

    if (now - rateLimitData.start > timeframe) {
      rateLimitData.count = 0
      rateLimitData.start = now
    }

    rateLimitData.count++
    rateLimit.set(ip, rateLimitData)

    if (rateLimitData.count > limit) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }
  return null
}

/**
 * Middleware function that handles authentication state and route protection
 * @param request - The incoming Next.js request object
 * @returns NextResponse object with appropriate redirect or the original response
 */
export async function middleware(request: NextRequest) {
  // Define route configurations at the start
  const protectedRoutes = ['/dashboard', '/actions', '/records', '/assistant']
  const publicAuthRoutes = ['/login', '/signup', '/reset-password']
  const currentPath = request.nextUrl.pathname

  try {
    // Check rate limiting first
    const rateLimitResponse = checkRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { supabase, response } = createMiddlewareClient(request)

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error?.status === 400 && error?.code === 'session_expired') {
        // Clear the expired session
        await supabase.auth.signOut()

        // Only redirect to login if trying to access protected routes
        const isProtectedRoute = protectedRoutes.some((route) =>
          request.nextUrl.pathname.startsWith(route),
        )

        if (isProtectedRoute) {
          const redirectUrl = new URL('/login', request.url)
          redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
          return NextResponse.redirect(redirectUrl)
        }
      }

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

      // Redirect unauthenticated users to login
      if (!user && isProtectedRoute) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectTo', currentPath)
        return NextResponse.redirect(redirectUrl)
      }

      // Add CORS headers for semantic search and embeddings endpoints
      if (
        request.nextUrl.pathname === '/api/semantic-search' ||
        request.nextUrl.pathname === '/api/embeddings'
      ) {
        const response = NextResponse.next()
        response.headers.set('Access-Control-Allow-Credentials', 'true')
        response.headers.set(
          'Access-Control-Allow-Origin',
          request.headers.get('origin') || '*',
        )
        response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')

        // Handle preflight
        if (request.method === 'OPTIONS') {
          return response
        }

        return response
      }

      // Special handling for API routes
      if (request.nextUrl.pathname.startsWith('/api/')) {
        if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      // Handle other errors gracefully
      return response
    }

    return response
  } catch (e) {
    console.error('Middleware error:', e)
    return NextResponse.next()
  }
}

/**
 * Configuration object for the middleware
 * Defines which routes should be processed by this middleware
 * Excludes Next.js internal routes and static assets
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/actions/:path*',
    '/records/:path*',
    '/assistant/:path*',
    '/reset-password',
    '/api/:path*',
  ],
}
