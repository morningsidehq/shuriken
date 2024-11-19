'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  const supabase = createClientComponentClient()

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
        <h2 className="mb-4 text-xl font-bold">Add New Action</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block">Action Name</label>
            <input
              type="text"
              required
              className="w-full rounded border p-2"
              value={formData.action_name}
              onChange={(e) =>
                setFormData({ ...formData, action_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block">Status</label>
            <select
              className="w-full rounded border p-2"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block">Date Scheduled</label>
            <input
              type="datetime-local"
              className="w-full rounded border p-2"
              value={formData.date_scheduled}
              onChange={(e) =>
                setFormData({ ...formData, date_scheduled: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block">Priority</label>
            <select
              className="w-full rounded border p-2"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="relative">
            <label className="mb-1 block">Record</label>
            <input
              type="text"
              className="w-full rounded border p-2"
              placeholder="Search for a record..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                {isSearching ? (
                  <div className="p-2 text-gray-500">Loading...</div>
                ) : records.length > 0 ? (
                  records.map((record) => (
                    <div
                      key={record.nanoid}
                      className="cursor-pointer p-2 hover:bg-gray-100"
                      onClick={() => {
                        setFormData({ ...formData, record_id: record.nanoid })
                        setSearchTerm(record.file_name)
                        setRecords([]) // Clear dropdown
                      }}
                    >
                      {record.file_name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">No records found</div>
                )}
              </div>
            )}

            <input type="hidden" value={formData.record_id} />
          </div>

          <div>
            <label className="mb-1 block">Metadata Type</label>
            <select
              className="w-full rounded border p-2"
              value={JSON.parse(formData.metadata).type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  metadata: JSON.stringify({ type: e.target.value }),
                })
              }
            >
              <option value="task">Task</option>
              <option value="event">Event</option>
              <option value="reminder">Reminder</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
