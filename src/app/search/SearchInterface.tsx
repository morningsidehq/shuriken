'use client'

import { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

const TYPESENSE_API_KEY = process.env.NEXT_PUBLIC_TYPESENSE_API_KEY
const TYPESENSE_HOST = 'uwpe7nj48tifg3vmp-1.a1.typesense.net'

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('')

  const performSearch = async (query: string, page: number = 1) => {
    if (query.length < 2 || isLoading) return

    setIsLoading(true)
    try {
      console.log('Searching with query:', query)
      const searchUrl = `https://${TYPESENSE_HOST}/collections/chunks/documents/search?q=${encodeURIComponent(query)}&query_by=content&page=${page}&per_page=10`
      console.log('Search URL:', searchUrl)

      const response = await fetch(searchUrl, {
        headers: {
          'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY || '',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Search response:', data)

      if (page === 1) {
        setSearchResults(data.hits || [])
      } else {
        setSearchResults((prev) => [...prev, ...(data.hits || [])])
      }

      setCurrentPage(page + 1)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300),
    [],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setCurrentPage(1)
    setSearchResults([])
    debouncedSearch(query)
  }

  const loadMore = () => {
    performSearch(searchQuery, currentPage)
  }

  const openPdfInModal = (fileUrl: string) => {
    setSelectedPdfUrl(fileUrl)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter your search query..."
          className="w-full"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="h-[60vh] overflow-y-auto p-4">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((hit: any, index) => {
                const recordId = hit.document.record_id
                const refValue = hit.document.ref
                const fileUrl = refValue
                  ? `https://apzyykplpafkatrlsklz.supabase.co/storage/v1/object/public/pdfs/appomattox-town/ref/${refValue.charAt(0).toUpperCase() + refValue.slice(1)}.pdf`
                  : `https://apzyykplpafkatrlsklz.supabase.co/storage/v1/object/public/pdfs/appomattox-town/record_${recordId}/record_${recordId}.pdf`

                return (
                  <Card
                    key={index}
                    className="mb-4 cursor-pointer border-border transition-shadow hover:shadow-md"
                    onClick={() => openPdfInModal(fileUrl)}
                  >
                    <CardContent className="p-4">
                      <h2 className="font-semibold">Record ID: {recordId}</h2>
                      <div className="mb-2 text-sm text-muted-foreground">
                        Page: {hit.document.page_number} | Date:{' '}
                        {hit.document.date}
                      </div>
                      <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatches(
                            hit.document.content,
                            searchQuery,
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>
                )
              })}
              <div className="my-4 flex justify-center">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  variant="default"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              {searchQuery.length > 1
                ? 'No results found.'
                : 'Enter at least 2 characters to search'}
            </p>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[90vh] max-w-6xl border-border">
          <iframe
            src={`${selectedPdfUrl}#toolbar=0`}
            className="h-full w-full rounded-lg"
            title="PDF Viewer"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function highlightMatches(text: string, query: string) {
  if (!query) return text
  const regex = new RegExp(query, 'gi')
  return text.replace(
    regex,
    (match) =>
      `<mark class="bg-yellow-200 dark:bg-yellow-800 dark:text-white">${match}</mark>`,
  )
}
