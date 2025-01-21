'use client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const Hit = ({ hit }: any) => (
  <div className="p-4 hover:bg-accent">
    <h3 className="font-semibold">{hit.file_name}</h3>
    <p className="text-sm text-muted-foreground">
      {hit.type} - {hit.agencies?.name}
    </p>
    {hit.tags && hit.tags.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-1">
        {hit.tags.map((tag: string) => (
          <span
            key={tag}
            className="rounded-full bg-primary/10 px-2 py-1 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
)

export default function PublicRecordsSearch() {
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchClient, setSearchClient] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function initializeSearch() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) throw error

        const adapter = new TypesenseInstantSearchAdapter({
          server: {
            apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY!,
            nodes: [
              {
                host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
                port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT!),
                protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL!,
              },
            ],
            cacheSearchResultsForSeconds: 2 * 60,
            additionalHeaders: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          },
          additionalSearchParameters: {
            query_by: 'file_name,type,agencies.name,tags',
            per_page: 10,
          },
        })
        setSearchClient(adapter.searchClient)
      } catch (error) {
        setSearchError('Failed to initialize search client')
        console.error('Error creating Typesense client:', error)
      }
    }

    initializeSearch()
  }, [supabase])

  if (searchError) {
    return (
      <div className="mb-8 rounded-md bg-red-50 p-4 text-red-500">
        {searchError}
      </div>
    )
  }

  if (!searchClient) {
    return null
  }

  return (
    <div className="mb-8">
      <InstantSearch searchClient={searchClient} indexName="records">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <SearchBox
            translations={{
              placeholder: 'Search records...',
            }}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            submit={<></>}
            reset={<></>}
          />
        </div>
        <div className="relative mt-2">
          <div className="absolute z-50 w-full rounded-md border bg-popover shadow-md">
            <Hits hitComponent={Hit} />
          </div>
        </div>
      </InstantSearch>
    </div>
  )
}
