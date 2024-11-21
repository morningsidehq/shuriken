'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ActionFilters from './ActionFilters'
import ActionsTable from './ActionsTable'
import { Action } from '@/types/actions'
import ActionForm from './ActionForm'
import { useSupabase } from '@/providers/SupabaseProvider'

export default function ActionsProvider() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [actions, setActions] = useState<Action[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    assignedTo: '',
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleDelete = (id: number) => {
    // Delete logic here
  }

  const handleEdit = (id: number) => {
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
        text: `Failed to create action: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Message display */}
      {message && (
        <div
          className={`mb-4 rounded-md p-4 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <ActionFilters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
        />
        <button
          onClick={handleAddAction}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add New Action
        </button>
      </div>
      <ActionsTable
        actions={actions}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isLoading={isLoading}
      />
      <ActionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitAction}
      />
    </div>
  )
}
