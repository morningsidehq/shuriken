import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const timelineQuerySchema = z.object({
  entities: z.string().min(1),
})

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const entities = url.searchParams.get('entities')

    if (!entities) {
      return NextResponse.json(
        { error: 'Entities parameter is required' },
        { status: 400 },
      )
    }

    const validated = timelineQuerySchema.parse({ entities })
    const entityList = validated.entities
      .split(',')
      .map((e) => decodeURIComponent(e))
    const timelineData = await getTimelineData(entityList)

    return NextResponse.json(timelineData)
  } catch (error) {
    console.error('Timeline API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// interface Agency {
//     id: bigint;
//     name: string;
// }

interface RecordWithAgency {
  nanoid: string
  date_created: string
  agency: {
    name: string
  }
}

async function getTimelineData(entities: string[]) {
  // First, get the agency IDs
  const { data: agencyData, error: agencyError } = await supabase
    .from('agencies')
    .select('id, name')
    .in('name', entities)

  if (agencyError) {
    console.error('Supabase agency error:', agencyError)
    throw agencyError
  }

  const agencyIds = (agencyData || []).map((agency) => agency.id)

  // Then get the records for these agencies
  const { data, error } = (await supabase
    .from('records')
    .select(
      `
            nanoid,
            date_created,
            agency:agency_id (
                name
            )
        `,
    )
    .in('agency_id', agencyIds)
    .order('date_created', { ascending: true })) as {
    data: RecordWithAgency[] | null
    error: any
  }

  if (error) {
    console.error('Supabase timeline error:', error)
    throw error
  }

  return {
    occurrences: (data || []).map((record) => ({
      entity_name: record.agency.name,
      entity_type: 'AGENCY',
      record_date: record.date_created,
      record_id: record.nanoid,
    })),
  }
}
