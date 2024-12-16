import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const { jobId } = await Promise.resolve(params)
    console.log('[Server] Classifying document for job:', jobId)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/classify/${jobId}`,
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
      const errorText = await response.text()
      console.error('[Server] FastAPI response error:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
      })
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Server] Document classification error:', error)
    return NextResponse.json(
      { error: 'Failed to classify document' },
      { status: 500 },
    )
  }
}
