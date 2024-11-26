'use client'

import { useState } from 'react'
import AgencyRecordsContent from '@/components/AgencyRecordsContent'

interface ObjectListProps {
  initialRecords: any[]
  userGroup: string
}

export default function ObjectList({
  initialRecords,
  userGroup,
}: ObjectListProps) {
  const [records] = useState(initialRecords)

  // Get unique values for filters
  const types = Array.from(new Set(records.map((record) => record.type)))
  const allTags = Array.from(
    new Set(records.flatMap((record) => record.tags || [])),
  )

  return (
    <AgencyRecordsContent
      formattedAgencyRecords={records}
      types={types}
      agencies={[userGroup]}
      allTags={allTags}
    />
  )
}
