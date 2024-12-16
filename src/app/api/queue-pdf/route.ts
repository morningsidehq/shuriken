import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const userGroup = formData.get('user_group')

    // Create new FormData to send to FastAPI
    const apiFormData = new FormData()
    apiFormData.append('file', file as Blob)
    apiFormData.append('user_group', userGroup as string)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/queue-pdf`,
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
            ).toString('base64'),
        },
        body: apiFormData,
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Queue PDF error:', error)
    return NextResponse.json({ error: 'Failed to queue PDF' }, { status: 500 })
  }
}
