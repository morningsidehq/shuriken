import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const { jobId } = await Promise.resolve(params)

    const apiUrl = new URL(
      `/api/v1/generate-embeddings/${jobId}`,
      process.env.NEXT_PUBLIC_API_BASE_URL,
    )

    console.log('[Server] Generating embeddings for job:', jobId)
    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
          ).toString('base64'),
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[Server] FastAPI generate embeddings error:', {
        status: response.status,
        body: error,
      })
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${error}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Server] Generate embeddings error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate embeddings',
      },
      { status: 500 },
    )
  }
}
