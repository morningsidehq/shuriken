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

interface AgencyUser {
  id: string
  email: string
  first_name: string
  last_name: string
  confirmed: boolean
  user_group: string
}

export default function AgencyUserManagement({
  userGroup,
}: {
  userGroup: string
}) {
  const [users, setUsers] = useState<AgencyUser[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingUser, setConfirmingUser] = useState<string | null>(null)
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
          user_group
        `,
        )
        .eq('user_group', userGroup)

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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
