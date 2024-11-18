'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import FileUploader from '@/components/FileUploader'

export default function AdvancedRecordForm({
  userGroup,
}: {
  userGroup: string
}) {
  const [fileName, setFileName] = useState('')
  const [recordType, setRecordType] = useState('Document')
  const [agencyId, setAgencyId] = useState('')
  const [description, setDescription] = useState('')
  const [isRaster, setIsRaster] = useState(false)
  const [metadata, setMetadata] = useState('')
  const [agencies, setAgencies] = useState<Array<{ id: string; name: string }>>(
    [],
  )

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAgencies = async () => {
      const { data } = await supabase
        .from('agencies')
        .select('id, name')
        .order('name')
      if (data) setAgencies(data)
    }
    fetchAgencies()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
  }

  const handleClear = () => {
    setFileName('')
    setRecordType('Document')
    setAgencyId('')
    setDescription('')
    setIsRaster(false)
    setMetadata('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">
            File Upload <span className="text-red-500">*</span>
          </label>
          <FileUploader userGroup={userGroup} className="h-[150px]" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">
            Record Type <span className="text-red-500">*</span>
          </label>
          <select
            className="morningside-input"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            required
          >
            <option value="Document">Document</option>
            <option value="Image">Image</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">
            File Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="morningside-input"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            maxLength={500}
            required
            placeholder="Enter file name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">
            Agency ID <span className="text-red-500">*</span>
          </label>
          <select
            className="morningside-input"
            value={agencyId}
            onChange={(e) => setAgencyId(e.target.value)}
            required
          >
            <option value="">Select an agency</option>
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id}>
                {agency.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="morningside-input min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          placeholder="Enter description"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={isRaster}
            onChange={(e) => setIsRaster(e.target.checked)}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          <span className="ml-3 text-sm font-medium">Is Raster</span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium">
          Record Metadata (JSON)
        </label>
        <textarea
          className="morningside-input font-mono"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          placeholder="{}"
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Create Record
        </button>
        <button
          type="button"
          className="morningside-button-secondary"
          onClick={handleClear}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
