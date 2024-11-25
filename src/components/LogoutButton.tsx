'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    try {
      // Verify user authentication state securely before logout
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        // User is already logged out
        router.push('/login')
        return
      }

      // Proceed with logout
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear local storage
      localStorage.clear()

      // Use Next.js router instead of window.location
      router.push('/logout')

      // Force a router refresh to update the UI
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
      router.push('/login?error=Failed to logout properly')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={`text-sm font-medium hover:text-foreground/80 ${className}`}
    >
      Logout
    </button>
  )
}
