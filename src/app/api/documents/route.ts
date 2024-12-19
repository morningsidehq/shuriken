import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mfcoapi.com/'

export async function POST() {
  return NextResponse.json(
    { error: 'Please use Winston API directly' },
    { status: 400 },
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')
    const authHeader = request.headers.get('authorization')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 },
      )
    }

    if (!authHeader) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const response = await fetch(
      `${API_URL}api/v1/winston/status/${documentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      },
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching document status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document status' },
      { status: 500 },
    )
  }
}
