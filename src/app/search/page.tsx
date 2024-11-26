import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import SearchInterface from './SearchInterface'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Constance - Search',
}

export default async function SearchPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 py-8">
        <h1 className="mb-8 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          Search Records
        </h1>
        <div className="mx-auto max-w-4xl">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchInterface />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
