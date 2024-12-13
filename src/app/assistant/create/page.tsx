import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import DocumentGenerationForm from '@/components/DocumentGenerationForm'

export const metadata = {
  title: 'Constance - Document Generation',
}

export default async function DocumentCreationPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get user's group
  const { data: userData } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', user.id)
    .single()

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Document Generation
      </h1>
      <DocumentGenerationForm
        userGroup={userData?.user_group || ''}
        userId={user.id} // Pass user ID to the form
      />
    </div>
  )
}
