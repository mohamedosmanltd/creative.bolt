import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

// Simple admin auth using localStorage (demo credentials)
const ADMIN_CREDENTIALS = {
  email: 'admin@creative-re.com',
  password: 'admin123',
}

const STORAGE_KEY = 'cre_admin_session'

interface AdminUser {
  email: string
  name: string
}

interface AdminContextValue {
  user: AdminUser | null
  login: (email: string, password: string) => boolean
  logout: () => void
  loading: boolean
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // ignore
    }
    setLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const u = { email: ADMIN_CREDENTIALS.email, name: 'Admin' }
      setUser(u)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AdminContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}

export const ADMIN_CREDENTIALS_INFO = ADMIN_CREDENTIALS
