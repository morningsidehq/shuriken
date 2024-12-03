import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import { FaUsers } from 'react-icons/fa'

export const metadata = {
  title: 'Constance - User Management',
}

export default async function UserManagementPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Check if user has admin role
  const { data: userData } = await supabase
    .from('profiles')
    .select('user_role')
    .eq('id', user.id)
    .single()

  if (!userData || userData.user_role !== 7) {
    redirect('/dashboard')
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-center space-x-2">
        <FaUsers className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      {/* Add your user management content here */}
      <div className="mt-8">
        <p className="text-center text-muted-foreground">
          User management interface coming soon...
        </p>
      </div>
    </div>
  )
}
