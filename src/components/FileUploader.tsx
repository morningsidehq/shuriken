'use client'

import { useRef, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase'

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
  const supabase = createBrowserClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file')
        e.target.value = '' // Reset input
        return
      }
      // Check file size (e.g., 10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        e.target.value = ''
        return
      }
      setSelectedFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a PDF file')
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

      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`)
      }

      if (!session?.user) {
        throw new Error('Please log in to upload files')
      }

      // Create a unique file name with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const originalName = selectedFile.name.replace('.pdf', '')
      const fileName = `${originalName}_${timestamp}.pdf`
      const filePath = `${userGroup}/${fileName}`

      console.log('Upload attempt:', {
        filePath,
        userGroup,
        userId: session.user.id,
      })

      // Attempt upload
      const { data, error } = await supabase.storage
        .from('user_objects')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        })

      if (error) {
        console.error('Upload error:', error)
        throw error
      }

      console.log('Upload success:', data)
      alert('PDF uploaded successfully!')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      console.error('Upload error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      })
      alert(`Error uploading PDF: ${error.message || 'Unknown error'}`)
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
          accept=".pdf,application/pdf"
        />
        <button
          type="button"
          onClick={handleClick}
          className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        >
          Choose PDF
        </button>
        <div className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
          {selectedFile ? selectedFile.name : 'No PDF file chosen'}
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
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>
    </div>
  )
}
