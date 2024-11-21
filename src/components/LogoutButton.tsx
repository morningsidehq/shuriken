'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error)
      return
    }
    await Promise.all([
      router.refresh(),
      new Promise((resolve) => setTimeout(resolve, 100)),
    ])
    router.replace('/logout')
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
