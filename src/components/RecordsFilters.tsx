'use client'
import { useState } from 'react'

type Props = {
  types: string[]
  agencies: string[]
  tags: string[]
  onApplyFilters: (filters: FilterState) => void
}

type FilterState = {
  type: string
  agency: string
  tag: string
}

export default function RecordsFilters({
  types,
  agencies,
  tags,
  onApplyFilters,
}: Props) {
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    agency: '',
    tag: '',
  })

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="morningside-card mb-8">
      <h2 className="mb-4 text-xl font-semibold">Filters</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">Type</label>
          <select
            className="morningside-select w-full"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Agency</label>
          <select
            className="morningside-select w-full"
            value={filters.agency}
            onChange={(e) => handleFilterChange('agency', e.target.value)}
          >
            <option value="">All Agencies</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Tags</label>
          <select
            className="morningside-select w-full"
            value={filters.tag}
            onChange={(e) => handleFilterChange('tag', e.target.value)}
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="morningside-button"
          onClick={() => onApplyFilters(filters)}
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
