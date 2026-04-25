import { useTheme } from '../../../theme/ThemeProvider'
import styles from './cornerOrnaments.module.css'

export function CornerOrnaments() {
  const { theme } = useTheme()
  const c = theme.ornaments.corners

  return (
    <div className={styles.wrap} aria-hidden="true">
      {c.topLeft ? (
        <img className={`${styles.img} ${styles.topLeft}`} src={c.topLeft} alt="" />
      ) : null}
      {c.topRight ? (
        <img className={`${styles.img} ${styles.topRight}`} src={c.topRight} alt="" />
      ) : null}
      {c.bottomLeft ? (
        <img
          className={`${styles.img} ${styles.bottomLeft}`}
          src={c.bottomLeft}
          alt=""
        />
      ) : null}
      {c.bottomRight ? (
        <img
          className={`${styles.img} ${styles.bottomRight}`}
          src={c.bottomRight}
          alt=""
        />
      ) : null}
    </div>
  )
}

