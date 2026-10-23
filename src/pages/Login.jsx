import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { HOME, APP_NAME } from '../config/constants.js'
import { demoHints } from '../data/demoAccounts.js'
import Icon from '../components/common/Icon.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [f, setF] = useState({ userId: '', password: '', remember: false })
  const [show, setShow] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [errors, setErrors] = useState({})
  const [failed, setFailed] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!f.userId.trim()) er.userId = 'User ID is required.'
    if (!f.password) er.password = 'Password is required.'
    setErrors(er); setFailed('')
    if (Object.keys(er).length) return
    const r = login(f.userId, f.password, f.remember)
    if (!r.ok) return setFailed(r.error)
    navigate(HOME[r.role], { replace: true })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        <Link to="/" className="mb-5 inline-flex items-center gap-1 text-xs font-bold text-ink/50 hover:text-brand"><Icon name="ArrowLeft" size={14} /> Back to home</Link>
        <h1 className="font-display text-3xl uppercase">Login</h1>
        <p className="mb-5 text-sm text-ink/60">Sign in to {APP_NAME}. One login page for students, faculty and admins.</p>
        {failed && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">{failed}</div>}
        <form onSubmit={submit} noValidate className="space-y-4">
          <div><label className="label" htmlFor="uid">User ID</label><input id="uid" className="input" value={f.userId} onChange={(e) => setF({ ...f, userId: e.target.value })} autoComplete="username" />{errors.userId && <p className="mt-1 text-xs font-semibold text-red-600">{errors.userId}</p>}</div>
          <div><label className="label" htmlFor="pw">Password</label>
            <div className="relative"><input id="pw" type={show ? 'text' : 'password'} className="input pr-10" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
              <button type="button" className="absolute right-3 top-2.5 text-ink/50" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}><Icon name={show ? 'EyeOff' : 'Eye'} size={18} /></button></div>
            {errors.password && <p className="mt-1 text-xs font-semibold text-red-600">{errors.password}</p>}</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} /> Remember me (demo)</label>
          <button className="btn btn-primary w-full py-3">Login</button>
        </form>
        <p className="mt-4 text-center text-sm">New student? <Link to="/register" className="font-bold text-brand">Create an account</Link></p>
        <button className="mt-4 w-full text-xs font-bold text-brand underline" onClick={() => setShowDemo(!showDemo)}>{showDemo ? 'Hide' : 'Show'} demo accounts</button>
        {showDemo && (
          <div className="mt-2 space-y-2 rounded-xl bg-mist p-3 text-xs">
            {demoHints.map((d) => (
              <div key={d.userId} className="flex items-center justify-between gap-2"><span><b>{d.label}</b>: {d.userId} / {d.password}</span><button type="button" className="btn btn-outline btn-sm" onClick={() => setF({ ...f, userId: d.userId, password: d.password })}>Fill</button></div>
            ))}
            <p className="text-ink/50">Demo credentials only - not secure production credentials.</p>
          </div>
        )}
      </div>
    </div>
  )
}
