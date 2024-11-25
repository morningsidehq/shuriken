'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear local storage
      localStorage.clear()

      // Use replace instead of push to prevent back navigation
      router.replace('/logout')
    } catch (error) {
      console.error('Error logging out:', error)
      router.push('/login?error=Failed to logout properly')
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className={`text-sm font-medium hover:text-foreground/80 ${className}`}
    >
      Logout
    </Button>
  )
}
