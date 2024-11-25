'use client'

import { createBrowserClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Also check for the reset password token in the URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const type = hashParams.get('type')

      if (!session && type !== 'recovery') {
        window.location.href = '/login?message=Invalid or expired reset link'
        return
      }
      setLoading(false)
    }

    checkSession()
  }, [supabase.auth])

  const handlePasswordReset = async (formData: FormData) => {
    try {
      const password = String(formData.get('password'))

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      // Sign out and redirect to login
      await supabase.auth.signOut()
      window.location.href = '/login?message=Password updated successfully'
    } catch (error) {
      console.error('Error resetting password:', error)
      window.location.href = '/reset-password?message=Failed to reset password'
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <form
      className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
      onSubmit={async (e) => {
        e.preventDefault()
        await handlePasswordReset(new FormData(e.currentTarget))
      }}
    >
      <label className="text-md" htmlFor="password">
        New Password
      </label>
      <input
        className="mb-6 rounded-md border bg-inherit px-4 py-2"
        type="password"
        name="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />
      <button
        type="submit"
        className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
      >
        Update Password
      </button>
    </form>
  )
}
