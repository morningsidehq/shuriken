'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import RecordsFilters from '@/components/RecordsFilters'
import RecordsContent from '@/components/RecordsContent'

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

type PublicRecordsWrapperProps = {
  types: string[]
  agencies: string[]
  allTags: string[]
  completeRecords: Record[]
}

export default function PublicRecordsWrapper({
  types,
  agencies,
  allTags,
  completeRecords,
}: PublicRecordsWrapperProps) {
  return (
    <div className="flex gap-6">
      {/* Sticky sidebar */}
      <div className="sticky top-8 h-[calc(100vh-12rem)] w-[280px] shrink-0">
        <ScrollArea className="h-full rounded-lg border border-border bg-card p-4">
          <RecordsFilters
            types={types}
            agencies={agencies}
            allTags={allTags}
            onApplyFilters={(filters) => {
              // Handle filters when implemented
              console.log('Filters applied:', filters)
            }}
          />
        </ScrollArea>
      </div>
      {/* Main content */}
      <div className="flex-1">
        <RecordsContent completeRecords={completeRecords} />
      </div>
    </div>
  )
}
