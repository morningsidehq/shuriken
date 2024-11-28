'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

type SearchResult = {
  id: string
  file_path: string
  similarity: number
  metadata: {
    size?: number
    mimetype?: string
  }
  debug_info: {
    similarity_score: number
    query_text: string
  }
  content?: string
}

export function SemanticSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState<Record<string, boolean>>(
    {},
  )
  const supabase = createClientComponentClient()

  const handleSearch = async () => {
    if (!query.trim()) return

    try {
      setLoading(true)
      console.log('Starting search for:', query)

      const embeddingResponse = await fetch('/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      })

      if (!embeddingResponse.ok) {
        throw new Error(`Embedding API error: ${embeddingResponse.status}`)
      }

      const { embedding } = await embeddingResponse.json()

      const formattedEmbedding = Array.from(embedding).map((n) =>
        typeof n === 'string' ? parseFloat(n) : n,
      )

      if (formattedEmbedding.length !== 768) {
        throw new Error(
          `Invalid embedding length: ${formattedEmbedding.length}`,
        )
      }

      if (formattedEmbedding.some((n) => typeof n !== 'number' || isNaN(n))) {
        throw new Error('Invalid embedding values detected')
      }

      console.log('Calling search with:', {
        query_text: query,
        embedding_length: formattedEmbedding.length,
        sample: formattedEmbedding.slice(0, 5),
        sample_types: formattedEmbedding.slice(0, 5).map((n) => typeof n),
      })

      const { data, error } = await supabase.rpc('hybrid_search', {
        query_text: query,
        query_embedding: formattedEmbedding,
        match_count: 5,
        similarity_threshold: 0.0001,
      })

      if (error) {
        console.error('Search error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          params: {
            query_length: query.length,
            embedding_length: formattedEmbedding.length,
            sample: formattedEmbedding.slice(0, 5),
            sample_types: formattedEmbedding.slice(0, 5).map((n) => typeof n),
          },
        })
        throw error
      }

      console.log('Search results:', data)
      setResults(data || [])
    } catch (error) {
      console.error('Full error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContent = async (result: SearchResult) => {
    if (result.content) return

    try {
      setLoadingContent((prev) => ({ ...prev, [result.id]: true }))

      const textPath = result.file_path.replace('.pdf', '.txt')

      const { data, error } = await supabase.storage
        .from('pdfs')
        .download(textPath)

      if (error) throw error

      const text = await data.text()

      setResults((prev) =>
        prev.map((r) => (r.id === result.id ? { ...r, content: text } : r)),
      )
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoadingContent((prev) => ({ ...prev, [result.id]: false }))
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          {results.map((result) => (
            <Card key={result.id} className="p-4">
              <p className="text-sm font-medium">{result.file_path}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Similarity: {(result.similarity * 100).toFixed(2)}%
                <br />
                Size:{' '}
                {result.metadata.size
                  ? `${(result.metadata.size / 1024).toFixed(2)} KB`
                  : 'N/A'}
                <br />
                Type: {result.metadata.mimetype || 'N/A'}
              </p>
              {!result.content && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fetchContent(result)}
                  disabled={loadingContent[result.id]}
                >
                  {loadingContent[result.id] ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'View Content'
                  )}
                </Button>
              )}
              {result.content && (
                <div className="mt-4 rounded-md bg-muted p-3">
                  <p className="max-h-48 overflow-y-auto whitespace-pre-wrap text-sm">
                    {result.content}
                  </p>
                </div>
              )}
            </Card>
          ))}
          {results.length === 0 && !loading && query && (
            <p className="text-center text-muted-foreground">
              No results found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
