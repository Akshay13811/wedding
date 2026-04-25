import { HashRouter } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <HashRouter>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </HashRouter>
  )
}
