import { z } from 'zod'

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

export function validateEnv() {
  try {
    envSchema.parse(process.env)
  } catch (error) {
    console.error('Invalid environment variables:', error)
    throw new Error('Invalid environment variables')
  }
}
