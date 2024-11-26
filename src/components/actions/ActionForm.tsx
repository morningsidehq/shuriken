'use client'

/**
 * ActionForm Component
 * Modal form for creating and editing actions.
 * Includes real-time record search and validation.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onSubmit - Callback for form submission
 */

import { useState, useEffect } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface ActionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (actionData: any) => void
}

interface Record {
  nanoid: string
  file_name: string
}

/**
 * Handles form state and submission for action creation/editing
 * Includes record search functionality with debouncing
 */
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

  /**
   * Debounced record search effect
   * Fetches matching records from Supabase based on search term
   */
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Action</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action_name">Action Name</Label>
            <Input
              id="action_name"
              value={formData.action_name}
              onChange={(e) =>
                setFormData({ ...formData, action_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_scheduled">Schedule Date</Label>
            <Input
              id="date_scheduled"
              type="datetime-local"
              value={formData.date_scheduled}
              onChange={(e) =>
                setFormData({ ...formData, date_scheduled: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="record_search">Search Records</Label>
            <Input
              id="record_search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a record..."
            />
            {isSearching && <div>Searching...</div>}
            {records.length > 0 && (
              <div className="mt-2 max-h-32 overflow-y-auto rounded border p-2">
                {records.map((record) => (
                  <div
                    key={record.nanoid}
                    className="cursor-pointer rounded p-1 hover:bg-gray-100"
                    onClick={() => {
                      setFormData({ ...formData, record_id: record.nanoid })
                      setSearchTerm(record.file_name)
                      setRecords([])
                    }}
                  >
                    {record.file_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Action</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
