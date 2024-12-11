import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  _: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const { jobId } = params

    const response = await fetch(
      `http://143.198.22.202:8000/api/v1/pdf2image/${jobId}`,
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
        body: errorText,
      })
      return NextResponse.json(
        { error: `API Error: ${response.status} - ${errorText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[Server] PDF to image conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert PDF to images' },
      { status: 500 },
    )
  }
}
