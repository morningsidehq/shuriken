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

  if (actions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-lg text-gray-600">
          You do not currently have any actions. Try adding a new one!
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Scheduled
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {actions.map((action) => (
            <tr key={action.id}>
              <td className="whitespace-nowrap px-6 py-4">
                {action.action_name}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {action.metadata?.type ?? '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4">{action.status}</td>
              <td className="whitespace-nowrap px-6 py-4">{action.priority}</td>
              <td className="whitespace-nowrap px-6 py-4">
                {action.date_scheduled
                  ? new Date(action.date_scheduled).toLocaleDateString()
                  : '-'}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {action.created_by.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <button
                  onClick={() => onEdit(action.id)}
                  className="mr-2 text-blue-600 hover:text-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(action.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
