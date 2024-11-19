'use client'

import { Action } from '@/types/actions'

interface ActionsTableProps {
  actions: Action[]
  onDelete: (id: number) => void
  onEdit: (id: number) => void
  isLoading?: boolean
}

export default function ActionsTable({
  actions,
  onDelete,
  onEdit,
  isLoading = false,
}: ActionsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Move table header and body here */}
        {/* ... existing table code ... */}
      </table>
    </div>
  )
}
