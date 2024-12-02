'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    try {
      // First, end the session
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear local storage
      localStorage.clear()

      // Navigate to the logout page
      router.push('/logout')

      // Force a router refresh to ensure all authenticated states are cleared
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
      router.push('/login?error=Failed to logout properly')
    }
  }

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
