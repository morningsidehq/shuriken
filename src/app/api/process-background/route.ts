import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 300 // 5 minutes

export async function POST(request: NextRequest) {
  const { jobId, baseFilePath, userGroup } = await request.json()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  )

  try {
    // 1. Process chunks
    await supabase
      .from('processing_jobs')
      .update({ current_step: 'chunking', progress: 50 })
      .eq('job_id', jobId)

    const chunkResponse = await fetch(
      `http://143.198.22.202:8000/api/v1/chunk-text/${jobId}`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
            ).toString('base64'),
        },
      },
    )

    if (!chunkResponse.ok) {
      throw new Error('Chunking failed')
    }

    // 2. Generate embeddings
    await supabase
      .from('processing_jobs')
      .update({ current_step: 'embeddings', progress: 75 })
      .eq('job_id', jobId)

    const embeddingsResponse = await fetch(
      `http://143.198.22.202:8000/api/v1/generate-embeddings/${jobId}`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
            ).toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base_file_path: baseFilePath }),
      },
    )

    if (!embeddingsResponse.ok) {
      throw new Error('Embeddings generation failed')
    }

    // 3. Upload files to Supabase
    await supabase
      .from('processing_jobs')
      .update({ current_step: 'uploading', progress: 90 })
      .eq('job_id', jobId)

    // Upload processed files to Supabase with user_group
    const uploadResponse = await fetch(
      `http://143.198.22.202:8000/api/v1/upload-to-supabase/${jobId}`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
            ).toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          supabase_key: process.env.SUPABASE_SERVICE_KEY,
          base_file_path: baseFilePath,
          user_group: userGroup,
        }),
      },
    )

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload files to Supabase')
    }

    // 4. Mark as complete
    await supabase
      .from('processing_jobs')
      .update({ status: 'completed', current_step: 'complete', progress: 100 })
      .eq('job_id', jobId)

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Background processing error:', error)

    // Update job status to failed
    await supabase
      .from('processing_jobs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('job_id', jobId)

    return NextResponse.json(
      { error: 'Background processing failed' },
      { status: 500 },
    )
  }
}
