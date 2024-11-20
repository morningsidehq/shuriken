'use client'
import { useState } from 'react'
import AgencyRecordsTable from './AgencyRecordsTable'

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

type AgencyRecordsContentProps = {
  formattedAgencyRecords: Record[]
  types: string[]
  agencies: string[]
  allTags: string[]
}

export default function AgencyRecordsContent({
  formattedAgencyRecords,
  types,
  agencies,
  allTags,
}: AgencyRecordsContentProps) {
  const [typeFilter, setTypeFilter] = useState('')
  const [agencyFilter, setAgencyFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  return (
    <>
      {/* Filters temporarily removed for Agency Records page
      <div className="morningside-card mb-8">
        <h2 className="mb-4 text-xl font-semibold">Filters</h2>
        ... filter UI ...
      </div>
      */}

      <div className="morningside-card">
        <h2 className="mb-4 text-xl font-semibold">Records</h2>
        <AgencyRecordsTable
          records={formattedAgencyRecords}
          typeFilter={typeFilter}
          agencyFilter={agencyFilter}
          tagFilter={tagFilter}
        />
      </div>
    </>
  )
}
