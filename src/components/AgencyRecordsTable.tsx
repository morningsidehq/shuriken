'use client'

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

type AgencyRecordsTableProps = {
  records: Record[]
  typeFilter: string
  agencyFilter: string
  tagFilter: string | string[]
}

export default function AgencyRecordsTable({
  records,
  typeFilter,
  agencyFilter,
  tagFilter,
}: AgencyRecordsTableProps) {
  const filteredRecords = records.filter((record) => {
    const matchesType = !typeFilter || record.type === typeFilter
    const matchesAgency =
      !agencyFilter || record.agencies?.name === agencyFilter
    const matchesTag =
      !tagFilter ||
      (record.tags &&
        record.tags.length > 0 &&
        (Array.isArray(tagFilter)
          ? tagFilter.length === 0 ||
            tagFilter.some((tag) => record.tags?.includes(tag))
          : record.tags.includes(tagFilter)))
    return matchesType && matchesAgency && matchesTag
  })

  return (
    <div className="w-full overflow-x-auto">
      <table className="morningside-table">
        <thead>
          <tr className="border-b border-border/40">
            <th className="px-4 py-2 text-left font-medium">File Name</th>
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
          {filteredRecords.map((record, i) => (
            <tr key={i} className="border-b border-border/40 hover:bg-muted/50">
              <td className="px-4 py-2">{record.file_name}</td>
              <td className="px-4 py-2">{record.type}</td>
              <td className="px-4 py-2">{record.agencies?.name}</td>
              <td className="px-4 py-2">{record.status}</td>
              <td className="px-4 py-2">
                {new Date(record.date_created).toLocaleDateString('en-US')}
              </td>
              <td className="px-4 py-2">{record.tags?.join(', ')}</td>
              <td className="px-4 py-2">{record.entities?.join(', ')}</td>
              <td className="px-4 py-2">
                <ViewPDFButton record={record} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
