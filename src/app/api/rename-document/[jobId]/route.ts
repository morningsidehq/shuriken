import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    const { new_name, user_group } = await request.json()

    if (!new_name) {
      return NextResponse.json({
        status: 'skipped',
        message: 'No name provided',
      })
    }

    const { data, error } = await supabase.rpc('rename_document_folder', {
      job_id: params.jobId,
      new_name,
      user_group,
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      throw error
    }

    console.log('Rename operation result:', data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Rename error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
