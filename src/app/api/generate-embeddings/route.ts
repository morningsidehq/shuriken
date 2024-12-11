import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { jobId, baseFilePath } = await request.json()

    if (!jobId || !baseFilePath) {
      return NextResponse.json(
        { error: 'Job ID and base file path are required' },
        { status: 400 },
      )
    }

    const response = await fetch(
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

    if (!response.ok) {
      throw new Error(
        `Embeddings API responded with status: ${response.status}`,
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Server] Generate embeddings error:', error)
    return NextResponse.json(
      { error: 'Failed to generate embeddings' },
      { status: 500 },
    )
  }
}
