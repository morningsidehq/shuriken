import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const searchQuerySchema = z.object({
  q: z.string().min(2),
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
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

async function searchEntities(query: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('agencies')
    .select('name')
    .ilike('name', `%${query}%`)
    .limit(10)

  if (error) {
    console.error('Supabase search error:', error)
    throw error
  }

  console.log('Search query result:', data)

  return data?.map((item) => item.name) || []
}
