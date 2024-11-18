'use client'

import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-foreground/80 hover:text-foreground"
    >
      Logout
    </button>
  )
}
