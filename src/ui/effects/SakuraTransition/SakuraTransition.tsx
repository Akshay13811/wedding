import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './sakuraTransition.module.css'

type Petal = {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  drift: number
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

export function SakuraTransition() {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const prevPathRef = useRef<string>(location.pathname)
  const [show, setShow] = useState(false)
  const [vh, setVh] = useState(() => window.innerHeight || 700)

  useEffect(() => {
    function onResize() {
      setVh(window.innerHeight || 700)
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const prev = prevPathRef.current
    const next = location.pathname
    prevPathRef.current = next

    const isLandingToResult = prev === '/' && next.startsWith('/guest/')
    if (!isLandingToResult) return
    if (shouldReduceMotion) return

    setShow(true)
    const t = window.setTimeout(() => setShow(false), 1350)
    return () => window.clearTimeout(t)
  }, [location.pathname, shouldReduceMotion])

  const petals = useMemo<Petal[]>(() => {
    const rand = mulberry32(20260529)
    const count = 32
    return Array.from({ length: count }).map((_, i) => {
      const x = rand() * 100
      const size = 9 + rand() * 11
      const delay = rand() * 0.45
      const duration = 1.05 + rand() * 0.7
      const drift = (rand() - 0.5) * 110
      const rotate = (rand() - 0.5) * 180
      return { id: i, x, size, delay, duration, drift, rotate }
    })
  }, [])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          aria-hidden="true"
        >
          {petals.map((p) => (
            <motion.span
              key={p.id}
              className={styles.petal}
              style={{
                left: `${p.x}%`,
                width: p.size,
                height: p.size * 0.82,
              }}
              initial={{
                y: -30,
                x: 0,
                rotate: p.rotate,
                opacity: 0,
              }}
              animate={{
                y: vh + 140,
                x: p.drift,
                rotate: p.rotate + 260,
                opacity: [0, 1, 1, 0],
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

