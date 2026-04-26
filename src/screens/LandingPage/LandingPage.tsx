import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { PageShell } from '../../ui/layouts/PageShell/PageShell'
import { useGuestData } from '../../data/GuestDataProvider'
import type { Guest } from '../../data/guests'
import { GuestTypeahead } from '../../ui/components/Typeahead/Typeahead'
import styles from './landingPage.module.css'

export function LandingPage() {
  const guestData = useGuestData()
  const shouldReduceMotion = useReducedMotion()

  const [phase, setPhase] = useState<'search' | 'transitioning' | 'result'>(
    'search',
  )
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)

  const onBack = useCallback(() => {
    setSelectedGuest(null)
    setPhase('search')
  }, [])

  const onPick = useCallback(
    (guest: Guest) => {
      setSelectedGuest(guest)
      if (shouldReduceMotion) {
        setPhase('result')
        return
      }
      setPhase('transitioning')
    },
    [shouldReduceMotion],
  )

  return (
    <motion.div
      className={styles.root}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <PageShell>
        <div className={styles.cardBody}>
          <AnimatePresence mode="wait">
            {phase === 'search' ? (
              <motion.div
                key="search"
                className={styles.panel}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className={styles.header}>
                  <h1 className={styles.title}>
                    Ganan <span aria-hidden="true">&amp;</span> Arabi
                  </h1>
                  <div className={styles.kicker}>29 May 2026</div>
                  <div className={styles.cover}><img src="cover.JPG" width="90%" /></div>
                  <p className={styles.subtitle}>
                    <span>Let the party begin!</span>
                    <span>Please search for your name below to find your table.</span>
                  </p>
                </div>

                {guestData.status === 'loading' ? (
                  <div className={styles.searchPlaceholder}>
                    Loading guest list…
                  </div>
                ) : guestData.status === 'error' ? (
                  <div className={styles.searchPlaceholder}>
                    Couldn't load the guest list.
                    <div className={styles.error}>{guestData.error}</div>
                  </div>
                ) : (
                  <GuestTypeahead guests={guestData.guests} onPick={onPick} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                className={styles.panel}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div className={styles.backButtonRow}>
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={onBack}
                  >
                    Back
                  </button>
                </div>

                <div className={styles.header}>
                  <div className={styles.kicker}>Your Seat</div>
                  <h2 className={styles.resultTitle}>
                    Table {selectedGuest?.table ?? '—'}
                  </h2>
                  <p className={styles.subtitle}>
                    {selectedGuest?.fullName ?? ''}
                  </p>
                </div>

                <div className={styles.actions}>
                  <a
                    className={styles.menuLink}
                    href={`${import.meta.env.BASE_URL}menu.pdf`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View menu (PDF)
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageShell>
    </motion.div>
  )
}

