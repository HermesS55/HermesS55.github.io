import { Navigate } from 'react-router-dom'

function ProtectedRoute({ auth, role, children }) {
  if (!auth.session) {
    return <Navigate to="/auth" replace />
  }

  if (role && auth.profile?.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
