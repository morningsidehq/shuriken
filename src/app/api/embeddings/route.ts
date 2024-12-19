import { pipeline, env } from '@xenova/transformers'
import { NextResponse } from 'next/server'
import * as ort from 'onnxruntime-node'

// Configure ONNX Runtime
env.backends.onnx.wasm.numThreads = 1
env.backends.onnx.instance = ort

// Cache the embedder instance
let embedder: any = null

async function getEmbedder() {
  if (!embedder) {
    try {
      embedder = await pipeline(
        'feature-extraction',
        'Xenova/all-mpnet-base-v2',
        {
          revision: 'main',
          quantized: true,
          progress_callback: ({ progress }: { progress: number }) => {
            if (progress <= 1) {
              console.log(`Loading model: ${Math.round(progress * 100)}%`)
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

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    console.log('Processing text:', text)
    const embedder = await getEmbedder()
    console.log('Embedder ready')

    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true,
      add_special_tokens: true,
    })

    let embedding: number[] = Array.from(output.data)

    // Normalize the embedding vector
    const magnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0),
    )
    embedding = embedding.map((val) => val / magnitude)

    // Debug information
    const finalMagnitude = Math.sqrt(
      embedding.reduce((sum, val) => sum + val * val, 0),
    )

    return NextResponse.json({
      embedding,
      debug: {
        dimensions: embedding.length,
        magnitude: finalMagnitude,
        sample: embedding.slice(0, 5),
      },
    })
  } catch (error) {
    console.error('Embedding generation error:', error)
    return NextResponse.json(
      {
        error: `Embedding generation failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      },
      { status: 500 },
    )
  }
}
