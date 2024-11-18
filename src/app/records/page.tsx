import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

// Add this near the top of the file, after the imports
export const metadata = {
  title: 'Constance - Records',
}

// Dynamically import to avoid SSR issues with document
const ViewRecordButton = dynamic(
  () => import('@/components/ViewRecordButton'),
  {
    ssr: false,
  },
)

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
    .from('profiles') // Assuming you have a profiles table
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

  // Query records with the user_group and join with agencies table
  const { data: records, error } = await supabase
    .from('records')
    .select(
      `
      *,
      agencies (
        name
      )
    `,
    )
    .eq('user_group', userGroup)
    .order('date_created', { ascending: false })

  console.log('Records query params:', { userGroup })
  console.log('Records:', records)
  console.log('Query error:', error)

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
    new Set<string>(records?.flatMap((r) => r.tags || []) || []),
  )

  if (error) {
    console.error('Error fetching records:', error)
    return (
      <div className="flex w-full flex-1 flex-col items-center gap-8">
        <Header />
        <div className="container py-8">
          <div className="morningside-card">
            <h2 className="mb-2 text-xl font-semibold">
              Error Loading Records
            </h2>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <Header />

      <div className="container py-8">
        <h1 className="mb-8 text-4xl font-bold">Records</h1>

        <div className="morningside-card mb-8">
          <h2 className="mb-4 text-xl font-semibold">Filters</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Type</label>
              <select className="morningside-input">
                <option value="">All Types</option>
                {types.map((type, i) => (
                  <option key={i} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Agency</label>
              <select className="morningside-input">
                <option value="">All Agencies</option>
                {agencies.map((agency, i) => (
                  <option key={i} value={agency}>
                    {agency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="morningside-input"
                  placeholder="From"
                />
                <input
                  type="date"
                  className="morningside-input"
                  placeholder="To"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Tags</label>
              <select className="morningside-input" multiple>
                {allTags.map((tag, i) => (
                  <option key={i} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="morningside-table">
            <thead>
              <tr className="border-b border-border/40">
                <th className="max-w-[100px] whitespace-normal px-4 py-2 text-left font-medium">
                  File Name
                </th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Agency</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">
                  Date Created
                </th>
                <th className="px-4 py-2 text-left font-medium">Tags</th>
                <th className="px-4 py-2 text-left font-medium">Entities</th>
                <th className="px-4 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records?.map((record, i) => (
                <tr
                  key={i}
                  className="border-b border-border/40 hover:bg-muted/50"
                >
                  <td className="px-4 py-2">{record.file_name}</td>
                  <td className="px-4 py-2">{record.type}</td>
                  <td className="px-4 py-2">{record.agencies?.name}</td>
                  <td className="px-4 py-2">{record.status}</td>
                  <td className="px-4 py-2">
                    {new Date(record.date_created).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-4 py-2">{record.tags?.toString()}</td>
                  <td className="px-4 py-2">{record.entities?.toString()}</td>
                  <td className="px-4 py-2">
                    <ViewRecordButton record={record} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
