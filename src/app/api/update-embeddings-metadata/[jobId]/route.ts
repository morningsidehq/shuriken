import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const { jobId } = await Promise.resolve(params)
    const userGroup = request.nextUrl.searchParams.get('user_group')

    if (!userGroup) {
      return NextResponse.json(
        { error: 'user_group is required' },
        { status: 400 },
      )
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let retryCount = 0
    let existingRecords = null

    // Retry loop with more detailed logging
    while (retryCount < MAX_RETRIES) {
      // First, try a simple count query
      const { count, error: countError } = await supabase
        .from('document_embeddings')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', parseInt(jobId))

      if (countError) {
        console.error(`[Server] Error getting count:`, countError)
        throw countError
      }

      console.log(`Total records for job_id ${jobId}:`, count)

      // Then try our specific query
      const { data, error: checkError } = await supabase
        .from('document_embeddings')
        .select('id, job_id, user_group, user_id')
        .eq('job_id', parseInt(jobId))
        .eq('user_group', 'default')
        .is('user_id', null)

      if (checkError) {
        console.error(
          `[Server] Error checking records (attempt ${retryCount + 1}):`,
          checkError,
        )
        throw checkError
      }

      console.log(
        `Found ${data?.length || 0} records matching criteria on attempt ${
          retryCount + 1
        }`,
      )

      if (data && data.length > 0) {
        existingRecords = data
        break
      }

      console.log(
        `No records found, attempt ${
          retryCount + 1
        } of ${MAX_RETRIES}. Waiting ${RETRY_DELAY}ms...`,
      )
      await sleep(RETRY_DELAY)
      retryCount++
    }

    if (!existingRecords?.length) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'No matching records found to update after retries',
          attempts: retryCount + 1,
        },
        { status: 404 },
      )
    }

    console.log(
      `Found ${existingRecords.length} records to update after ${
        retryCount + 1
      } attempts`,
    )

    // Proceed with update once records are found
    const { data: updatedRecords, error } = await supabase
      .from('document_embeddings')
      .update({
        user_group: userGroup,
        user_id: user.id,
      })
      .eq('job_id', parseInt(jobId))
      .eq('user_group', 'default')
      .is('user_id', null)
      .select()

    if (error) {
      console.error('[Server] Supabase update error:', error)
      throw error
    }

    return NextResponse.json({
      status: 'success',
      message: `Updated metadata for embeddings with job_id: ${jobId}`,
      recordsFound: existingRecords.length,
      recordsUpdated: updatedRecords?.length || 0,
      attempts: retryCount + 1,
      updated: updatedRecords,
    })
  } catch (error: any) {
    console.error('[Server] Update embeddings metadata error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update embeddings metadata' },
      { status: 500 },
    )
  }
}
