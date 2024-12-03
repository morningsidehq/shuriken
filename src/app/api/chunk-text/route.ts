import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { jobId } = await request.json()

  try {
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
        },
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chunking error:', error)
    return NextResponse.json({ error: 'Failed to chunk text' }, { status: 500 })
  }
}
