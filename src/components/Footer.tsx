import React from 'react'
import { getAppVersion } from '@/utils/getAppVersion'

const Footer = async () => {
  const version = await getAppVersion()

  return (
    <footer className="border-t bg-background">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a
            href="https://morningsidehq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Created by Morningside Foundry
          </a>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">{version}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
