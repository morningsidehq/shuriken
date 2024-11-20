'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'

interface ActionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (actionData: any) => void
}

interface Record {
  nanoid: string
  file_name: string
}

export default function ActionForm({
  isOpen,
  onClose,
  onSubmit,
}: ActionFormProps) {
  const [formData, setFormData] = useState({
    action_name: '',
    status: 'pending',
    date_scheduled: '',
    priority: 'medium',
    record_id: '',
    metadata: JSON.stringify({ type: 'task' }),
  })
  const [records, setRecords] = useState<Record[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { supabase } = useSupabase()

  useEffect(() => {
    const fetchRecords = async () => {
      if (!searchTerm) {
        setRecords([])
        return
      }

      setIsSearching(true)
      try {
        const { data, error } = await supabase
          .from('records')
          .select('nanoid, file_name')
          .ilike('file_name', `%${searchTerm}%`)
          .limit(10)

        if (error) throw error
        setRecords(data || [])
      } catch (error) {
        console.error('Error fetching records:', error)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(fetchRecords, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, supabase])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">View Action</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block">Action Name</label>
            <div className="w-full rounded border p-2">
              {formData.action_name}
            </div>
          </div>

          <div>
            <label className="mb-1 block">Status</label>
            <div className="w-full rounded border p-2">{formData.status}</div>
          </div>

          <div>
            <label className="mb-1 block">Date Scheduled</label>
            <div className="w-full rounded border p-2">
              {formData.date_scheduled}
            </div>
          </div>

          <div>
            <label className="mb-1 block">Priority</label>
            <div className="w-full rounded border p-2">{formData.priority}</div>
          </div>

          <div>
            <label className="mb-1 block">Record</label>
            <div className="w-full rounded border p-2">{searchTerm}</div>
          </div>

          <div>
            <label className="mb-1 block">Metadata Type</label>
            <div className="w-full rounded border p-2">
              {JSON.parse(formData.metadata).type}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="rounded border px-4 py-2 hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
