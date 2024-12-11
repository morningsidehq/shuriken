import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const jobId = params.jobId

    const response = await fetch(
      `http://143.198.22.202:8000/api/v1/status/${jobId}`,
      {
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
      throw new Error(`Status API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Server] Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check processing status' },
      { status: 500 },
    )
  }
}
