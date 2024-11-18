'use client'

import { useState } from 'react'

type ViewRecordButtonProps = {
  record: {
    object_upload_url: string
  }
}
export default function ViewRecordButton({ record }: ViewRecordButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasViewed, setHasViewed] = useState(false)

  const handleClick = () => {
    if (record.object_upload_url) {
      setIsOpen(true)
      setHasViewed(true)
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div className="max-h-[90vh] w-full max-w-4xl rounded-lg bg-background p-4">
            <iframe
              src={record.object_upload_url}
              className="h-[80vh] w-full"
              title="Document Preview"
            />
          </div>
        </div>
      )}
      <button
        className={`hover:underline ${hasViewed ? 'text-purple-500' : 'text-primary'}`}
        onClick={handleClick}
        disabled={!record.object_upload_url}
      >
        View
      </button>
    </>
  )
}
