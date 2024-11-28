import { pipeline, env } from '@xenova/transformers'
import { NextResponse } from 'next/server'
import * as ort from 'onnxruntime-node'

// Configure ONNX Runtime explicitly
env.backends.onnx.wasm.numThreads = 1
env.backends.onnx.instance = ort

// Define types for progress callback
type ProgressCallback = {
  progress: number
  loaded?: number
  total?: number
}

// Initialize the pipeline with the correct model
let embedder: any = null
async function getEmbedder() {
  if (!embedder) {
    try {
      // Switch to all-mpnet-base-v2 to match Python embeddings
      embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-mpnet-base-v2',
        {
          revision: 'main',
          quantized: true,
          progress_callback: (progress: ProgressCallback) => {
            if (progress.progress <= 1) {
              console.log(
                `Loading model: ${Math.round(progress.progress * 100)}%`,
              )
            }
          },
        },
      )
      console.log('Model loaded successfully')
    } catch (error) {
      console.error('Error initializing embedder:', error)
      throw error
    }
  }
  return embedder
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    console.log('Processing text:', text)

    const embedder = await getEmbedder()
    console.log('Embedder ready')

    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true,
      add_special_tokens: true,
    })

    let embedding: number[] = Array.from(output.data)

    // Check magnitude and dimensions
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0),
    )
    console.log('Embedding dimensions:', embedding.length)
    console.log('Embedding magnitude:', magnitude)
    console.log('Sample values:', embedding.slice(0, 5))

    // Always normalize to ensure consistency
    embedding = embedding.map((val) => val / magnitude)

    // Verify final magnitude
    const finalMagnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0),
    )
    console.log('Final magnitude after normalization:', finalMagnitude)

    return NextResponse.json({
      embedding,
      debug: {
        originalMagnitude: magnitude,
        finalMagnitude: finalMagnitude,
        dimensions: embedding.length,
        sample: embedding.slice(0, 5),
      },
    })
  } catch (error) {
    console.error('Embedding error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate embedding',
      },
      { status: 500 },
    )
  }
}
