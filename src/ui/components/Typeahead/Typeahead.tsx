import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Fuse from 'fuse.js'
import styles from './typeahead.module.css'
import type { Guest } from '../../../data/guests'

function normalizeQuery(q: string) {
  return q.trim().replace(/\s+/g, ' ')
}

export function GuestTypeahead({
  guests,
  onPick,
}: {
  guests: Guest[]
  onPick: (guest: Guest) => void
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  const fuse = useMemo(() => {
    return new Fuse(guests, {
      keys: ['fullName'],
      includeMatches: true,
      threshold: 0.25,
      minMatchCharLength: 1,
      ignoreLocation: true,
      shouldSort: true,
    })
  }, [guests])

  const normalized = normalizeQuery(query)

  const results = useMemo(() => {
    if (!normalized) return []
    return fuse.search(normalized, { limit: 8 })
  }, [fuse, normalized])

  useEffect(() => {
    setActiveIndex(0)
  }, [normalized])

  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      const el = wrapRef.current
      if (!el) return
      if (!el.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', onDocPointerDown)
    return () => document.removeEventListener('pointerdown', onDocPointerDown)
  }, [])

  useEffect(() => {
    function onResize() {
      setIsOpen(false)
    }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('orientationchange', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  const listId = 'guest-typeahead-list'
  const active = results[activeIndex]?.item

  const shouldShow = isOpen && normalized.length > 0

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <input
        className={styles.input}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Type your name…"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="words"
        spellCheck={false}
        role="combobox"
        aria-expanded={isOpen && results.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active ? `guest-opt-${active.id}` : undefined}
        onKeyDown={(e) => {
          if (!isOpen) return
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex((i) => Math.min(i + 1, results.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter') {
            if (!active) return
            e.preventDefault()
            setIsOpen(false)
            onPick(active)
          } else if (e.key === 'Escape') {
            setIsOpen(false)
          }
        }}
      />

      <AnimatePresence>
        {shouldShow ? (
          <motion.div
            className={styles.dropdown}
            role="listbox"
            id={listId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {results.length ? (
              results.map((r, idx) => {
                const isActive = idx === activeIndex
                return (
                  <button
                    key={r.item.id}
                    id={`guest-opt-${r.item.id}`}
                    type="button"
                    className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                    role="option"
                    aria-selected={isActive}
                    onPointerMove={() => setActiveIndex(idx)}
                    onClick={() => {
                      setIsOpen(false)
                      onPick(r.item)
                    }}
                  >
                    <div className={styles.name}>
                      {r.item.fullName}
                    </div>
                    <div className={styles.hint}>Tap to view your table</div>
                  </button>
                )
              })
            ) : (
              <div className={styles.empty}>
                No matches yet — try a shorter spelling.
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

