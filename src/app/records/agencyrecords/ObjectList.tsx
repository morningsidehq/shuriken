'use client'

import { useState } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'
import AgencyRecordsContent from '@/components/AgencyRecordsContent'

type ObjectListProps = {
  initialRecords: {
    file_name: string
    type: string
    status: string
    date_created: string
    object_upload_url: string
    user_group: string
    tags?: string[]
    entities?: string[]
    agencies?: { name: string }
  }[]
  userGroup: string
}

export default function ObjectList({
  initialRecords,
  userGroup,
}: ObjectListProps) {
  const [records, setRecords] = useState(initialRecords)
  const { supabase } = useSupabase()

  // Get unique types for filter
  const types = Array.from(new Set(records.map((record) => record.type)))

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8">
      <div className="container py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Agency Records</h1>
        <AgencyRecordsContent
          formattedAgencyRecords={records}
          types={types}
          agencies={[userGroup]}
          allTags={[]}
        />
      </div>
    </div>
  )
}
