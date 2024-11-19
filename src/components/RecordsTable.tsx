'use client'

import ViewRecordButton from './ViewRecordButton'

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

export default function RecordsTable({
  completeRecords,
}: {
  completeRecords: Record[]
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="morningside-table">
        <thead>
          <tr className="border-b border-border/40">
            <th className="max-w-[100px] whitespace-normal px-4 py-2 text-left font-medium">
              File Name
            </th>
            <th className="px-4 py-2 text-left font-medium">Type</th>
            <th className="px-4 py-2 text-left font-medium">Agency</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Date Created</th>
            <th className="px-4 py-2 text-left font-medium">Tags</th>
            <th className="px-4 py-2 text-left font-medium">Entities</th>
            <th className="px-4 py-2 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {completeRecords.map((record, i) => (
            <tr key={i} className="border-b border-border/40 hover:bg-muted/50">
              <td className="px-4 py-2">{record.file_name}</td>
              <td className="px-4 py-2">{record.type}</td>
              <td className="px-4 py-2">{record.agencies?.name}</td>
              <td className="px-4 py-2">{record.status}</td>
              <td className="px-4 py-2">
                {new Date(record.date_created).toLocaleDateString('en-US')}
              </td>
              <td className="px-4 py-2">{record.tags?.toString()}</td>
              <td className="px-4 py-2">{record.entities?.toString()}</td>
              <td className="px-4 py-2">
                <ViewRecordButton record={record} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
