import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { PasswordStrength } from '@/components/ui/password-strength'
import { Field, Select, Notice } from '../components/common/Ui.jsx'
import { COURSES, YEARS } from '../config/constants.js'
import { isEmail, isUserId, isEmpty } from '../utils/validation.js'

export default function Register() {
  const { db, register } = useData()
  const navigate = useNavigate()
  const [f, setF] = useState({ name: '', userId: '', email: '', emailType: 'University', password: '', confirm: '', dept: '', course: '', year: '' })
  const [err, setErr] = useState({})
  const [done, setDone] = useState(false)
  const set = (k) => (v) => setF({ ...f, [k]: v?.target ? v.target.value : v })

  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (isEmpty(f.name)) x.name = 'Official name is required.'
    if (!isUserId(f.userId)) x.userId = 'Use 4-20 letters, numbers, - or _.'
    else if (db.accounts.some((a) => a.userId.toLowerCase() === f.userId.toLowerCase())) x.userId = 'This User ID is already taken.'
    if (!isEmail(f.email)) x.email = 'Enter a valid email address.'
    else if (db.students.some((s) => s.email.toLowerCase() === f.email.toLowerCase())) x.email = 'This email is already registered.'
    if (f.password.length < 8) x.password = 'Password must be at least 8 characters.'
    if (f.confirm !== f.password) x.confirm = 'Passwords do not match.'
    ;['dept', 'course', 'year'].forEach((k) => { if (!f[k]) x[k] = 'Required.' })
    setErr(x)
    if (Object.keys(x).length) return
    register({ id: f.userId.toUpperCase(), name: f.name.trim(), email: f.email, emailType: f.emailType, dept: f.dept, course: f.course, year: f.year, classId: '', summary: '', skills: [], softSkills: [], github: '', linkedin: '', portfolio: '', resume: null, resumeVisibility: 'Private', showContact: false, photo: '', sections: { education: [], internships: [], workshops: [], competitions: [], volunteer: [] }, status: 'Active' }, f.password)
    setDone(true)
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <form onSubmit={submit} noValidate className="relative mx-auto my-8 w-full max-w-2xl space-y-4 rounded-[2rem] bg-white p-8 shadow-2xl">
        <h1 className="font-display text-3xl uppercase">Student Registration</h1>
        <Notice>Demo registration - this does not verify identity with the university. Use your name exactly as in the official record. Do not enter government ID numbers.</Notice>
        {done && <Notice tone="ok">Account created. Redirecting to login...</Notice>}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full professional name" error={err.name}><input className="input" value={f.name} onChange={set('name')} /></Field>
          <Field label="Unique user ID" error={err.userId}><input className="input" value={f.userId} onChange={set('userId')} /></Field>
          <Field label="Email address" error={err.email}><input className="input" value={f.email} onChange={set('email')} /></Field>
          <Field label="Email type"><Select value={f.emailType} onChange={set('emailType')} options={['University', 'Personal']} /></Field>
          <Field label="Department" error={err.dept}><Select value={f.dept} onChange={set('dept')} placeholder="Select" options={db.departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
          <Field label="Course" error={err.course}><Select value={f.course} onChange={set('course')} placeholder="Select" options={COURSES} /></Field>
          <Field label="Academic year / semester" error={err.year}><Select value={f.year} onChange={set('year')} placeholder="Select" options={YEARS} /></Field>
          <div />
          <Field label="Password" error={err.password}><input type="password" className="input" value={f.password} onChange={set('password')} autoComplete="new-password" /></Field>
          <Field label="Confirm password" error={err.confirm}><input type="password" className="input" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" /></Field>
        </div>
        <PasswordStrength value={f.password} />
        <button className="btn btn-primary w-full py-3">Create account</button>
        <p className="text-center text-sm">Already registered? <Link to="/login" className="font-bold text-brand">Login</Link></p>
      </form>
    </div>
  )
}
