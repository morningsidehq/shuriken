import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createMiddlewareClient(request)

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If accessing dashboard without session, redirect to login
    if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
  } catch (e) {
    return NextResponse.next({
      request: { headers: request.headers },
    })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*', // Specifically match dashboard routes
  ],
}
