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
  return (
    <div className="morningside-card mb-8">
      <h2 className="mb-4 text-xl font-semibold">Filters</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Move all filter inputs here */}
        {/* ... existing filter inputs ... */}
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
