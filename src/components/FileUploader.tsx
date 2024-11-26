'use client'

import { useRef, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload } from 'lucide-react'

interface FileUploaderProps {
  userGroup: string
  className?: string
  onFileSelect?: (file: File | null) => void
  showUploadButton?: boolean
}

export default function FileUploader({
  userGroup,
  className,
  onFileSelect,
  showUploadButton = true,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createBrowserClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]

    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file')
        e.target.value = ''
        return
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 10MB')
        e.target.value = ''
        return
      }

      setSelectedFile(file)
      onFileSelect?.(file)
    } else {
      setSelectedFile(null)
      onFileSelect?.(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file')
        return
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 10MB')
        return
      }

      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file')
      return
    }

    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        throw new Error(
          sessionError?.message || 'Please log in to upload files',
        )
      }

      // Create unique filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const originalName = selectedFile.name.replace('.pdf', '')
      const fileName = `${originalName}_${timestamp}.pdf`
      const filePath = `${userGroup}/${fileName}`

      // Upload with progress tracking
      const { error } = await supabase.storage
        .from('user_objects')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        })

      if (error) throw error

      // Reset form after successful upload
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setUploadProgress(100)

      // Optional: Add success message or callback here
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-gray-400"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mb-4 h-12 w-12 text-gray-400" />
        <p className="text-sm text-gray-600">
          Click to upload or drag and drop
        </p>
        <p className="mt-1 text-xs text-gray-500">PDF files only (max 10MB)</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,application/pdf"
      />

      {selectedFile && (
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
            {selectedFile.name}
          </div>
          {uploading && <Progress value={uploadProgress} className="w-full" />}
        </div>
      )}

      {showUploadButton && (
        <Button
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
        </Button>
      )}
    </div>
  )
}
