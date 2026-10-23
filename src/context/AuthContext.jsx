import { createContext, useContext, useState } from 'react'
import { useData } from './DataContext.jsx'
import { load, save, remove } from '../utils/storage.js'

// DEMO AUTH ONLY: credentials are checked in the browser against mock data.
// Real security needs a backend (hashed passwords, sessions/JWT, server-side permissions).
const SESSION_KEY = 'hei_demo_session'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const { db } = useData()
  const [session, setSession] = useState(() => load(SESSION_KEY, null, localStorage) || load(SESSION_KEY, null, sessionStorage))

  const login = (userId, password, remember) => {
    const acc = db.accounts.find((a) => a.userId.toLowerCase() === userId.trim().toLowerCase())
    if (!acc || acc.password !== password) return { ok: false, error: 'Invalid User ID or password.' }
    if (acc.status !== 'Active') return { ok: false, error: 'This account is suspended. Contact the administrator.' }
    const s = { userId: acc.userId, role: acc.role }
    setSession(s)
    save(SESSION_KEY, s, remember ? localStorage : sessionStorage)
    return { ok: true, role: acc.role }
  }
  const logout = () => { setSession(null); remove(SESSION_KEY, localStorage); remove(SESSION_KEY, sessionStorage) }

  // Current user's profile record (student / faculty / admin)
  const user = session ? [...db.students, ...db.faculty, ...db.admins].find((p) => p.id === session.userId) || null : null
  return <Ctx.Provider value={{ session, user, role: session?.role, login, logout }}>{children}</Ctx.Provider>
}
