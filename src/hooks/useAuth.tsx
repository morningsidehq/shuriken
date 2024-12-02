'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSessionContext } from '@supabase/auth-helpers-react'
import * as React from 'react'

export function AuthGuard({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement | null {
  const { session, isLoading } = useSessionContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !session) {
      router.push('/login')
    }
  }, [session, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return session ? <>{children}</> : null
}
