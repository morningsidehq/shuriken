'use client'

import { createBrowserClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordForm() {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handlePasswordReset = async (formData: FormData) => {
    const password = String(formData.get('password'))

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      router.push('/reset-password?message=Failed to reset password')
      return
    }

    router.push('/login?message=Password updated successfully')
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
