import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ redirectTo = '/login' }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />
  return <Outlet />
}

export default ProtectedRoute

