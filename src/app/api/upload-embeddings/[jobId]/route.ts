import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const { jobId } = await Promise.resolve(params)

    // Get embeddings from FastAPI
    const apiUrl = new URL(
      `/api/v1/upload-embeddings/${jobId}`,
      process.env.NEXT_PUBLIC_API_BASE_URL,
    )

    console.log('[Server] Uploading embeddings for job:', jobId)
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
          ).toString('base64'),
      },
    })

    // Log the raw response for debugging
    const responseText = await response.text()
    console.log('[Server] FastAPI Response:', responseText)

    if (!response.ok) {
      throw new Error(`FastAPI Error: ${responseText}`)
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[Server] FastAPI upload embeddings error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload embeddings' },
      { status: 500 },
    )
  }
}
