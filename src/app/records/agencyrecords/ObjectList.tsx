'use client'

import { useState } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import RecordsFilters from '@/components/RecordsFilters'
import AgencyRecordsTable from '@/components/AgencyRecordsTable'

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

  // Get unique values for filters
  const types = Array.from(new Set(records.map((record) => record.type)))
  const allTags = Array.from(
    new Set(records.flatMap((record) => record.tags || [])),
  )

  return (
    <div className="container flex-1 py-8">
      <h1 className="mb-8 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Agency Records
      </h1>
      <div className="flex gap-6">
        {/* Sticky sidebar */}
        <div className="sticky top-8 h-[calc(100vh-12rem)] w-[280px] shrink-0">
          <ScrollArea className="h-full rounded-lg border border-border bg-card p-4">
            <RecordsFilters
              types={types}
              agencies={[userGroup]}
              allTags={allTags}
            />
          </ScrollArea>
        </div>
        {/* Main content */}
        <div className="flex-1">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Records</CardTitle>
            </CardHeader>
            <CardContent>
              <AgencyRecordsTable records={records} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
