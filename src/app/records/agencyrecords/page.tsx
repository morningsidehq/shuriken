import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import ObjectList from './ObjectList'
import { cookies } from 'next/headers'

export default async function AgencyRecordsPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Auth error:', authError)
    redirect('/login')
  }

  // Get user's group from public.profiles table
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', user.id)
    .single()

  if (userError || !userData?.user_group) {
    console.error('Error fetching user group:', userError)
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-8">
        <Header />
        <div className="container py-8 text-center">
          <div className="morningside-card">
            <h2 className="mb-2 text-xl font-semibold">
              Error Loading User Group
            </h2>
            <p className="text-muted-foreground">
              {userError?.message || 'User group not found'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // List objects in user's group folder
  const { data: records, error: recordsError } = await supabase.storage
    .from('user_objects')
    .list(userData.user_group, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })

  if (recordsError) {
    console.error('Error fetching records:', recordsError)
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-8">
        <Header />
        <div className="container py-8 text-center">
          <div className="morningside-card">
            <h2 className="mb-2 text-xl font-semibold">
              Error Loading Records
            </h2>
            <p className="text-muted-foreground">
              {recordsError.message || 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Format records to match RecordsContent props
  const formattedRecords =
    records
      ?.filter((record) => !record.name.startsWith('.'))
      ?.map((record) => ({
        file_name: record.name,
        type: record.metadata?.mimetype || 'Unknown',
        status: 'Complete',
        date_created: record.created_at,
        object_upload_url: '',
        user_group: userData.user_group,
        tags: record.metadata?.tags || [],
        entities: record.metadata?.entities || [],
        agencies: { name: userData.user_group },
      })) || []

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <Header />
      <ObjectList
        initialRecords={formattedRecords}
        userGroup={userData.user_group}
      />
    </div>
  )
}
