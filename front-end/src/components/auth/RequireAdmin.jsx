import { Navigate, useLocation } from 'react-router-dom'
import { getStoredUser } from '../../lib/storage.js'

export function RequireAdmin({ children }) {
  const location = useLocation()
  const user = getStoredUser()

  if (!user) {
    const next = location.pathname + (location.search || '')
    return <Navigate to={`/auth?next=${encodeURIComponent(next)}`} replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

