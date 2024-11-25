import React from 'react'
import styles from './Footer.module.css'
import { getAppVersion } from '@/utils/getAppVersion'
import { ThemeToggle } from './ThemeToggle'

const Footer = async () => {
  const version = await getAppVersion()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span className={styles.company}>
          <a
            href="https://morningsidehq.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Created by Morningside Foundry
          </a>
        </span>

        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>

        <span className={styles.version}>{version}</span>
      </div>
    </footer>
  )
}

export default Footer
