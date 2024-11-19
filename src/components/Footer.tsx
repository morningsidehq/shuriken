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
        <span className={styles.version}>v0.2.4</span>
        {/* 0.2.3: Added advanced record creation, changed landing page for Constance-specific, added dashboard links with updated styling/layout, added Constance logo to loading screen */}
        {/* 0.2.4: Added the Actions page and some functionality. */}
      </div>
    </footer>
  )
}

export default Footer
