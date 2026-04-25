import type { ReactNode } from 'react'
import styles from './pageShell.module.css'
import { PetalDrift } from '../../effects/PetalDrift/PetalDrift'
import { CornerOrnaments } from '../../effects/CornerOrnaments/CornerOrnaments'

export function PageShell({
  children,
  footer,
}: {
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className={styles.shell}>
      <div className={styles.bgGlow} aria-hidden="true" />
      <CornerOrnaments />
      <div className={styles.container}>
        <main className={styles.card}>
          <PetalDrift />
          {children}
        </main>
        {footer ? <footer className={styles.footer}>{footer}</footer> : null}
      </div>
    </div>
  )
}

