'use client'

import { createBrowserClient } from '@/utils/supabase'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect } from 'react'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const searchParams = useSearchParams()
  const message = searchParams?.get('message')

  useEffect(() => {
    // Clear any existing sessions on mount
    if (message?.includes('expired')) {
      supabase.auth.signOut()
    }
  }, [message, supabase.auth])

  const handleSignIn = async (formData: FormData) => {
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      router.push('/login?message=Could not authenticate user')
      return
    }

    if (data?.session) {
      router.push('/dashboard')
    }
  }

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      router.push('/login?message=Failed to send reset email')
      return
    }

    router.push('/login?message=Check your email for the reset link')
  }

  return (
    <Card>
      <CardContent className="pt-6">
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
            className="mb-6 rounded-md border bg-white px-4 py-2 text-black"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="mb-6 rounded-md border bg-white px-4 py-2 text-black"
            type="password"
            name="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <Button type="submit" className="mb-2">
            Log In
          </Button>

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
      </CardContent>
    </Card>
  )
}
