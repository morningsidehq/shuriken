'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import debounce from 'lodash/debounce'

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
    <div className="w-full max-w-4xl px-4">
      <h1 className="mb-8 text-center text-3xl font-bold">Search</h1>

      <div className="mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter your search query..."
          className="morningside-search"
        />
      </div>

      <div className="vertical-scroll-container">
        {searchResults.length > 0 ? (
          <>
            {searchResults.map((hit: any, index) => {
              const recordId = hit.document.record_id
              const refValue = hit.document.ref
              const fileUrl = refValue
                ? `https://apzyykplpafkatrlsklz.supabase.co/storage/v1/object/public/pdfs/appomattox-town/ref/${refValue.charAt(0).toUpperCase() + refValue.slice(1)}.pdf`
                : `https://apzyykplpafkatrlsklz.supabase.co/storage/v1/object/public/pdfs/appomattox-town/record_${recordId}/record_${recordId}.pdf`

              return (
                <div
                  key={index}
                  className="mb-4 cursor-pointer rounded border p-4 transition-shadow hover:shadow-lg"
                  onClick={() => openPdfInModal(fileUrl)}
                >
                  <h2 className="font-semibold">Record ID: {recordId}</h2>
                  <div className="mb-2 text-sm text-gray-600">
                    Page: {hit.document.page_number} | Date: {hit.document.date}
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
                </div>
              )
            })}
            <div className="my-4 flex justify-center">
              <button
                onClick={loadMore}
                className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        ) : (
          <p className="w-full text-center text-gray-500">
            {searchQuery.length > 1
              ? 'No results found.'
              : 'Enter at least 2 characters to search'}
          </p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative h-[90vh] w-full max-w-6xl rounded-lg bg-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 hover:bg-gray-100"
            >
              ✕
            </button>
            <iframe
              src={`${selectedPdfUrl}#toolbar=0`}
              className="h-full w-full rounded-lg"
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function highlightMatches(text: string, query: string) {
  if (!query) return text
  const regex = new RegExp(query, 'gi')
  return text.replace(regex, (match) => `<mark>${match}</mark>`)
}
