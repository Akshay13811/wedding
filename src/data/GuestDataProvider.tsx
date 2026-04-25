import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadGuests, type Guest } from './guests'

type GuestDataState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; guests: Guest[] }

const GuestDataContext = createContext<GuestDataState | null>(null)

export function GuestDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GuestDataState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    loadGuests()
      .then((guests) => {
        if (cancelled) return
        setState({ status: 'ready', guests })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setState({ status: 'error', error: msg })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(() => state, [state])
  return (
    <GuestDataContext.Provider value={value}>
      {children}
    </GuestDataContext.Provider>
  )
}

export function useGuestData() {
  const ctx = useContext(GuestDataContext)
  if (!ctx) {
    throw new Error('useGuestData must be used within GuestDataProvider')
  }
  return ctx
}

