import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('oes_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem('oes_user', JSON.stringify(user))
    else localStorage.removeItem('oes_user')
  }, [user])

  const login = async (email, password) => {
    // For now, accept any non-empty credentials
    if (!email || !password) throw new Error('Email and password required')
    const fakeUser = { id: 'u1', name: email.split('@')[0], email, role: 'student' }
    setUser(fakeUser)
    return fakeUser
  }

  const register = async (name, email, password) => {
    if (!name || !email || !password) throw new Error('All fields required')
    const fakeUser = { id: 'u1', name, email, role: 'student' }
    setUser(fakeUser)
    return fakeUser
  }

  const logout = () => setUser(null)

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


