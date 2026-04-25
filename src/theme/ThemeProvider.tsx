import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { defaultTheme, type Theme } from './themes/default'

type ThemeContextValue = {
  theme: Theme
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  theme = defaultTheme,
}: {
  children: ReactNode
  theme?: Theme
}) {
  const value = useMemo<ThemeContextValue>(() => ({ theme }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}

