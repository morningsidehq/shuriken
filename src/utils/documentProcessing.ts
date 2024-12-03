import { createBrowserClient } from '@/utils/supabase'

interface ClassificationData {
  document_type: string
  agency: string
  date_created: string
  tags: string[]
  description: string
  external_object_urls: string[]
  entities: string[]
  title: string
  addresses: string[]
  taxmap_plat_ids: string[]
}

interface MetadataData {
  // Define metadata structure
  file_size: number
  page_count: number
  created_date: string
  modified_date: string
  author?: string
  // Add other metadata fields
}

interface ProcessingResponse {
  job_id: string
  status: string
}

export async function processDocument(file: File, baseFilePath: string) {
  try {
    // Step 1: Process PDF
    console.log('[Client] Starting document processing for:', file.name)
    const formData = new FormData()
    formData.append('file', file)

    const processResponse = await fetch('/api/process-document', {
      method: 'POST',
      body: formData,
    })

    if (!processResponse.ok) {
      const error = await processResponse.json()
      throw new Error(error.message || 'Failed to process PDF')
    }

    const processResult: ProcessingResponse = await processResponse.json()
    const jobId = processResult.job_id

    console.log('[Client] Process document response:', processResult)

    // Step 2: Chunk the text
    console.log('[Client] Starting text chunking for job:', jobId)
    const chunkResponse = await fetch('/api/chunk-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobId }),
    })

    if (!chunkResponse.ok) {
      const error = await chunkResponse.json()
      throw new Error(error.message || 'Failed to chunk text')
    }

    const chunkResult = await chunkResponse.json()
    console.log('[Client] Chunk text response:', chunkResult)

    // Step 3: Upload record
    console.log('[Client] Starting record upload for job:', jobId)
    const uploadResponse = await fetch('/api/upload-record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        baseFilePath,
      }),
    })

    const uploadResult = await uploadResponse.json()
    console.log('[Client] Upload record response:', uploadResult)

    if (!uploadResponse.ok) {
      throw new Error(uploadResult.error || 'Failed to upload record')
    }

    return uploadResult
  } catch (error: any) {
    console.error('[Client] Document processing error:', error)
    throw error
  }
}
