'use client'
import { useState, useEffect, useCallback } from 'react'
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
  const [filteredRecords, setFilteredRecords] = useState<Record[]>(
    formattedAgencyRecords,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedAgency, setSelectedAgency] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const handleFilter = useCallback(() => {
    let results = formattedAgencyRecords

    // Filter by search term
    if (searchTerm) {
      results = results.filter((record) =>
        record.file_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (selectedType && selectedType !== 'all') {
      results = results.filter((record) => record.type === selectedType)
    }

    // Filter by agency
    if (selectedAgency && selectedAgency !== 'all') {
      results = results.filter(
        (record) => record.agencies?.name === selectedAgency,
      )
    }

    // Filter by tag
    if (selectedTag && selectedTag !== 'all') {
      results = results.filter((record) => record.tags?.includes(selectedTag))
    }

    setFilteredRecords(results)
  }, [
    formattedAgencyRecords,
    searchTerm,
    selectedType,
    selectedAgency,
    selectedTag,
  ])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedAgency('all')
    setSelectedTag('all')
    setFilteredRecords(formattedAgencyRecords)
  }

  useEffect(() => {
    handleFilter()
  }, [handleFilter])

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name..."
            className="w-full rounded-md border border-input px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="agency" className="text-sm font-medium">
            Agency
          </label>
          <select
            id="agency"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="all">All Agencies</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="tag" className="text-sm font-medium">
            Tag
          </label>
          <select
            id="tag"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="all">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="w-full rounded-md bg-secondary px-3 py-2 text-sm font-medium hover:bg-secondary/80"
        >
          Reset Filters
        </button>
      </div>

      <AgencyRecordsTable records={filteredRecords} />
    </div>
  )
}
