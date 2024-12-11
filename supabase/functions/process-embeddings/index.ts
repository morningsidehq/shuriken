// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get request data
    const { filePath } = await req.json()

    if (!filePath) {
      throw new Error('File path is required')
    }

    console.log('Processing file:', filePath)

    // Download embeddings file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user_objects')
      .download(filePath)

    if (downloadError) {
      throw new Error(`Download error: ${downloadError.message}`)
    }

    // Parse the JSON content
    const content = await fileData.text()
    const embeddings = JSON.parse(content)

    // Extract job_id and user_group from path
    const pathParts = filePath.split('/')
    const userGroup = pathParts[0]
    const jobId = pathParts[1]

    console.log(`Processing embeddings for job ${jobId} in group ${userGroup}`)

    // Process each embedding record
    for (const record of embeddings.results) {
      const { error: upsertError } = await supabase
        .from('document_embeddings')
        .upsert({
          id: jobId,
          content: record.text.text,
          embedding: record.embedding,
          metadata: {
            page: record.page || 1,
            start_char: record.text.start_char,
            end_char: record.text.end_char,
          },
          user_group: userGroup,
        })

      if (upsertError) {
        throw new Error(`Upsert error: ${upsertError.message}`)
      }
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        processed: embeddings.results.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    // Log and return error response
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-embeddings' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
