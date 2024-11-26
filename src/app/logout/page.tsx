import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = {
  title: 'Constance - Log Out Successful',
}

export default async function LogoutPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Check if user is already logged out
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is still logged in, force a logout
  if (user) {
    await supabase.auth.signOut()
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardContent className="pt-6">
          <h1 className="mb-8 text-center text-2xl font-bold">
            Log Out Successful
          </h1>

          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-medium">
              You have been logged out of Constance.
            </p>

            <div className="flex flex-col items-center gap-2">
              <p className="text-muted-foreground">
                Would you like to log in again?
              </p>
              <Button asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
