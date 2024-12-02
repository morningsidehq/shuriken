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

const clusterDocuments = (
  results: SearchResult[],
): { cluster: number; docs: SearchResult[] }[] => {
  const similarityThreshold = 0.7 // Adjust as needed
  const clusters: SearchResult[][] = []

  results.forEach((doc) => {
    let addedToCluster = false

    for (const cluster of clusters) {
      const avgSimilarity =
        cluster.reduce(
          (sum, clusterDoc) => sum + clusterDoc.similarity * doc.similarity,
          0,
        ) / cluster.length

      if (avgSimilarity > similarityThreshold) {
        cluster.push(doc)
        addedToCluster = true
        break
      }
    }

    if (!addedToCluster) {
      clusters.push([doc])
    }
  })

  return clusters.map((docs, i) => ({ cluster: i + 1, docs }))
}

const generateResultsSummary = (results: SearchResult[]) => {
  if (!results.length) return null

  const avgSimilarity =
    results.reduce((sum, r) => sum + r.similarity, 0) / results.length
  const fileTypes = new Set(results.map((r) => r.metadata.mimetype))
  const totalSize = results.reduce((sum, r) => sum + (r.metadata.size || 0), 0)
  const commonWords = findCommonWords(results)
  const clusters = clusterDocuments(results)

  return {
    count: results.length,
    avgSimilarity,
    fileTypes: Array.from(fileTypes),
    totalSize,
    paths: results.map((r) => r.file_path),
    commonWords,
    clusters,
  }
}

type SummaryPanelProps = {
  results: SearchResult[]
  isOpen: boolean
  onClose: () => void
  onTermClick: (term: string) => void
  setQuery: (tabId: string, query: string) => void
  handleSearch: (tabId: string) => Promise<void>
  activeTabId: string
  setTabs: React.Dispatch<React.SetStateAction<SearchTab[]>>
  setActiveTab: (id: string) => void
  tabs: SearchTab[]
}

const SummaryPanel = ({
  results,
  isOpen,
  onClose,
  onTermClick,
  setQuery,
  handleSearch,
  activeTabId,
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
          'fixed right-0 top-0 z-50 h-full w-96 transform border-l bg-background/95 shadow-lg transition-transform duration-300 ease-in-out',
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
                I found {summary.count} matching documents with an average
                similarity of {(summary.avgSimilarity * 100).toFixed(2)}%. The
                total size is {formatFileSize(summary.totalSize)}.
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
                Here are the Most Common Terms I found in the files:
              </h4>
              <div className="space-y-2">
                {summary.commonWords.map(({ word, count }) => (
                  <div
                    key={word}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
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
                        onClick={() => {
                          const newId = (
                            Math.max(...tabs.map((t) => parseInt(t.id))) + 1
                          ).toString()
                          setTabs((prev) => [
                            ...prev,
                            { id: newId, query: word, results: [] },
                          ])
                          setActiveTab(newId)
                          handleSearch(newId)
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
              <h4 className="mb-2 text-sm font-medium">Document Groups</h4>
              <div className="space-y-3">
                {summary.clusters.map(({ cluster, docs }) => (
                  <div key={cluster} className="text-sm">
                    <p className="text-muted-foreground">
                      Group {cluster} contains {docs.length} related document
                      {docs.length > 1 ? 's' : ''}:
                    </p>
                    <ul className="ml-4 mt-1 list-disc space-y-1 text-xs">
                      {docs.map((d) => (
                        <li key={d.id}>{d.file_path.split('/').pop()}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

type SearchTab = {
  id: string
  query: string
  results: SearchResult[]
}

export function SemanticSearch() {
  const [tabs, setTabs] = useState<SearchTab[]>([
    { id: '1', query: '', results: [] },
  ])
  const [activeTab, setActiveTab] = useState('1')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()
  const [showSummary, setShowSummary] = useState(false)
  const [highlightedTerm, setHighlightedTerm] = useState<string>('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const fetchTextContent = async (result: SearchResult) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .download(result.file_path)

      if (error) throw error

      const text = await data.text()
      return text
    } catch (error) {
      console.error('Error fetching text content:', error)
      return undefined
    }
  }

  const getOriginalPdfPath = (pagePath: string): string => {
    const parts = pagePath.split('/')
    if (parts.length < 5) return pagePath

    const townName = parts[0]
    const folderNumber = parts[1]
    return `${townName}/${folderNumber}/original.pdf`
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

      const embeddingResponse = await fetch('/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentTab.query }),
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

      const { data, error } = (await supabase.rpc('hybrid_search', {
        query_text: currentTab.query,
        query_embedding: formattedEmbedding,
        match_count: 5,
        similarity_threshold: 0.0001,
      })) as { data: SearchResult[] | null; error: any }

      if (error) throw error

      // Fetch text content for each result
      const resultsWithContent = await Promise.all(
        (data || []).map(async (result: SearchResult) => {
          const content = await fetchTextContent(result)
          return { ...result, content }
        }),
      )

      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === tabId ? { ...tab, results: resultsWithContent } : tab,
        ),
      )
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getContextualSnippet = (
    text: string,
    query: string,
    contextLength: number = 100,
  ) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return text.slice(0, contextLength)

    const start = Math.max(0, index - contextLength)
    const end = Math.min(text.length, index + query.length + contextLength)

    return text.slice(start, end)
  }

  const updateTabQuery = (tabId: string, newQuery: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, query: newQuery } : t)),
    )
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
                    setQuery={updateTabQuery}
                    handleSearch={handleSearch}
                    activeTabId={activeTab}
                    setTabs={setTabs}
                    setActiveTab={setActiveTab}
                    tabs={tabs}
                  />
                </>
              )}

              <div className="mt-4 space-y-4">
                {tab.results.map((result) => (
                  <Card key={result.id} className="p-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{result.file_path}</p>
                      <p className="text-sm font-medium">
                        Similarity: {(result.similarity * 100).toFixed(2)}%
                      </p>
                    </div>
                    {result.content && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium text-muted-foreground">
                          Matching text:
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
                            className="whitespace-pre-wrap"
                          />
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTabs((prev) =>
                                prev.map((t) =>
                                  t.id === tab.id
                                    ? {
                                        ...t,
                                        results: t.results.map((r) =>
                                          r.id === result.id
                                            ? {
                                                ...r,
                                                showFullContent:
                                                  !r.showFullContent,
                                              }
                                            : r,
                                        ),
                                      }
                                    : t,
                                ),
                              )
                            }}
                          >
                            {result.showFullContent ? 'Show Less' : 'Show More'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              try {
                                const pdfPath = getOriginalPdfPath(
                                  result.file_path,
                                )
                                const { data, error } = await supabase.storage
                                  .from('pdfs')
                                  .download(pdfPath)

                                if (error) return

                                const blob = new Blob([data], {
                                  type: 'application/pdf',
                                })
                                const url = URL.createObjectURL(blob)
                                setPdfUrl(url)

                                return () => URL.revokeObjectURL(url)
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
        <DialogContent className="h-[90vh] max-w-4xl p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="h-[calc(90vh-3rem)] w-full rounded-b-md"
              title="PDF Viewer"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
