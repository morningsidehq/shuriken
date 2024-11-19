import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'

export default async function Signup() {
  const handleSignUp = async (formData: FormData) => {
    'use server'

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/signup?message=Could not create user')
    }

    return redirect('/login?message=Check your email to confirm your account')
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
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
        action={handleSignUp}
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
        />
        <button
          type="submit"
          className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground"
        >
          Sign Up
        </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-green-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
