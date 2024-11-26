// Import necessary dependencies
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import RecordsContent from '@/components/RecordsContent'
import { ScrollArea } from '@/components/ui/scroll-area'
import RecordsFilters from '@/components/RecordsFilters'

// Define page metadata
export const metadata = {
  title: 'Constance - Public Records',
}

export default async function Records() {
  // Initialize Supabase client with cookies
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Authenticate user and redirect if not logged in
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get user's group from profiles table or user metadata
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', user.id)
    .single()

  const userGroup = userData?.user_group || user?.user_metadata?.user_group
  console.log('User:', user)
  console.log('User group:', userGroup)
  console.log('User error:', userError)

  if (!userGroup) {
    console.error('No user group found:', userError)
    return <div>Error: Unable to determine user group</div>
  }

  // Fetch complete records with agency information
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

  // Fetch pending records with agency information
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

  // Log records and any errors for debugging
  console.log('Complete Records:', completeRecords)
  console.log('Pending Records:', pendingRecords)
  console.log('Query errors:', completeError, pendingError)

  // Define available record types for filtering
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

  // Get unique agency names for filtering
  const { data: agencyData } = await supabase.from('agencies').select('name')
  const agencies = Array.from(
    new Set<string>(agencyData?.map((a) => a.name) || []),
  )

  // Get unique tags from all records for filtering
  const allTags = Array.from(
    new Set<string>([
      ...(completeRecords?.flatMap((r) => r.tags || []) || []),
      ...(pendingRecords?.flatMap((r) => r.tags || []) || []),
    ]),
  )

  // Handle and display any errors that occurred during data fetching
  if (completeError || pendingError) {
    const error = completeError || pendingError
    console.error('Error fetching records:', error)
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-8">
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

  // Render the records page with filters and content
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 py-8">
        <h1 className="mb-8 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          Public Records
        </h1>
        <div className="flex gap-6">
          {/* Sticky sidebar */}
          <div className="sticky top-8 h-[calc(100vh-12rem)] w-[280px] shrink-0">
            <ScrollArea className="h-full rounded-lg border border-border bg-card p-4">
              <RecordsFilters
                types={types}
                agencies={agencies}
                allTags={allTags}
              />
            </ScrollArea>
          </div>
          {/* Main content */}
          <div className="flex-1">
            <RecordsContent completeRecords={completeRecords || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
