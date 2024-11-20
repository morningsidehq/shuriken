import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import RecordsContent from '@/components/RecordsContent'

export const metadata = {
  title: 'Constance - Public Records',
}

export default async function Records() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get user's group using a direct profile query
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', user.id)
    .single()

  // If you don't have a profiles table, we can try getting it from user metadata
  const userGroup = userData?.user_group || user?.user_metadata?.user_group
  console.log('User:', user)
  console.log('User group:', userGroup)
  console.log('User error:', userError)

  if (!userGroup) {
    console.error('No user group found:', userError)
    return <div>Error: Unable to determine user group</div>
  }

  // Fetch agency-specific records from user_objects bucket
  const { data: agencyRecords, error: agencyError } = await supabase.storage
    .from('user_objects')
    .list(userGroup)

  // Transform storage objects to match Record type
  const formattedAgencyRecords =
    agencyRecords?.map((record) => ({
      file_name: record.name,
      type: record.metadata?.type || 'Unknown',
      status: 'complete',
      date_created: record.created_at,
      object_upload_url: supabase.storage
        .from('user_objects')
        .getPublicUrl(`${userGroup}/${record.name}`).data.publicUrl,
    })) || []

  // Query both complete and pending records
  const { data: completeRecords, error: completeError } = await supabase
    .from('records')
    .select(
      `
      *,
      agencies (
        name
      )
    `,
    )
    .eq('status', 'complete')
    .order('date_created', { ascending: false })

  const { data: pendingRecords, error: pendingError } = await supabase
    .from('records')
    .select(
      `
      *,
      agencies (
        name
      )
    `,
    )
    .eq('status', 'pending')
    .order('date_created', { ascending: false })

  console.log('Complete Records:', completeRecords)
  console.log('Pending Records:', pendingRecords)
  console.log('Query errors:', completeError, pendingError)

  // Get unique values for filters
  const types = [
    'Agenda',
    'Contract',
    'Letter',
    'Minutes',
    'Notice',
    'Order Confirmation',
    'Proposal',
    'Public Notice',
    'Surity Bond',
  ]
  const { data: agencyData } = await supabase.from('agencies').select('name')
  const agencies = Array.from(
    new Set<string>(agencyData?.map((a) => a.name) || []),
  )
  const allTags = Array.from(
    new Set<string>([
      ...(completeRecords?.flatMap((r) => r.tags || []) || []),
      ...(pendingRecords?.flatMap((r) => r.tags || []) || []),
    ]),
  )

  if (completeError || pendingError) {
    const error = completeError || pendingError
    console.error('Error fetching records:', error)
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-8">
        <Header />
        <div className="container py-8 text-center">
          <div className="morningside-card">
            <h2 className="mb-2 text-xl font-semibold">
              Error Loading Records
            </h2>
            <p className="text-muted-foreground">
              {error?.message || 'Unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <Header />
      <div className="container py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Public Records</h1>
        <RecordsContent
          formattedAgencyRecords={formattedAgencyRecords}
          completeRecords={completeRecords || []}
          types={types}
          agencies={agencies}
          allTags={allTags}
        />
      </div>
    </div>
  )
}
