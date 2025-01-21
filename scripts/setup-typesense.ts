import Typesense from 'typesense'
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT!),
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL!,
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_ADMIN_KEY!,
  connectionTimeoutSeconds: 2,
})

const schema: CollectionCreateSchema = {
  name: 'records',
  fields: [
    { name: 'file_name', type: 'string' as const },
    { name: 'type', type: 'string' as const },
    { name: 'agencies.name', type: 'string' as const },
    { name: 'status', type: 'string' as const },
    { name: 'date_created', type: 'string' as const },
    { name: 'tags', type: 'string[]' as const, optional: true },
    { name: 'entities', type: 'string[]' as const, optional: true },
    { name: 'object_upload_url', type: 'string' as const },
  ],
  default_sorting_field: 'date_created',
}

// Get session token before operations
async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

async function setupTypesense() {
  try {
    const headers = await getAuthHeaders()

    // Delete if exists
    try {
      await client.collections('records').delete()
    } catch (error) {
      // Collection might not exist, ignore
    }

    // Create collection with auth headers
    await client.collections().create(schema, { headers })
    console.log('Typesense collection created successfully')
  } catch (error) {
    console.error('Error setting up Typesense:', error)
  }
}

setupTypesense()
