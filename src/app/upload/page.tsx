import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import FileUploader from '@/components/FileUploader'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const metadata = {
  title: 'Document Upload',
}

export default async function Upload() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get both user and session data with error handling
  const [
    {
      data: { user },
      error: userError,
    },
    {
      data: { session },
      error: sessionError,
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()])

  // Debug session information (remove in production)
  console.log('Session debug:', {
    hasSession: !!session,
    hasUser: !!user,
    tokenLength: session?.access_token?.length,
    userError: userError?.message,
    sessionError: sessionError?.message,
  })

  if (!user || !session || userError || sessionError) {
    console.error('Auth error:', { userError, sessionError })
    redirect('/login?message=Session%20expired')
  }

  // Verify token format
  if (!session.access_token?.startsWith('ey')) {
    console.error('Invalid token format')
    redirect('/login?message=Invalid%20session')
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <div className="container py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Document Upload</h1>

        <Alert className="mb-4">
          <AlertDescription>
            Uploading as: <strong>{user.email}</strong>
          </AlertDescription>
        </Alert>

        <Card className="border-border">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Upload and Classify Documents
            </h2>
          </CardHeader>
          <CardContent>
            <FileUploader
              userId={user.id}
              accessToken={session.access_token}
              userGroup="default"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
