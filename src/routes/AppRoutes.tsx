import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { LandingPage } from '../screens/LandingPage/LandingPage'

export function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/guest/:guestId" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

