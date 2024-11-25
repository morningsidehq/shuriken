'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button
          variant="ghost"
          className={hasViewed ? 'text-purple-500' : ''}
          onClick={handleClick}
          disabled={!record.object_upload_url}
        >
          View
        </Button>
        <DialogContent className="max-h-[95vh] w-[95vw] max-w-[1400px]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="h-[85vh]">
            <iframe
              src={record.object_upload_url}
              className="h-full w-full"
              title="Document Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
