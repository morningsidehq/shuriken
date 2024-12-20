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
import { Loader2, Pencil } from 'lucide-react'

interface EditAgencyUserModalProps {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    phone?: string
  }
  userGroup: string
  onUserUpdated: () => void
}

export default function EditAgencyUserModal({
  user,
  userGroup,
  onUserUpdated,
}: EditAgencyUserModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const firstName = String(formData.get('firstName'))
    const lastName = String(formData.get('lastName'))
    const phone = String(formData.get('phone'))

    try {
      // Use the new RPC function to update the user
      const { error } = await supabase.rpc('update_group_user', {
        user_id: user.id,
        group_name: userGroup,
        first_name: firstName,
        last_name: lastName,
        email: user.email,
        phone: phone || null,
      })

      if (error) throw error

      setOpen(false)
      onUserUpdated()
    } catch (error) {
      console.error('Error updating user:', error)
      // You might want to add toast notification here
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={user.first_name || ''}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={user.last_name || ''}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={user.email || ''}
              disabled
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone || ''}
              placeholder="(123) 456-7890"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating User...
              </>
            ) : (
              'Update User'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
