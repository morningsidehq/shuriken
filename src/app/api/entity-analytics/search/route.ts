import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'
import { validateEnv } from '@/lib/env'

const searchQuerySchema = z.object({
  q: z.string().min(2),
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Create singleton for transformer
let embeddingGenerator: any = null

async function getEmbeddings(text: string) {
  if (!embeddingGenerator) {
    embeddingGenerator = await pipeline(
      'feature-extraction',
      'Xenova/all-mpnet-base-v2',
    )
  }

  const output = await embeddingGenerator(text, {
    pooling: 'mean',
    normalize: true,
  })

  return Array.from(output.data)
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    validateEnv()
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    console.log('API received query:', query)

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 },
      )
    }

    const validated = searchQuerySchema.parse({ q: query })
    const results = await searchEntities(validated.q)
    console.log('API returning results:', results)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API Error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

async function searchEntities(query: string): Promise<any[]> {
  try {
    // Generate embedding for the search query
    const embedding = await getEmbeddings(query)

    // Perform vector similarity search
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: 0.7, // Adjust this threshold as needed
      match_count: 10, // Adjust the number of results as needed
    })

    if (error) {
      console.error('Supabase search error:', error)
      throw error
    }

    console.log('Search query result:', data)
    return data || []
  } catch (error) {
    console.error('Vector search error:', error)
    throw error
  }
}
