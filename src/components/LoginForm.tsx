'use client'

import { createBrowserClient } from '@/utils/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient()

  const handleSignIn = async (formData: FormData) => {
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      router.push('/login?message=Could not authenticate user')
      return
    }

    const redirectTo = searchParams.get('redirectTo') || '/dashboard'
    await Promise.all([
      router.refresh(),
      new Promise((resolve) => setTimeout(resolve, 100)),
    ])
    router.replace(redirectTo)
  }

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (error) {
      router.push('/login?message=Failed to send reset email')
      return
    }

    router.push('/login?message=Check your email for the reset link')
  }

  return (
    <>
      <Link
        href="/"
        className="bg-btn-background hover:bg-btn-background-hover group absolute left-8 top-8 flex items-center rounded-md px-4 py-2 text-sm text-foreground no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
        onSubmit={async (e) => {
          e.preventDefault()
          await handleSignIn(new FormData(e.currentTarget))
        }}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
        >
          Sign In
        </button>

        <div className="flex items-center justify-center gap-2 text-sm">
          <span>Forgot your password?</span>
          <button
            type="button"
            onClick={() => {
              const emailInput = document.querySelector(
                'input[name="email"]',
              ) as HTMLInputElement
              if (emailInput?.value) {
                handleResetPassword(emailInput.value)
              } else {
                alert('Please enter your email address first')
              }
            }}
            className="text-green-700 hover:underline"
          >
            Reset Password
          </button>
        </div>

        <p className="text-center text-sm">
          Don&apos;t have a Constance account yet?{' '}
          <Link href="/signup" className="text-green-700 hover:underline">
            Sign Up!
          </Link>
        </p>
      </form>
    </>
  )
}
