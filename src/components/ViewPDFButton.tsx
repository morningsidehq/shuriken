'use client'

import { useState } from 'react'
import { useSupabase } from '@/providers/SupabaseProvider'

type ViewPDFButtonProps = {
  record: {
    file_name: string
    agencies?: { name: string }
  }
}

export default function ViewPDFButton({ record }: ViewPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const { supabase } = useSupabase()

  const handleView = async () => {
    try {
      setIsLoading(true)
      const folderPath = `${record.agencies?.name}/${record.file_name}`

      const { data, error } = await supabase.storage
        .from('user_objects')
        .download(folderPath)

      if (error) throw error
      if (!data) throw new Error('No data received')

      const url = window.URL.createObjectURL(data)
      setPdfUrl(url)
      setIsOpen(true)
    } catch (error) {
      console.error('Error loading PDF:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleView}
        disabled={isLoading}
        className="text-primary hover:underline"
      >
        View PDF
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setIsOpen(false)
            if (pdfUrl) {
              window.URL.revokeObjectURL(pdfUrl)
              setPdfUrl(null)
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-4xl rounded-lg bg-background p-4">
            <div className="mb-2 text-lg font-semibold">{record.file_name}</div>
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="h-[80vh] w-full"
                title={record.file_name}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
