import React from 'react'
import styles from './Footer.module.css'

const Footer: React.FC = () => {
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
        <span className={styles.version}>v0.3.5</span>
      </div>
    </footer>
  )
}

export default Footer
