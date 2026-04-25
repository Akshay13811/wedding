import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import { GuestDataProvider } from './data/GuestDataProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <GuestDataProvider>
        <App />
      </GuestDataProvider>
    </ThemeProvider>
  </StrictMode>,
)
