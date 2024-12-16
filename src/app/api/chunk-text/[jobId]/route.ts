import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const jobId = await params.jobId
    console.log('[Server] Chunking text for job:', jobId)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chunk-text/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
            ).toString('base64'),
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Server] FastAPI response error:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
      })
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('[Server] Chunk text response:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Server] Chunk text error:', error)
    return NextResponse.json({ error: 'Failed to chunk text' }, { status: 500 })
  }
}
