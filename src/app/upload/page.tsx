import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import FileUploader from '@/components/FileUploader'

export const metadata = {
  title: 'Constance - Quick Document Intake',
}

export default async function Upload() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  // Redirect if not logged in
  if (!user || authError) {
    redirect('/login')
  }

  // Get user's group
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', user.id)
    .single()

  const userGroup = userData?.user_group || user?.user_metadata?.user_group

  if (!userGroup) {
    console.error('No user group found:', userError)
    return <div>Error: Unable to determine user group</div>
  }

  // Add this function to format the user group name
  const formatUserGroup = (group: string) => {
    return group.replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <Header />

      <div className="container py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Quick Document Intake
        </h1>

        <div className="mb-4 rounded bg-white p-2 text-left">
          Uploading to: <strong>{formatUserGroup(userGroup)}</strong>
        </div>

        <div className="morningside-card">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Upload and Classify Documents
            </h2>
          </div>

          <FileUploader userGroup={userGroup} />
        </div>
      </div>
    </div>
  )
}
