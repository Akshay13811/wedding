import styles from './petalDrift.module.css'

export function PetalDrift() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={`${styles.petal} ${styles.p1}`} />
      <span className={`${styles.petal} ${styles.p2}`} />
      <span className={`${styles.petal} ${styles.p3}`} />
      <span className={`${styles.petal} ${styles.p4}`} />
    </div>
  )
}

