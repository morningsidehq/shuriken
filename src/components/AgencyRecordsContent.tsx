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
  return (
    <>
      <div className="morningside-card">
        <h2 className="mb-4 text-xl font-semibold">Records</h2>
        <AgencyRecordsTable records={formattedAgencyRecords} />
      </div>
    </>
  )
}
