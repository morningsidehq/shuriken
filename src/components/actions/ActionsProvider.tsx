'use client'

/**
 * ActionsProvider Component
 * Main container component for the actions feature.
 * Handles data fetching, state management, and CRUD operations for actions.
 *
 * Features:
 * - Real-time data fetching from Supabase
 * - Filtering capabilities
 * - Action creation/deletion
 * - Error handling and loading states
 *
 * @component
 */

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import ActionFilters from './ActionFilters'
import ActionsTable from './ActionsTable'
import ActionForm from './ActionForm'
import { Action } from '@/types/actions'
import { useSupabase } from '@/providers/SupabaseProvider'

type Filters = {
  type: string
  status: string
  priority: string
  assignedTo: string
}

/**
 * Fetches actions from Supabase and manages application state
 * Includes error handling and loading states
 * @returns {JSX.Element}
 */
export default function ActionsProvider() {
  const { supabase } = useSupabase()
  const [actions, setActions] = useState<Action[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [filters, setFilters] = useState<Filters>({
    type: '',
    status: '',
    priority: '',
    assignedTo: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  /**
   * Fetches actions from Supabase on component mount
   * Filters by current user's session
   */
  useEffect(() => {
    const fetchActions = async () => {
      try {
        setIsLoading(true)

        // First ensure we have a valid session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          throw new Error('No valid session found')
        }

        // Then fetch the actions
        const { data, error } = await supabase
          .from('actions')
          .select('*')
          .eq('created_by', session.user.id) // Only fetch user's own actions
          .order('date_created', { ascending: false })

        if (error) throw error

        setActions(data || [])
      } catch (error) {
        console.error('Error fetching actions:', error)
        setMessage({
          type: 'error',
          text: 'Failed to load actions. Please try refreshing the page.',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchActions()
  }, [supabase])

  const handleApplyFilters = () => {
    // Filter logic here
  }

  /**
   * Handles action deletion
   * @param {number} id - ID of the action to delete
   */
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('actions').delete().eq('id', id)
      if (error) throw error
      setActions(actions.filter((action) => action.id !== id))
      setMessage({ type: 'success', text: 'Action deleted successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete action' })
    }
  }

  const handleEdit = (_id: number) => {
    // Edit logic here
  }

  const handleAddAction = () => {
    setIsModalOpen(true)
    setMessage(null) // Clear any existing messages
  }

  const handleSubmitAction = async (actionData: any) => {
    try {
      setIsLoading(true)
      setMessage(null)

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        throw new Error('Please sign in to create actions')
      }

      // Format the data for insertion
      const newAction = {
        action_name: actionData.action_name,
        action_type: JSON.parse(actionData.metadata).type,
        status: actionData.status,
        date_scheduled: actionData.date_scheduled,
        priority: actionData.priority,
        record_id: actionData.record_id,
        metadata: JSON.parse(actionData.metadata),
        created_by: session.user.id,
        date_created: new Date().toISOString(),
      }

      console.log('Submitting action data:', newAction)

      const { data, error } = await supabase
        .from('actions')
        .insert([newAction])
        .select('*')
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (data) {
        setActions((prevActions) => [data, ...prevActions])
        setMessage({ type: 'success', text: 'Action created successfully!' })
        setIsModalOpen(false)
        setTimeout(() => setMessage(null), 5000)
      }
    } catch (error) {
      console.error('Error adding action:', error)
      setMessage({
        type: 'error',
        text: `Failed to create action: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-6">
      {/* Sticky sidebar */}
      <div className="sticky top-8 h-[calc(100vh-12rem)] w-[280px] shrink-0">
        <ScrollArea className="h-full rounded-lg border bg-card p-4">
          <ActionFilters
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
          />
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {message && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <Card>
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Actions List</h2>
            <Button onClick={handleAddAction}>Add New Action</Button>
          </div>
          <ActionsTable
            actions={actions}
            onDelete={handleDelete}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        </Card>
        <ActionForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitAction}
        />
      </div>
    </div>
  )
}
