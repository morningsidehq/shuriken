import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const per_page = parseInt(searchParams.get('per_page') || '10')
  const type = searchParams.get('type')
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const assigned_to = searchParams.get('assigned_to')

  try {
    let query = supabase.from('actions').select('*', { count: 'exact' })

    // Apply filters
    if (type) query = query.eq('action_type', type)
    if (status) query = query.eq('status', status)
    if (priority) query = query.eq('priority', priority)
    if (assigned_to) query = query.eq('created_by', assigned_to)

    // Add pagination
    query = query
      .order('date_created', { ascending: false })
      .range((page - 1) * per_page, page * per_page - 1)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      actions: data,
      total: count,
      page,
      per_page,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching actions' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    const data = await request.json()
    const { data: newAction, error } = await supabase
      .from('actions')
      .insert([data])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ action: newAction })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating action' },
      { status: 500 },
    )
  }
}
