import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import styles from './cardSakuraReveal.module.css'

type Petal = {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  driftX: number
  driftY: number
  rotate: number
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function CardSakuraReveal({
  active,
  onComplete,
}: {
  active: boolean
  onComplete: () => void
}) {
  const shouldReduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!active) return
    if (shouldReduceMotion) {
      setVisible(false)
      onComplete()
      return
    }
    setVisible(true)
    const t = window.setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 1050)
    return () => window.clearTimeout(t)
  }, [active, onComplete, shouldReduceMotion])

  const petals = useMemo<Petal[]>(() => {
    const rand = mulberry32(20260529)
    const count = 400
    return Array.from({ length: count }).map((_, i) => {
      const x = rand() * 100
      const y = rand() * 100
      const size = 10 + rand() * 12
      const delay = rand() * 0.35
      const duration = 0.65 + rand() * 0.55
      const driftX = (rand() - 0.5) * 120
      const driftY = 18 + rand() * 70
      const rotate = (rand() - 0.5) * 180
      return { id: i, x, y, size, delay, duration, driftX, driftY, rotate }
    })
  }, [])

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          aria-hidden="true"
        >
          {petals.map((p) => (
            <motion.span
              key={p.id}
              className={styles.petal}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size * 0.82,
              }}
              initial={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotate: p.rotate,
              }}
              animate={{
                opacity: 0,
                x: p.driftX,
                y: p.driftY,
                scale: 0.85,
                rotate: p.rotate + 240,
                filter: 'blur(0.3px)',
              }}
              transition={{
                delay: p.delay,
                duration: p.duration,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

