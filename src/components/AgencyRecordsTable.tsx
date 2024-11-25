'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import ViewPDFButton from './ViewPDFButton'

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

interface AgencyRecordsTableProps {
  records: Record[]
}

export default function AgencyRecordsTable({
  records,
}: AgencyRecordsTableProps) {
  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Agency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Entities</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record, i) => (
            <TableRow key={i} className="border-border">
              <TableCell>{record.file_name}</TableCell>
              <TableCell>{record.type}</TableCell>
              <TableCell>{record.agencies?.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    record.status === 'complete' ? 'default' : 'secondary'
                  }
                >
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(record.date_created).toLocaleDateString('en-US')}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {record.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {record.entities?.map((entity) => (
                    <Badge key={entity} variant="outline">
                      {entity}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <ViewPDFButton record={record} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
