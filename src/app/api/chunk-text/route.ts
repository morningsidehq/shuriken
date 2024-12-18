import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json()

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    const response = await fetch(
      `http://143.198.22.202:8000/api/v1/chunk-text/${jobId}`,
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
      },
    )

    if (!response.ok) {
      throw new Error(`Chunking API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Server] Chunk text error:', error)
    return NextResponse.json({ error: 'Failed to chunk text' }, { status: 500 })
  }
}
