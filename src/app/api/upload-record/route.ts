import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Server] Upload Record - Request body:', body)

    const { jobId, baseFilePath } = body

    if (!jobId || !baseFilePath) {
      throw new Error('Missing required parameters: jobId or baseFilePath')
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/upload-record/${jobId}`
    console.log('[Server] Calling API:', apiUrl)

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
          ).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base_file_path: baseFilePath,
        bucket_name: 'user_objects',
      }),
    })

    console.log('[Server] API Response status:', apiResponse.status)

    const responseText = await apiResponse.text()
    console.log('[Server] API Response body:', responseText)

    if (!apiResponse.ok) {
      return NextResponse.json(
        {
          error: `API Error: ${responseText}`,
          status: apiResponse.status,
          url: apiUrl,
          requestBody: {
            base_file_path: baseFilePath,
            bucket_name: 'user_objects',
          },
        },
        { status: apiResponse.status },
      )
    }

    // Parse the response text as JSON if it's valid
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.log('[Server] Response is not JSON:', responseText)
      data = { message: responseText }
    }

    console.log('[Server] Processed response:', data)

    return NextResponse.json({
      success: true,
      data,
      uploadDetails: {
        jobId,
        baseFilePath,
        bucket: 'user_objects',
      },
    })
  } catch (error: any) {
    console.error('[Server] Error:', error)
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
