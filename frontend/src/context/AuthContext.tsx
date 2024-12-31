import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { auth, users } from '../services/api'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const decoded: any = jwtDecode(token)
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token')
            setUser(null)
          } else {
            const response = await users.getProfile()
            setUser(response.data)
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          localStorage.removeItem('token')
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await auth.login({ email, password })
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    const response = await auth.register({ name, email, password, role })
    localStorage.setItem('token', response.data.token)
    setUser(response.data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const updateProfile = async (data: Partial<User>) => {
    const response = await users.updateProfile(data)
    setUser(response.data.user)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
