'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, X } from 'lucide-react'
import { processDocument } from '@/utils/documentProcessing'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FileUploaderProps {
  className?: string
  onFileSelect?: (files: File[]) => void
  showUploadButton?: boolean
  userId: string
  accessToken: string
  userGroup: string
}

interface FileWithName {
  file: File
  documentName: string
}

interface ProcessingStatus {
  step: string
  progress: number
  detail?: string
  jobId?: string
  queuePosition?: number
}

export default function FileUploader({
  className,
  onFileSelect,
  showUploadButton = true,
  userId,
  accessToken,
  userGroup,
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithName[]>([])
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

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Please select PDF files only'
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB'
    }

    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])

    const validFiles: FileWithName[] = []
    const errors: string[] = []

    files.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push({
          file,
          documentName: file.name
            .replace('.pdf', '')
            .replace(/[^a-zA-Z0-9-_]/g, '_'),
        })
      }
    })

    if (errors.length > 0) {
      setError(errors.join('\n'))
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])
    onFileSelect?.(validFiles.map((f) => f.file))

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    setError(null)
    const validFiles: FileWithName[] = []
    const errors: string[] = []

    files.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push({
          file,
          documentName: file.name
            .replace('.pdf', '')
            .replace(/[^a-zA-Z0-9-_]/g, '_'),
        })
      }
    })

    if (errors.length > 0) {
      setError(errors.join('\n'))
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])
    onFileSelect?.(validFiles.map((f) => f.file))
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one PDF file')
      return
    }

    try {
      setUploading(true)
      setError(null)
      const errors: string[] = []

      // Upload files sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        const { file, documentName } = selectedFiles[i]
        updateStatus({
          step: `Uploading file ${i + 1} of ${selectedFiles.length}`,
          progress: (i / selectedFiles.length) * 100,
        })

        try {
          await processDocument(
            file,
            updateStatus,
            userId,
            documentName.trim(),
            accessToken,
            userGroup,
          )
        } catch (fileError: any) {
          // Collect error but continue with next file
          errors.push(`Error uploading ${file.name}: ${fileError.message}`)
          console.error(`Failed to upload ${file.name}:`, fileError)
          // Continue with next file instead of throwing
          continue
        }
      }

      // If we had any errors, show them all
      if (errors.length > 0) {
        setError(errors.join('\n'))
        // Only clear successfully uploaded files
        setSelectedFiles((prev) =>
          prev.filter(
            (_, index) =>
              !errors.some((err) => err.includes(prev[index].file.name)),
          ),
        )
      } else {
        // All successful - clear everything
        setSelectedFiles([])
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to queue documents')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="whitespace-pre-line">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-gray-400"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Upload className="mb-4 h-12 w-12 text-gray-400" />
        <p className="text-sm text-gray-600">
          Click to upload or drag and drop multiple files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PDF files only (max 10MB each)
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,application/pdf"
        multiple
      />

      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-4">
          {selectedFiles.map((fileWithName, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
                  {fileWithName.file.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`documentName-${index}`}>Document Name</Label>
                <Input
                  id={`documentName-${index}`}
                  type="text"
                  value={fileWithName.documentName}
                  onChange={(e) => {
                    const newFiles = [...selectedFiles]
                    newFiles[index].documentName = e.target.value
                    setSelectedFiles(newFiles)
                  }}
                  placeholder="Enter document name"
                  disabled={uploading}
                />
              </div>
            </div>
          ))}

          {uploading && (
            <div className="space-y-2">
              <Progress value={status.progress} className="w-full" />
              <p className="text-sm text-gray-600">
                {status.step}: {status.detail}
              </p>
              {status.jobId && (
                <p className="text-xs text-gray-500">
                  Job ID: {status.jobId}
                  {status.queuePosition &&
                    ` | Queue Position: ${status.queuePosition}`}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {showUploadButton && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
          className="w-full max-w-[300px]"
        >
          {uploading
            ? 'Processing...'
            : `Upload ${selectedFiles.length} PDF${
                selectedFiles.length !== 1 ? 's' : ''
              }`}
        </Button>
      )}
    </div>
  )
}
