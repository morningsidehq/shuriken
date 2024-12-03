'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@/utils/supabase'

export default function LogoutPage() {
  const supabase = createBrowserClient()

  useEffect(() => {
    const cleanup = async () => {
      try {
        // Ensure Supabase session is ended
        await supabase.auth.signOut()

        // Clear storage
        localStorage.clear()
        sessionStorage.clear()

        // Clear cookies
        const cookies = document.cookie.split(';')
        cookies.forEach((cookie) => {
          const [name] = cookie.split('=').map((c) => c.trim())
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
        })

        // Brief timeout to ensure cleanup is complete
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Force a clean reload to the login page
        window.location.href = '/login'
      } catch (error) {
        console.error('Error during logout cleanup:', error)
        window.location.href = '/login'
      }
    }

    cleanup()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl">Logging out...</h1>
        <p className="text-muted-foreground">
          Please wait while we sign you out.
        </p>
      </div>
    </div>
  )
}
