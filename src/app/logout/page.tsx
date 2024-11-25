import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Constance - Log Out Successful',
}

export default async function LogoutPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Check if user is already logged out
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // If user is still logged in, force a logout
  if (user) {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <div className="container py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Log Out Successful
        </h1>

        <div className="morningside-card flex flex-col items-center gap-4">
          <p className="text-lg">
            <b>You have been logged out of Constance.</b>
          </p>

          <div className="flex flex-col items-center gap-2">
            <p>Would you like to log in again?</p>
            <Link
              href="/login"
              className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
