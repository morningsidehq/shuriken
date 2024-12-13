import { NextRequest, NextResponse } from 'next/server'

const getContentType = (format: string) => {
  const contentTypes = {
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    csv: 'text/csv',
  }
  return contentTypes[format as keyof typeof contentTypes]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Request body:', body)

    // Restructure the request to use context for vector search
    const apiRequest = {
      instructions: body.instructions,
      search_context: body.context,
      document_type: body.documentType,
      title: body.title,
      format: body.format,
      user_group: body.user_group,
      user_id: body.user_id,
      document_date: body.documentDate,
    }

    console.log('API Request to external service:', apiRequest)

    const generationResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/document/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(
            `${process.env.API_USERNAME}:${process.env.API_PASSWORD}`,
          ).toString('base64')}`,
        },
        body: JSON.stringify(apiRequest),
      },
    )

    if (!generationResponse.ok) {
      const errorData = await generationResponse.json()
      console.error('Generation API error response:', {
        status: generationResponse.status,
        statusText: generationResponse.statusText,
        errorData,
      })
      throw new Error(
        JSON.stringify({
          status: generationResponse.status,
          message:
            errorData.detail ||
            errorData.message ||
            'Failed to generate document',
          error: errorData,
        }),
      )
    }

    const documentBlob = await generationResponse.blob()
    return new NextResponse(documentBlob, {
      headers: {
        'Content-Type': getContentType(body.format),
        'Content-Disposition': `attachment; filename="${body.title}.${body.format}"`,
      },
    })
  } catch (error: any) {
    console.error('Document generation error details:', {
      error: error.message,
      stack: error.stack,
    })
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
