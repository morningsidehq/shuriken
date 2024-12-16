import { NextRequest } from 'next/server'

// Simple in-memory store (consider using Redis for production)
const rateLimitStore = new Map()

export function getRateLimitConfig(type: 'api' | 'auth' = 'api') {
  return {
    api: { points: 100, duration: 60 }, // 100 requests per minute
    auth: { points: 5, duration: 300 }, // 5 requests per 5 minutes
  }[type]
}

export async function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  const config = getRateLimitConfig(
    request.url.includes('/api/') ? 'api' : 'auth',
  )

  const now = Date.now()
  const rateLimitData = rateLimitStore.get(ip) ?? { count: 0, start: now }

  if (now - rateLimitData.start > config.duration * 1000) {
    rateLimitData.count = 0
    rateLimitData.start = now
  }

  rateLimitData.count++
  rateLimitStore.set(ip, rateLimitData)

  return { blocked: rateLimitData.count > config.points }
}
