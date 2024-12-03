'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/providers/SupabaseProvider'
import { toast } from '@/components/ui/use-toast'

export default function RequestAdminButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { supabase, session } = useSupabase()

  const handleRequest = async () => {
    if (!session?.user) return

    setIsLoading(true)
    try {
      const { error } = await supabase.functions.invoke('request-admin-role', {
        body: { userId: session.user.id },
      })

      if (error) throw error

      toast({
        title: 'Request Sent',
        description: 'Your request for admin access has been submitted.',
      })
    } catch (error) {
      console.error('Error requesting admin role:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit admin access request. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleRequest} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Request Admin Role'}
    </Button>
  )
}
