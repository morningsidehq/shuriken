import Header from '@/components/Header'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import SearchInterface from './SearchInterface'

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
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <Header />
      <SearchInterface />
    </div>
  )
}
