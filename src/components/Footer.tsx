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
        <span className={styles.version}>v0.2.3</span>
        {/* 0.2.3: Added advanced record creation */}
        {/* 0.2.3: Changed the landing page for Constance-specific. */}
        {/* 0.2.3: Added links to the dashboard. Updated styling and layout. */}
        {/* 0.2.3: Added Constance logo to the loading screen.*/}
      </div>
    </footer>
  )
}

export default Footer
