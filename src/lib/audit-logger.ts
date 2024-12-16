import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
)

export async function logAuditEvent({
  userId,
  action,
  resource,
  details,
  status,
}: {
  userId: string
  action: string
  resource: string
  details?: any
  status: 'success' | 'failure'
}) {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      resource,
      details,
      status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Audit logging failed:', error)
  }
}
