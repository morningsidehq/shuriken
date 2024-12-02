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

export const processDocument = async (file: File, basePath: string) => {
  const supabase = createBrowserClient()

  // Upload original PDF
  const { error: uploadError } = await supabase.storage
    .from('user_objects')
    .upload(`${basePath}/original.pdf`, file, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadError) throw uploadError

  // Process each component in parallel
  await Promise.all([
    classifyDocument(file, basePath),
    generateMetadata(file, basePath),
    chunkDocument(file, basePath),
  ])
}

const classifyDocument = async (file: File, basePath: string) => {
  const classification: ClassificationData = {
    document_type: 'minutes',
    agency: 'Appomattox (Town)',
    date_created: new Date().toISOString().split('T')[0],
    tags: [],
    description: '',
    external_object_urls: [],
    entities: [],
    title: file.name,
    addresses: [],
    taxmap_plat_ids: [],
  }

  // Create JSON blob with proper MIME type
  const classificationString = JSON.stringify(classification, null, 2)
  const classificationBlob = new Blob([classificationString], {
    type: 'application/json',
  })

  const supabase = createBrowserClient()
  const { error } = await supabase.storage
    .from('user_objects')
    .upload(`${basePath}/classification.json`, classificationBlob, {
      contentType: 'application/json',
      upsert: true,
    })

  if (error) {
    console.error('Classification upload error:', error)
    throw error
  }

  return classification
}

const generateMetadata = async (file: File, basePath: string) => {
  const metadata: MetadataData = {
    file_size: file.size,
    page_count: 0,
    created_date: new Date().toISOString(),
    modified_date: new Date(file.lastModified).toISOString(),
  }

  const metadataString = JSON.stringify(metadata, null, 2)
  const metadataBlob = new Blob([metadataString], {
    type: 'application/json',
  })

  const supabase = createBrowserClient()
  const { error } = await supabase.storage
    .from('user_objects')
    .upload(`${basePath}/metadata.json`, metadataBlob, {
      contentType: 'application/json',
      upsert: true,
    })

  if (error) {
    console.error('Metadata upload error:', error)
    throw error
  }

  return metadata
}

const chunkDocument = async (file: File, basePath: string) => {
  // TODO: Replace with actual PDF chunking logic using the file
  const chunks: string[] = ['Example page 1', 'Example page 2']
  const supabase = createBrowserClient()

  for (let i = 0; i < chunks.length; i++) {
    const pageNumber = i + 1
    const pageContent = chunks[i]

    const pageBlob = new Blob([pageContent], {
      type: 'text/plain',
    })

    const { error } = await supabase.storage
      .from('user_objects')
      .upload(`${basePath}/pages/${pageNumber}/page.txt`, pageBlob, {
        contentType: 'text/plain',
        upsert: true,
      })

    if (error) {
      console.error(`Error uploading page ${pageNumber}:`, error)
      throw error
    }
  }

  return chunks
}
