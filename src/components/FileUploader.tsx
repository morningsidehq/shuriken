'use client'

import { useRef, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function FileUploader({
  userGroup,
  className,
}: {
  userGroup: string
  className?: string
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    try {
      setUploading(true)

      // Create a unique file name
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${userGroup}/${fileName}`

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('user_objects')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Upload error details:', error)
        throw error
      }

      alert('File uploaded successfully!')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      console.error('Error uploading file:', error.message || error)
      alert(`Error uploading file: ${error.message || 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.tiff"
        />
        <button
          type="button"
          onClick={handleClick}
          className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Choose File
        </button>
        <div className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
          {selectedFile ? selectedFile.name : 'No file chosen'}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`max-w-[300px] rounded px-4 py-2 ${
            !selectedFile || uploading
              ? 'cursor-not-allowed bg-gray-300 text-gray-500'
              : 'bg-blue-900 text-white hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </div>
    </div>
  )
}
