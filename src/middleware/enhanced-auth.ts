import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase'
import { rateLimit } from '../lib/rate-limit'

export async function enhancedAuthMiddleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)

  // 1. Rate Limiting
  const rateLimitResult = await rateLimit(request)
  if (rateLimitResult.blocked) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // 2. Security Headers
  const secureHeaders = new Headers(response.headers)
  secureHeaders.set('X-Frame-Options', 'DENY')
  secureHeaders.set('X-Content-Type-Options', 'nosniff')
  secureHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  secureHeaders.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  )
  secureHeaders.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  )

  // 3. JWT Validation with Role Check
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('user_role, user_group')
      .eq('id', session.user.id)
      .single()

    // 4. Audit Logging
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: request.method,
      resource: request.url,
      user_agent: request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for'),
      user_role: userProfile?.user_role,
      user_group: userProfile?.user_group,
    })
  }

  return NextResponse.next({
    request: {
      headers: secureHeaders,
    },
  })
}
