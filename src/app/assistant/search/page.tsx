import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import { SemanticSearch } from '@/components/semantic-search'

export default async function SearchPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Semantic Search</h1>
      <SemanticSearch
        userGroup={userData?.user_group || ''}
        userId={session.user.id}
        accessToken={session.access_token}
      />
    </div>
  )
}
