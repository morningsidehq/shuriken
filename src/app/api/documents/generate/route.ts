import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') // Remove trailing slash if present
const API_USERNAME = process.env.NEXT_PUBLIC_MFCO_API_USERNAME
const API_PASSWORD = process.env.NEXT_PUBLIC_MFCO_API_PASSWORD

export async function POST(request: NextRequest) {
  try {
    console.log('API endpoint hit:', request.url)

    // Validate environment variables
    if (!API_URL || !API_USERNAME || !API_PASSWORD) {
      const missingVars = [
        !API_URL && 'API_URL',
        !API_USERNAME && 'API_USERNAME',
        !API_PASSWORD && 'API_PASSWORD',
      ].filter(Boolean)

      console.error('Missing environment variables:', missingVars.join(', '))
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: `Missing: ${missingVars.join(', ')}`,
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    console.log('Incoming request body:', {
      ...body,
      user_id: '[REDACTED]',
    })

    const {
      title,
      instructions,
      context,
      format,
      document_type,
      document_date,
      user_group,
      user_id,
    } = body

    // Validate required fields
    if (!title || !instructions || !format || !document_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Basic auth credentials
    const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString(
      'base64',
    )
    const apiUrl = `${API_URL}/api/v1/document/generate`

    console.log('Calling MFCO API:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        title,
        instructions,
        context: context || '',
        format,
        document_type,
        document_date: document_date || new Date().toISOString(),
        user_group,
        user_id,
        metadata: {
          user_group,
          user_id,
        },
      }),
    })

    console.log('API Response Status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error Response:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to generate document' },
        { status: response.status },
      )
    }

    const document = await response.blob()
    console.log('Document received, size:', document.size)

    const contentTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      csv: 'text/csv',
    }

    return new NextResponse(document, {
      headers: {
        'Content-Type': contentTypes[format] || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${title}.${format}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Document generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 },
    )
  }
}
