'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface AddAgencyUserModalProps {
  userGroup: string
  onUserAdded: () => void
}

export default function AddAgencyUserModal({
  userGroup,
  onUserAdded,
}: AddAgencyUserModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email'))
    const firstName = String(formData.get('firstName'))
    const lastName = String(formData.get('lastName'))
    const phone = String(formData.get('phone'))

    try {
      // First, create auth user (this will send confirmation email)
      const { error: authError } = await supabase.auth.signUp({
        email,
        password: generateTempPassword(),
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      })

      if (authError) throw authError

      // Then create confirmed profile with our function
      const { error } = await supabase.rpc('add_agency_user', {
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        group_name: userGroup,
      })

      if (error) throw error

      setOpen(false)
      onUserAdded()
    } catch (error) {
      console.error('Error adding user:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to generate a temporary password
  function generateTempPassword() {
    return (
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).toUpperCase().slice(-4) +
      Math.random().toString(9).slice(-4)
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(123) 456-7890"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding User...
              </>
            ) : (
              'Add User'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
