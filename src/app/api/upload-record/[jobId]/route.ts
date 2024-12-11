import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } },
) {
  try {
    const { jobId } = await Promise.resolve(params)
    const { user_id, user_group } = await request.json()

    const apiUrl = new URL(
      `/api/v1/upload-record/${jobId}`,
      process.env.NEXT_PUBLIC_API_BASE_URL,
    )

    apiUrl.searchParams.append('user_group', user_group)
    apiUrl.searchParams.append('user_id', user_id)

    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
        ).toString('base64')}`,
      },
      body: JSON.stringify({
        kwargs: {
          job_id: parseInt(jobId),
          bucket_name: 'user_objects',
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Upload failed: ${response.status} - ${error}`)
    }

    return NextResponse.json(await response.json())
  } catch (error: any) {
    console.error('[Server] Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
