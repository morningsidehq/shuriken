'use client'
import { useState } from 'react'
import RecordsTable from './RecordsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  completeRecords: Record[]
}

export default function RecordsContent({
  completeRecords,
}: RecordsContentProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Records</CardTitle>
      </CardHeader>
      <CardContent>
        <RecordsTable records={completeRecords} />
      </CardContent>
    </Card>
  )
}
