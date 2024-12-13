'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import AddAgencyUserModal from './AddAgencyUserModal'
import { Trash2 } from 'lucide-react'
import EditAgencyUserModal from './EditAgencyUserModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AgencyUser {
  id: string
  email: string
  first_name: string
  last_name: string
  confirmed: boolean
  user_group: string
  phone?: string
}

export default function AgencyUserManagement({
  userGroup,
}: {
  userGroup: string
}) {
  const [users, setUsers] = useState<AgencyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingUser, setConfirmingUser] = useState<string | null>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const supabase = createBrowserClient()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      console.log('Fetching users for group:', userGroup)

      const { data, error } = await supabase
        .from('profiles')
        .select(
          `
          id,
          email,
          first_name,
          last_name,
          confirmed,
          user_group,
          phone
        `,
        )
        .eq('user_group', userGroup)
        .not('disabled', 'eq', true)

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }

      console.log('Fetched users:', data)
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }, [userGroup, supabase])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleConfirmUser = async (userId: string) => {
    try {
      setConfirmingUser(userId)

      const { error } = await supabase
        .from('profiles')
        .update({ confirmed: true })
        .eq('id', userId)
        .eq('user_group', userGroup) // Extra safety check

      if (error) throw error

      // Refresh the users list to show the updated status
      await fetchUsers()
    } catch (error) {
      console.error('Error confirming user:', error)
    } finally {
      setConfirmingUser(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete the profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
        .eq('user_group', userGroup)

      if (profileError) throw profileError

      // Instead of using admin.deleteUser, we'll disable the user's access
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          disabled: true,
          deleted_at: new Date().toISOString(),
        },
      })

      if (authError) throw authError

      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      // Add toast notification here
    } finally {
      setDeleteUserId(null)
    }
  }

  // Even if there are no users, we should still show the Add User button
  return (
    <div className="mt-8">
      <div className="mb-4 flex justify-between">
        <AddAgencyUserModal userGroup={userGroup} onUserAdded={fetchUsers} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchUsers()}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="mt-8 text-center text-muted-foreground">
          No users found in this agency.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.confirmed ? 'default' : 'secondary'}>
                    {user.confirmed ? 'Confirmed' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!user.confirmed && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmUser(user.id)}
                        disabled={confirmingUser === user.id}
                      >
                        {confirmingUser === user.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          'Confirm User'
                        )}
                      </Button>
                    )}
                    <EditAgencyUserModal
                      user={user}
                      userGroup={userGroup}
                      onUserUpdated={fetchUsers}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteUserId(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
