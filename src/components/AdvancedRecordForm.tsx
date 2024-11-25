'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import FileUploader from '@/components/FileUploader'
import { Button } from '@/components/ui/button'

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const supabase = createBrowserClient()

  const fileInputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    const initializeSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()
      if (error || !session) {
        console.error('Session initialization failed:', error)
      }
    }
    initializeSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      alert('Please select a file')
      return
    }

    try {
      setUploading(true)

      // Get current session with detailed logging
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      console.log('Session check:', {
        hasSession: !!session,
        userId: session?.user?.id,
        sessionError: sessionError || 'none',
      })

      if (sessionError || !session?.user) {
        throw new Error('Please log in to upload files')
      }

      // Create unique filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const originalName = selectedFile.name.replace('.pdf', '')
      const fileNameWithTimestamp = `${fileName || originalName}_${timestamp}.pdf`
      const filePath = `${userGroup}/${fileNameWithTimestamp}`

      console.log('Upload attempt:', {
        filePath,
        userGroup,
        userId: session.user.id,
      })

      // Upload file to storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('user_objects')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      console.log('Upload success:', fileData)

      // Validate metadata JSON
      let parsedMetadata = {}
      if (metadata) {
        try {
          parsedMetadata = JSON.parse(metadata)
        } catch (error) {
          throw new Error('Invalid JSON in metadata field')
        }
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from('user_objects').getPublicUrl(filePath)

      // Create record in database
      const { error: recordError } = await supabase.from('records').insert({
        name: fileName || originalName,
        type: recordType,
        agency_id: agencyId,
        description: description,
        is_raster: isRaster,
        metadata: parsedMetadata,
        user_id: session.user.id,
        user_group: userGroup,
        status: 'complete',
        object_upload_url: publicUrl,
        date_created: new Date().toISOString(),
      })

      if (recordError) {
        console.error('Record creation error:', recordError)
        throw recordError
      }

      alert('Record created successfully!')
      handleClear()
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      })
      alert(`Error: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    setFileName('')
    setRecordType('Document')
    setAgencyId('')
    setDescription('')
    setIsRaster(false)
    setMetadata('')
    setSelectedFile(null)
  }

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    if (file && !fileName) {
      setFileName(file.name)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">
            File Upload <span className="text-red-500">*</span>
          </label>
          <FileUploader
            userGroup={userGroup}
            className="h-[150px]"
            onFileSelect={handleFileSelect}
            showUploadButton={false}
          />
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
        <Button type="submit" className="w-full" disabled={uploading}>
          {uploading ? 'Creating Record...' : 'Create Record'}
        </Button>
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
