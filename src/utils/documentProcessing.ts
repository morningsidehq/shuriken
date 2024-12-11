interface ProcessingResponse {
  job_id: string
  status: string
}

interface ProcessingStatus {
  step: string
  progress: number
  detail?: string
  jobId?: string
}

export async function processDocument(
  file: File,
  updateStatus: (status: Partial<ProcessingStatus>) => void,
  userGroup: string,
) {
  try {
    // Step 1: Queue PDF
    const formData = new FormData()
    formData.append('file', file)

    const queueResponse = await fetch('/api/queue-pdf', {
      method: 'POST',
      body: formData,
    })

    if (!queueResponse.ok) {
      const error = await queueResponse.json()
      throw new Error(error.message || 'Failed to queue PDF')
    }

    const queueResult: ProcessingResponse = await queueResponse.json()
    const jobId = queueResult.job_id

    // Step 2: Check Origin
    updateStatus({
      step: 'Checking Origin',
      progress: 20,
      detail: 'Determining document origin...',
      jobId,
    })

    const originResponse = await fetch(`/api/check-origin/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!originResponse.ok) {
      const error = await originResponse.json()
      throw new Error(error.message || 'Failed to check origin')
    }

    const originResult = await originResponse.json()
    const isDigital = originResult.origin === 'digital'

    // Step 3: Process based on origin
    if (isDigital) {
      updateStatus({
        step: 'Extracting Text',
        progress: 40,
        detail: 'Extracting text from digital PDF...',
        jobId,
      })

      const textResponse = await fetch(`/api/pdf-to-text/${jobId}`, {
        method: 'POST',
      })

      if (!textResponse.ok) {
        const error = await textResponse.json()
        throw new Error(error.message || 'Failed to extract text from PDF')
      }
    } else {
      updateStatus({
        step: 'Converting PDF to Images',
        progress: 40,
        detail: 'Converting scanned PDF to images...',
        jobId,
      })

      const imageResponse = await fetch(`/api/pdf2image/${jobId}`, {
        method: 'POST',
      })

      if (!imageResponse.ok) {
        const error = await imageResponse.json()
        throw new Error(error.message || 'Failed to convert PDF to images')
      }

      updateStatus({
        step: 'Performing OCR',
        progress: 60,
        detail: 'Extracting text from images...',
        jobId,
      })

      const ocrResponse = await fetch(`/api/ocr/${jobId}`, {
        method: 'POST',
      })

      if (!ocrResponse.ok) {
        const error = await ocrResponse.json()
        throw new Error(error.message || 'Failed to perform OCR')
      }
    }

    // Step 4: Classify Document
    updateStatus({
      step: 'Classifying Document',
      progress: 70,
      detail: 'Classifying document content...',
      jobId,
    })

    const classifyResponse = await fetch(`/api/classify/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_group: userGroup,
      }),
    })

    if (!classifyResponse.ok) {
      const error = await classifyResponse.json()
      throw new Error(error.message || 'Failed to classify document')
    }

    // Step 5: Chunk the text
    updateStatus({
      step: 'Chunking Text',
      progress: 75,
      detail: 'Breaking down document into analyzable segments...',
      jobId,
    })

    const chunkResponse = await fetch(`/api/chunk-text/${jobId}`, {
      method: 'POST',
    })

    if (!chunkResponse.ok) {
      const error = await chunkResponse.json()
      throw new Error(error.message || 'Failed to chunk text')
    }

    // Step 5.5: Upload to Supabase
    updateStatus({
      step: 'Uploading to Supabase',
      progress: 80,
      detail: 'Storing document in database...',
      jobId,
    })

    const uploadToSupabaseResponse = await fetch(
      `/api/upload-record/${jobId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_group: userGroup,
        }),
      },
    )

    if (!uploadToSupabaseResponse.ok) {
      const error = await uploadToSupabaseResponse.json()
      throw new Error(error.message || 'Failed to upload to Supabase')
    }

    await uploadToSupabaseResponse.json() // Wait for completion

    // Step 6: Generate embeddings
    updateStatus({
      step: 'Generating Embeddings',
      progress: 85,
      detail: 'Creating semantic embeddings for search...',
      jobId,
    })

    const embeddingsResponse = await fetch(
      `/api/generate-embeddings/${jobId}`,
      {
        method: 'POST',
      },
    )

    if (!embeddingsResponse.ok) {
      const error = await embeddingsResponse.json()
      throw new Error(error.message || 'Failed to generate embeddings')
    }

    // Step 7: Upload embeddings
    updateStatus({
      step: 'Uploading Embeddings',
      progress: 95,
      detail: 'Storing embeddings for search...',
      jobId,
    })

    const uploadEmbeddingsResponse = await fetch(
      `/api/upload-embeddings/${jobId}?user_group=${userGroup}`,
      { method: 'POST' },
    )

    if (!uploadEmbeddingsResponse.ok) {
      const error = await uploadEmbeddingsResponse.json()
      throw new Error(error.message || 'Failed to upload embeddings')
    }

    const finalResult = await uploadEmbeddingsResponse.json()

    // After successful embeddings upload
    const metadataResponse = await fetch(
      `/api/update-embeddings-metadata/${jobId}?user_group=${userGroup}`,
      { method: 'POST' },
    )

    if (!metadataResponse.ok) {
      const error = await metadataResponse.json()
      throw new Error(error.message || 'Failed to update embeddings metadata')
    }

    return { ...finalResult, jobId }
  } catch (error: any) {
    console.error('[Client] Document processing error:', error)
    throw error
  }
}
