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
        <span className={styles.version}>v0.2.5</span>
        {/* 0.2.3: Added advanced record creation, changed landing page for Constance-specific, added dashboard links with updated styling/layout, added Constance logo to loading screen */}
        {/* 0.2.4: Added the Actions page and some functionality. */}
        {/* 0.2.41: Removed all Mobile-specific styling and RWD as it was causing issues. */}
        {/* 0.2.5: Added insert ability to actions page. Added filter capabilities to actions page. */}
      </div>
    </footer>
  )
}

export default Footer
