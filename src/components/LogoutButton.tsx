'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const clearCookies = () => {
    // Get all cookies
    const cookies = document.cookie.split(';')

    // For each cookie, set it to expire in the past
    cookies.forEach((cookie) => {
      const [name] = cookie.split('=').map((c) => c.trim())
      // Set each cookie to expire, ensuring proper path and domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
      // Also try without domain for local cookies
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    })

    // Specifically handle Supabase cookies
    document.cookie =
      'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}'
    document.cookie =
      'sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}'
  }

  const handleLogout = async () => {
    try {
      // First sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear all storage
      localStorage.clear()
      sessionStorage.clear()

      // Clear cookies
      clearCookies()

      // Brief timeout to ensure cleanup is complete
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Use router.push for the initial navigation
      router.push('/logout')

      // Force a page reload after a brief delay to ensure clean state
      setTimeout(() => {
        window.location.href = '/logout'
      }, 100)
    } catch (error) {
      console.error('Error during logout:', error)
      router.push('/login?error=Failed%20to%20logout%20properly')
    }
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' && !e.newValue) {
        clearCookies()
        router.push('/logout')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [router])

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className={`inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${className}`}
    >
      Logout
    </Button>
  )
}
