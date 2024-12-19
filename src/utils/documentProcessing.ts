interface ProcessingResponse {
  document_id: string
  status: string
  message: string
  queue_position: number
}

interface ProcessingStatus {
  step: string
  progress: number
  detail?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function processDocument(
  file: File,
  updateStatus: (status: Partial<ProcessingStatus>) => void,
  userId: string,
  documentName: string,
  accessToken: string,
  userGroup: string,
  retryCount = 3,
): Promise<ProcessingResponse> {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      updateStatus({
        step: 'Uploading',
        progress: 25,
        detail:
          attempt > 1
            ? `Retrying... (Attempt ${attempt}/${retryCount})`
            : 'Preparing document...',
      })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_name', documentName)
      formData.append('user_group', userGroup)

      // Create Basic Auth header for API access
      const username = process.env.NEXT_PUBLIC_MFCO_API_USERNAME
      const password = process.env.NEXT_PUBLIC_MFCO_API_PASSWORD
      const basicAuth = btoa(`${username}:${password}`)

      // Format user's Bearer token
      const bearerToken = accessToken.startsWith('Bearer ')
        ? accessToken
        : `Bearer ${accessToken}`

      // Add user_id as query parameter
      const url = new URL(`${API_URL}api/v1/winston/queue`)
      url.searchParams.append('user_id', userId)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'X-User-Token': bearerToken,
          Accept: 'application/json',
          Origin: window.location.origin,
        },
        mode: 'cors',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = 'Failed to queue document'
        try {
          const errorData = await response.json()
          console.error('API Response:', errorData)

          if (response.status === 401) {
            errorMessage = errorData.detail?.includes('Not authenticated')
              ? 'User session expired. Please log in again.'
              : 'API authentication failed. Please contact support.'
          } else if (response.status === 403) {
            errorMessage = 'Access forbidden. Please check your permissions.'
          } else if (response.status === 429) {
            errorMessage = 'Too many requests. Please try again later.'
          } else {
            errorMessage =
              errorData.detail ||
              errorData.message ||
              'Failed to queue document'
          }
        } catch (e) {
          errorMessage = `Server error (${response.status})`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result
    } catch (error: any) {
      console.error(
        `[Client] Queue error (attempt ${attempt}/${retryCount}):`,
        error,
      )

      // On last attempt, throw the error
      if (attempt === retryCount) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error(
            'Unable to connect to the server. Please check your internet connection or contact support if the issue persists.',
          )
        }
        throw error
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 5000)),
      )
    }
  }

  // This should never be reached due to the throw in the last retry
  throw new Error('Failed to upload document after all retry attempts')
}

export async function checkDocumentStatus(
  documentId: string,
  accessToken: string,
): Promise<ProcessingResponse> {
  const response = await fetch(`/api/documents?id=${documentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken.replace('Bearer ', '')}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to check document status')
  }

  return response.json()
}
