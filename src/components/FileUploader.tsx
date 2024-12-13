'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload } from 'lucide-react'
import { processDocument } from '@/utils/documentProcessing'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FileUploaderProps {
  className?: string
  onFileSelect?: (file: File | null) => void
  showUploadButton?: boolean
  userGroup: string
  userId: string
}

interface ProcessingStatus {
  step: string
  progress: number
  detail?: string
  jobId?: string
}

export default function FileUploader({
  className,
  onFileSelect,
  showUploadButton = true,
  userGroup,
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<ProcessingStatus>({
    step: '',
    progress: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateStatus = (newStatus: Partial<ProcessingStatus>) => {
    setStatus((prev) => ({ ...prev, ...newStatus }))
  }

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
      // Set default document name from file name (without extension)
      setDocumentName(
        file.name.replace('.pdf', '').replace(/[^a-zA-Z0-9-_]/g, '_'),
      )
      onFileSelect?.(file)
    } else {
      setSelectedFile(null)
      setDocumentName('')
      onFileSelect?.(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file')
      return
    }

    if (!documentName.trim()) {
      setError('Please provide a document name')
      return
    }

    try {
      setUploading(true)
      setError(null)

      const processResult = await processDocument(
        selectedFile,
        updateStatus,
        userGroup,
        documentName.trim(), // Pass the document name to the process
      )

      updateStatus({
        step: 'Complete',
        progress: 100,
        detail: 'Document successfully processed and uploaded',
        jobId: processResult.jobId,
      })

      // Clear the form
      setSelectedFile(null)
      setDocumentName('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to process document')
      updateStatus({
        step: 'Error',
        progress: 0,
        detail: error.message,
      })
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
              {selectedFile.name}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              id="documentName"
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Enter document name"
              disabled={uploading}
            />
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={status.progress} className="w-full" />
              <p className="text-sm text-gray-600">
                {status.step}: {status.detail}
              </p>
              {status.jobId && (
                <p className="text-xs text-gray-500">Job ID: {status.jobId}</p>
              )}
            </div>
          )}
        </div>
      )}

      {showUploadButton && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || !documentName.trim() || uploading}
          className="w-full max-w-[300px]"
        >
          {uploading ? 'Processing...' : 'Upload PDF'}
        </Button>
      )}
    </div>
  )
}
