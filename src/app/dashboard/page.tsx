import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'

export const metadata = {
  title: 'Constance - Dashboard',
}

export default async function DashboardPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Handle errors or no user
  if (error || !user) {
    redirect('/login')
  }

  return (
    <>
      <Header />
      <div className="morningside-container py-8">
        <div className="morningside-card">
          <h1 className="mb-4 text-2xl font-semibold">
            Welcome to the Constance Dashboard
          </h1>
          <p className="text-muted-foreground">Logged in as: {user.email}</p>
        </div>
      </div>
    </>
  )
}
