import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import AdvancedRecordForm from '@/components/AdvancedRecordForm'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const metadata = {
  title: 'Constance - Create Record',
}

export default async function AdvancedRecordCreation() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    redirect('/login')
  }

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

  // Add the format function
  const formatUserGroup = (group: string) => {
    return group.replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <div className="container py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Create New Record
        </h1>

        <Alert className="mb-4">
          <AlertDescription>
            Uploading to: <strong>{formatUserGroup(userGroup)}</strong>
          </AlertDescription>
        </Alert>

        <Card className="border-border">
          <CardHeader>
            <h2 className="text-xl font-semibold">File Upload</h2>
          </CardHeader>
          <CardContent className="pt-6">
            <AdvancedRecordForm userGroup={userGroup} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
