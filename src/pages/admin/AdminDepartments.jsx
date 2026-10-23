import { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Field, Notice } from '../../components/common/Ui.jsx'

export default function AdminDepartments() {
  const { db, addDepartment, removeDepartment, renameDepartment, addClass } = useData()
  const [n, setN] = useState({ id: '', name: '' })
  const [cls, setCls] = useState({})
  const [err, setErr] = useState('')
  const add = () => {
    const id = n.id.trim().toUpperCase()
    if (!id || !n.name.trim()) return setErr('Department code and name are required.')
    if (db.departments.some((d) => d.id === id)) return setErr('That department code already exists.')
    addDepartment({ id, name: n.name.trim(), classes: [] }); setN({ id: '', name: '' }); setErr('')
  }
  const inUse = (id) => db.students.some((s) => s.dept === id) || db.faculty.some((f) => f.dept === id)
  return (
    <div>
      <PageHeader title="Departments & Classes" subtitle="Changes here appear in registration and assignment forms." />
      <div className="card mb-4 grid items-end gap-3 md:grid-cols-4"><Field label="Code"><input className="input" value={n.id} onChange={(e) => setN({ ...n, id: e.target.value })} /></Field><Field label="Name"><input className="input md:col-span-2" value={n.name} onChange={(e) => setN({ ...n, name: e.target.value })} /></Field><button className="btn btn-primary" onClick={add}>Add department</button>{err && <p className="text-xs font-semibold text-red-600 md:col-span-4">{err}</p>}</div>
      <div className="grid gap-4 md:grid-cols-2">{db.departments.map((d) => (
        <div key={d.id} className="card space-y-2">
          <div className="flex items-center justify-between"><h3 className="font-display text-lg">{d.id}</h3><button className="btn btn-danger btn-sm" disabled={inUse(d.id)} title={inUse(d.id) ? 'Has students or faculty' : ''} onClick={() => confirm(`Remove ${d.id}?`) && removeDepartment(d.id)}>Remove</button></div>
          <input className="input" defaultValue={d.name} onBlur={(e) => e.target.value.trim() && renameDepartment(d.id, e.target.value.trim())} aria-label="Department name" />
          <p className="text-xs text-ink/60">Classes: {d.classes.join(', ') || 'none'} - {db.students.filter((s) => s.dept === d.id).length} students</p>
          <div className="flex gap-2"><input className="input" placeholder="New class e.g. CSE-4A" value={cls[d.id] || ''} onChange={(e) => setCls({ ...cls, [d.id]: e.target.value })} /><button className="btn btn-outline btn-sm" onClick={() => { if (cls[d.id]?.trim()) { addClass(d.id, cls[d.id].trim().toUpperCase()); setCls({ ...cls, [d.id]: '' }) } }}>Add class</button></div>
        </div>))}</div>
      <div className="mt-4"><Notice>Departments in use cannot be removed (demo safeguard).</Notice></div>
    </div>
  )
}
