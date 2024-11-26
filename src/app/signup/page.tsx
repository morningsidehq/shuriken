/**
 * Signup page component that provides user registration functionality.
 * For more details on authentication flow, see Authentication section in app-documentation.md
 */

import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Signup component that renders a centered card containing the registration form
 * @returns JSX.Element A card with signup form centered on the page
 */
export default async function Signup() {
  /**
   * Server action to handle user registration form submission
   * @param formData - Form data containing email and password
   * @returns Redirects to login page on success or signup page with error message on failure
   */
  const handleSignUp = async (formData: FormData) => {
    'use server'

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    // Attempt to create new user account
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
    // Container div that centers the signup card both vertically and horizontally
    <div className="flex h-screen w-screen items-center justify-center">
      {/* Card component with fixed width for signup form */}
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Registration form with email and password fields */}
          <form className="grid gap-4" action={handleSignUp}>
            {/* Email input field */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password input field */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>

            {/* Login link for existing users */}
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
