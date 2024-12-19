/**
 * Semantic Search Page Component
 *
 * Implements semantic search capabilities introduced in v0.5.0 and enhanced in v0.5.4
 * @see app-documentation.md - v0.5.0: Added semantic search capabilities and AI assistant features
 * @see app-documentation.md - v0.5.4: Enhanced semantic search functionality
 *
 * Features include:
 * - Multi-tab search interface for parallel searches
 * - Search analysis panel with bot interface
 * - Common terms highlighting and one-click search
 * - Document content preview and analysis
 * - Hybrid search using all-mpnet-base-v2 model with Supabase vector storage
 */

import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { redirect } from 'next/navigation'
import { SemanticSearch } from '@/components/semantic-search'
import { Card, CardContent } from '@/components/ui/card'

export default async function SearchPage() {
  // Initialize Supabase client with server-side cookies
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Verify user session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  // Redirect to login if no valid session
  if (sessionError || !session) {
    redirect('/login')
  }

  // Get user group for document access control
  const { data: userData } = await supabase
    .from('profiles')
    .select('user_group')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="container mx-auto py-8">
      <Card className="border-border">
        <CardContent>
          <h1 className="mb-8 text-3xl font-bold">Semantic Search</h1>
          <SemanticSearch
            userGroup={userData?.user_group || ''}
            accessToken={session.access_token}
          />
        </CardContent>
      </Card>
    </div>
  )
}
