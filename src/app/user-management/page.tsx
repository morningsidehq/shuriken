import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import { FaUsers } from 'react-icons/fa'
import AgencyUserManagement from '../../components/user-management/AgencyUserManagement'
import AdminUserManagement from '../../components/user-management/AdminUserManagement'

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

  // Check user's role and group
  const { data: userData } = await supabase
    .from('profiles')
    .select('user_role, user_group')
    .eq('id', user.id)
    .single()

  // Redirect if not an admin or agency admin
  if (!userData || (userData.user_role !== 5 && userData.user_role !== 7)) {
    redirect('/dashboard')
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-center space-x-2">
        <FaUsers className="h-8 w-8" />
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      {userData?.user_role === 5 ? (
        <AdminUserManagement />
      ) : userData?.user_role === 7 ? (
        <AgencyUserManagement userGroup={userData.user_group} />
      ) : (
        <div className="mt-8 text-center text-muted-foreground">
          Access Denied. Invalid user role.
        </div>
      )}
    </div>
  )
}
