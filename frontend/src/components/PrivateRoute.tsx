import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'instructor' | 'admin'
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

export default PrivateRoute
