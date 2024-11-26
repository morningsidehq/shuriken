import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import ObjectList from './ObjectList'
import { cookies } from 'next/headers'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function AgencyRecordsPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Get authenticated user using getUser instead of getSession
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
      throw new Error(userError?.message || 'User group not found')
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
      throw new Error(recordsError.message || 'Error fetching records')
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
      <div className="flex min-h-screen flex-col">
        <div className="container flex-1 py-8">
          <h1 className="mb-8 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            Agency Records
          </h1>
          <div className="flex gap-6">
            {/* Sticky sidebar */}
            <div className="sticky top-8 h-[calc(100vh-12rem)] w-[280px] shrink-0">
              <ScrollArea className="h-full rounded-lg border border-border bg-card p-4">
                <div className="space-y-4">
                  <h2 className="font-semibold">Filters</h2>
                  {/* Filters will be moved here */}
                </div>
              </ScrollArea>
            </div>
            {/* Main content */}
            <div className="flex-1">
              <ObjectList
                initialRecords={formattedRecords}
                userGroup={userData.user_group}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error in AgencyRecordsPage:', error)
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-8">
        <div className="container py-8 text-center">
          <div className="morningside-card">
            <h2 className="mb-2 text-xl font-semibold">
              Error Loading Records
            </h2>
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : 'An unknown error occurred'}
            </p>
          </div>
        </div>
      </div>
    )
  }
}
