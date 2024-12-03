'use server'

import { createBrowserClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'

export async function handleSignUp(formData: FormData) {
  const supabase = createBrowserClient()

  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const firstName = String(formData.get('firstName'))
  const lastName = String(formData.get('lastName'))
  const phone = String(formData.get('phone'))

  // Validate phone number (US format)
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  if (!phoneRegex.test(phone)) {
    return redirect('/signup?message=Invalid phone number format')
  }

  // Create the user account
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  })

  if (authError) {
    return redirect('/signup?message=Could not create user')
  }

  // Create the profile record
  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      user_role: 8, // Default to Agency User
    })

    if (profileError) {
      // If profile creation fails, we should probably clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return redirect('/signup?message=Could not create user profile')
    }
  }

  return redirect('/login?message=Check your email to confirm your account')
}
