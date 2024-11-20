'use client'

import { Dispatch, SetStateAction } from 'react'

interface FilterProps {
  filters: {
    type: string
    status: string
    priority: string
    assignedTo: string
  }
  setFilters: Dispatch<
    SetStateAction<{
      type: string
      status: string
      priority: string
      assignedTo: string
    }>
  >
  onApplyFilters: () => void
}

export default function ActionFilters({
  filters,
  setFilters,
  onApplyFilters,
}: FilterProps) {
  const actionTypes = ['Email', 'SMS', 'Call', 'Meeting', 'Task']
  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled']
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent']

  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Filters</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {actionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assigned To
          </label>
          <input
            type="text"
            value={filters.assignedTo}
            onChange={(e) =>
              setFilters({ ...filters, assignedTo: e.target.value })
            }
            placeholder="Enter email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onApplyFilters}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
