/**
 * Middleware module for handling authentication and route protection.
 * For more details on authentication flow, see Authentication section in app-documentation.md
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'

const PUBLIC_ROUTES = ['/login', '/signup', '/logout', '/reset-password', '/']

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
  try {
    const rateLimitResponse = checkRateLimit(request)
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { supabase, response } = createMiddlewareClient(request)
    const currentPath = request.nextUrl.pathname

    // Check if it's a public route first
    if (
      PUBLIC_ROUTES.some((route) => currentPath.startsWith(route)) ||
      currentPath.startsWith('/_next') ||
      currentPath.startsWith('/static') ||
      currentPath.startsWith('/api/')
    ) {
      return response
    }

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Always set session cookie if exists
    if (session) {
      response.cookies.set('supabase-auth-token', JSON.stringify(session))
    }

    // Don't redirect on public routes regardless of auth state
    if (PUBLIC_ROUTES.includes(currentPath)) {
      return response
    }

    // Redirect to login if no session and not on a public route
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', currentPath)
      return NextResponse.redirect(loginUrl)
    }

    return response
  } catch (e) {
    console.error('Middleware error:', e)
    // Only redirect on critical errors if not on a public route
    const currentPath = request.nextUrl.pathname
    if (!PUBLIC_ROUTES.includes(currentPath)) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
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
