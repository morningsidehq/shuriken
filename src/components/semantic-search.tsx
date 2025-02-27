'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Bot, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface SearchResult {
  id: string
  file_path: string
  content: string
  similarity: number
  page_number: number
  job_id: number
  showFullContent?: boolean
}

type HighlightProps = {
  text: string
  query: string
  className?: string
}

const Highlight = ({ text, query, className }: HighlightProps) => {
  if (!query) return <span>{text}</span>

  const parts = text.split(new RegExp(`(${query})`, 'gi'))

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className="mx-0.5 rounded bg-yellow-200 px-1 dark:bg-yellow-900 dark:text-yellow-100"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  )
}

const getWordFrequency = (text: string): Map<string, number> => {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3) // Skip small words

  return words.reduce((freq, word) => {
    freq.set(word, (freq.get(word) || 0) + 1)
    return freq
  }, new Map<string, number>())
}

const findCommonWords = (
  results: SearchResult[],
): { word: string; count: number }[] => {
  const allFreq = new Map<string, number>()

  results.forEach((result) => {
    if (!result.content) return
    const freq = getWordFrequency(result.content)
    freq.forEach((count, word) => {
      allFreq.set(word, (allFreq.get(word) || 0) + count)
    })
  })

  return Array.from(allFreq.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 words
}

const generateResultsSummary = (results: SearchResult[]) => {
  if (!results.length) return null

  const avgSimilarity =
    results.reduce((sum, r) => sum + r.similarity, 0) / results.length

  // Calculate total content length
  const totalChars = results.reduce(
    (sum, r) => sum + (r.content?.length || 0),
    0,
  )

  // Find common words
  const commonWords = findCommonWords(results)

  // Group by similarity ranges instead of folders
  const similarityRanges = {
    high: results.filter((r) => r.similarity >= 0.8),
    medium: results.filter((r) => r.similarity >= 0.6 && r.similarity < 0.8),
    low: results.filter((r) => r.similarity < 0.6),
  }

  return {
    count: results.length,
    avgSimilarity,
    totalChars,
    commonWords,
    similarityRanges,
  }
}

interface SummaryPanelProps {
  results: SearchResult[]
  isOpen: boolean
  onClose: () => void
  onTermClick: (term: string) => void
  handleSearch: (tabId: string) => Promise<void>
  setTabs: React.Dispatch<React.SetStateAction<SearchTab[]>>
  setActiveTab: (id: string) => void
  tabs: SearchTab[]
}

const SummaryPanel = ({
  results,
  isOpen,
  onClose,
  onTermClick,
  handleSearch,
  setTabs,
  setActiveTab,
  tabs,
}: SummaryPanelProps) => {
  const summary = generateResultsSummary(results)
  if (!summary) return null

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-96 transform border-l border-border bg-background/95 shadow-lg backdrop-blur transition-transform duration-300 ease-in-out supports-[backdrop-filter]:bg-background/60',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 font-medium">Search Analysis</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Found {summary.count} relevant text segments with{' '}
                {(summary.avgSimilarity * 100).toFixed(2)}% average semantic
                similarity. Total content: {summary.totalChars.toLocaleString()}{' '}
                characters.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="mt-[-4px]"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-sm font-medium">
                Most Common Terms in Results:
              </h4>
              <div className="space-y-2">
                {summary.commonWords.map(({ word, count }) => (
                  <div
                    key={word}
                    className="flex items-center justify-between rounded-md border border-border bg-background/50 p-2"
                  >
                    <span className="text-sm">
                      {word} ({count})
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7"
                        onClick={() => onTermClick(word)}
                      >
                        Highlight
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7"
                        onClick={async () => {
                          const newId = (
                            Math.max(...tabs.map((t) => parseInt(t.id))) + 1
                          ).toString()
                          setTabs((prev) => [
                            ...prev,
                            { id: newId, query: word, results: [] },
                          ])
                          setActiveTab(newId)
                          await new Promise((resolve) => setTimeout(resolve, 0))
                          await handleSearch(newId)
                          onClose()
                        }}
                      >
                        Search
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">
                Similarity Distribution
              </h4>
              <div className="space-y-3">
                {Object.entries(summary.similarityRanges).map(
                  ([range, matches]) => (
                    <div key={range} className="text-sm">
                      <p className="text-muted-foreground">
                        {range.charAt(0).toUpperCase() + range.slice(1)}{' '}
                        similarity ({matches.length}):
                      </p>
                      <div className="ml-4 mt-1 space-y-1">
                        {matches.map((match, idx) => (
                          <p key={idx} className="text-xs">
                            {match.content?.slice(0, 100)}...
                            <span className="ml-1 text-muted-foreground">
                              ({(match.similarity * 100).toFixed(1)}%)
                            </span>
                          </p>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

type SearchTab = {
  id: string
  query: string
  results: SearchResult[]
}

interface SemanticSearchProps {
  userGroup: string
  accessToken: string
}

// Add interface above the transform
interface SearchResponse {
  id: number
  job_id: number
  chunk_text: string
  page_number: number
  similarity: number
}

interface ChunkResponse {
  chunk_text: string
  page_number: number
  sequence_order: number
  id: number
  job_id: number
  similarity: number
}

export function SemanticSearch({
  userGroup,
  accessToken,
}: SemanticSearchProps) {
  const [tabs, setTabs] = useState<SearchTab[]>([
    { id: '1', query: '', results: [] },
  ])
  const [activeTab, setActiveTab] = useState('1')
  const [loading, setLoading] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [highlightedTerm, setHighlightedTerm] = useState<string>('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null,
  )

  // Initialize Supabase client with auth context and access token
  const supabase = createClientComponentClient({
    options: {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    },
  })

  const getOriginalPdfPath = async (jobId: string, userGroup: string) => {
    // Query document_embeddings to get the document_name
    const { data, error } = await supabase
      .from('document_embeddings')
      .select('document_name')
      .eq('job_id', jobId)
      .eq('user_group', userGroup)
      .single()

    if (error || !data?.document_name) {
      console.error('Error getting document name:', error)
      return `${userGroup}/${jobId}/original.pdf` // fallback
    }

    return `${userGroup}/${data.document_name}/original.pdf`
  }

  const addNewTab = () => {
    const newId = (Math.max(...tabs.map((t) => parseInt(t.id))) + 1).toString()
    setTabs([...tabs, { id: newId, query: '', results: [] }])
    setActiveTab(newId)
  }

  const removeTab = (tabId: string) => {
    if (tabs.length === 1) return
    const newTabs = tabs.filter((t) => t.id !== tabId)
    setTabs(newTabs)
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1].id)
    }
  }

  const handleSearch = async (tabId: string) => {
    const currentTab = tabs.find((t) => t.id === tabId)
    if (!currentTab?.query.trim()) return

    try {
      setLoading(true)

      // Get embedding from your API
      const embeddingResponse = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text: currentTab.query }),
      })

      if (!embeddingResponse.ok) {
        throw new Error(
          `Embedding API error: ${await embeddingResponse.text()}`,
        )
      }

      const { embedding } = await embeddingResponse.json()

      if (!embedding || !Array.isArray(embedding)) {
        throw new Error('Invalid embedding format received')
      }

      // Call the hybrid search function
      const { data: searchResults, error: searchError } = await supabase.rpc(
        'hybrid_search_scoped',
        {
          query_text: currentTab.query,
          query_embedding: embedding,
          user_group_filter: userGroup,
          match_count: 10,
          similarity_threshold: 0.0001,
        },
      )

      if (searchError) {
        console.error(
          'Search error details:',
          searchError.message || searchError,
        )
        throw new Error(searchError.message || 'Search failed')
      }

      // Update transform with type and correct mapping
      const transformedResults = (searchResults || []).map(
        (result: SearchResponse) => ({
          id: result.id.toString(),
          file_path: result.job_id.toString(),
          content: result.chunk_text,
          similarity: result.similarity,
          page_number: result.page_number,
          job_id: result.job_id,
          showFullContent: false,
        }),
      )

      setTabs((prev) =>
        prev.map((t) =>
          t.id === tabId ? { ...t, results: transformedResults } : t,
        ),
      )
    } catch (error) {
      console.error(
        'Search error:',
        error instanceof Error ? error.message : 'Unknown error',
      )
      setTabs((prev) =>
        prev.map((t) => (t.id === tabId ? { ...t, results: [] } : t)),
      )
    } finally {
      setLoading(false)
    }
  }

  const getContextualSnippet = (
    text: string,
    query: string,
    contextLength: number = 200,
  ) => {
    if (!text) return ''

    // Split text into sentences
    const sentences = text.split(/[.!?]+\s+/)

    // Score each sentence based on semantic similarity to query
    // For now, we'll use basic keyword matching, but this could be enhanced
    // with another embedding comparison if needed
    const scoredSentences = sentences.map((sentence) => ({
      text: sentence,
      score: query
        .toLowerCase()
        .split(' ')
        .reduce((score, word) => {
          return score + (sentence.toLowerCase().includes(word) ? 1 : 0)
        }, 0),
    }))

    // Sort by score and take the top sentences
    const topSentences = scoredSentences
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.text)

    // If no matches found, return the first part of the text
    if (topSentences.length === 0) {
      return text.slice(0, contextLength)
    }

    // Join the relevant sentences
    return topSentences.join('. ') + '.'
  }

  // Add function to get surrounding chunks
  const getSurroundingText = async (result: SearchResult) => {
    try {
      console.log('Fetching surrounding text for:', {
        id: result.id,
        job_id: result.job_id,
      })

      // Use the same hybrid search function but with the chunk ID
      const { data: searchResults, error } = await supabase.rpc(
        'hybrid_search_scoped',
        {
          query_text: '', // Empty query since we're searching by ID
          query_embedding: [], // Empty embedding since we're searching by ID
          user_group_filter: userGroup,
          match_count: 5, // Get 5 chunks (current + 2 before + 2 after)
          similarity_threshold: 0.0,
          chunk_id_filter: parseInt(result.id), // Add this parameter to the hybrid search function
        },
      )

      if (error) {
        console.error('Search error:', error)
        return result.content
      }

      if (!searchResults || searchResults.length === 0) {
        return result.content
      }

      // Transform and combine the results
      return searchResults
        .sort(
          (a: ChunkResponse, b: ChunkResponse) =>
            a.sequence_order - b.sequence_order,
        )
        .map((chunk: ChunkResponse) => chunk.chunk_text)
        .join('\n\n')
    } catch (error) {
      console.error('Error fetching surrounding text:', error)
      return result.content
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-4 flex items-center gap-2">
            <TabsList>
              {tabs.map((tab) => (
                <div key={tab.id} className="flex items-center">
                  <TabsTrigger value={tab.id}>
                    {tab.query
                      ? tab.query.slice(0, 20) +
                        (tab.query.length > 20 ? '...' : '')
                      : `New Search ${tab.id}`}
                  </TabsTrigger>
                  {tabs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTab(tab.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </TabsList>
            <Button variant="outline" size="sm" onClick={addNewTab}>
              New Search
            </Button>
          </div>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your search query..."
                  value={tab.query}
                  onChange={(e) =>
                    setTabs((prev) =>
                      prev.map((t) =>
                        t.id === tab.id ? { ...t, query: e.target.value } : t,
                      ),
                    )
                  }
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(tab.id)}
                  className="flex-1"
                />
                <Button onClick={() => handleSearch(tab.id)} disabled={loading}>
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

              {tab.results.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto mt-4 flex items-center gap-2"
                    onClick={() => setShowSummary(true)}
                  >
                    <Bot className="h-4 w-4" />
                    View Analysis
                  </Button>
                  <SummaryPanel
                    results={tab.results}
                    isOpen={showSummary}
                    onClose={() => {
                      setShowSummary(false)
                      setHighlightedTerm('')
                    }}
                    onTermClick={(term: string) => {
                      setHighlightedTerm(term)
                      setShowSummary(false)
                    }}
                    handleSearch={handleSearch}
                    setTabs={setTabs}
                    setActiveTab={setActiveTab}
                    tabs={tabs}
                  />
                </>
              )}

              <div className="mt-4 space-y-4">
                {tab.results.map((result) => (
                  <Card
                    key={result.id}
                    className="rounded-lg border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex justify-start">
                      <p className="text-sm font-medium">
                        Similarity: {(result.similarity * 100).toFixed(2)}%
                      </p>
                    </div>
                    {result.content && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-muted-foreground">
                          Most relevant text:
                        </p>
                        <p className="mt-1 rounded bg-muted p-2">
                          <Highlight
                            text={
                              result.showFullContent
                                ? result.content
                                : getContextualSnippet(
                                    result.content,
                                    highlightedTerm || tab.query,
                                  )
                            }
                            query={highlightedTerm || tab.query}
                            className="whitespace-pre-wrap [&_span]:rounded-sm [&_span]:bg-primary/20 [&_span]:px-1 [&_span]:py-0.5"
                          />
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-border hover:bg-accent hover:text-accent-foreground"
                            onClick={async () => {
                              if (!result.showFullContent) {
                                const expandedContent =
                                  await getSurroundingText(result)
                                setTabs((prev) =>
                                  prev.map((t) =>
                                    t.id === activeTab
                                      ? {
                                          ...t,
                                          results: t.results.map((r) =>
                                            r.id === result.id
                                              ? {
                                                  ...r,
                                                  content: expandedContent,
                                                  showFullContent: true,
                                                }
                                              : r,
                                          ),
                                        }
                                      : t,
                                  ),
                                )
                              } else {
                                setTabs((prev) =>
                                  prev.map((t) =>
                                    t.id === activeTab
                                      ? {
                                          ...t,
                                          results: t.results.map((r) =>
                                            r.id === result.id
                                              ? { ...r, showFullContent: false }
                                              : r,
                                          ),
                                        }
                                      : t,
                                  ),
                                )
                              }
                            }}
                          >
                            {result.showFullContent ? 'Show Less' : 'Show More'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-border hover:bg-accent hover:text-accent-foreground"
                            onClick={async () => {
                              setSelectedResult(result)
                              try {
                                const pdfPath = await getOriginalPdfPath(
                                  result.job_id.toString(),
                                  userGroup,
                                )
                                console.log('Fetching PDF from path:', pdfPath)

                                const { data, error } = await supabase.storage
                                  .from('user_objects')
                                  .download(pdfPath)

                                if (error) {
                                  console.error('PDF fetch error:', error)
                                  return
                                }

                                const blob = new Blob([data], {
                                  type: 'application/pdf',
                                })
                                const url = URL.createObjectURL(blob)
                                setPdfUrl(url)
                              } catch (error) {
                                console.error('Failed to fetch PDF:', error)
                              }
                            }}
                          >
                            View Full Doc
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
                {tab.results.length === 0 && !loading && tab.query && (
                  <p className="text-center text-muted-foreground">
                    No results found
                  </p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <Dialog
        open={!!pdfUrl}
        onOpenChange={() => {
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl)
            setPdfUrl(null)
          }
        }}
      >
        <DialogContent className="h-[90vh] max-w-[45vw] gap-0 border border-border p-0">
          <DialogHeader className="border-b border-border px-4 py-2">
            <DialogTitle className="text-lg font-medium">
              Document Viewer - Page {selectedResult?.page_number || 1}
            </DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <div className="relative h-full w-full">
              <iframe
                src={`${pdfUrl}#page=${selectedResult?.page_number || 1}`}
                className="h-[calc(90vh-3rem)] w-full"
                title="PDF Viewer"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
