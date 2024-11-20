'use client'
import { useState } from 'react'
import RecordsTable from './RecordsTable'

type Record = {
  file_name: string
  type: string
  agencies?: { name: string }
  status: string
  date_created: string
  tags?: string[]
  entities?: string[]
  object_upload_url: string
}

type RecordsContentProps = {
  formattedAgencyRecords: Record[]
  completeRecords: Record[]
  types: string[]
  agencies: string[]
  allTags: string[]
  onView: (fileName: string) => void
}

export default function RecordsContent({
  formattedAgencyRecords,
  completeRecords,
  types,
  agencies,
  allTags,
  onView,
}: RecordsContentProps) {
  const [typeFilter, setTypeFilter] = useState('')
  const [agencyFilter, setAgencyFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const allRecords = [...formattedAgencyRecords, ...completeRecords]

  return (
    <>
      <div className="morningside-card mb-8">
        <h2 className="mb-4 text-xl font-semibold">Filters</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Type</label>
            <select
              className="morningside-select w-full"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
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
              value={agencyFilter}
              onChange={(e) => setAgencyFilter(e.target.value)}
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
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="morningside-card">
        <h2 className="mb-4 text-xl font-semibold">Records</h2>
        <RecordsTable
          records={allRecords}
          typeFilter={typeFilter}
          agencyFilter={agencyFilter}
          tagFilter={tagFilter}
        />
      </div>
    </>
  )
}
