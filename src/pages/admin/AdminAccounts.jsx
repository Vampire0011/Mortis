import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Select, SearchBox, Empty, Notice } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'

export default function AdminAccounts() {
  const { db, setAccountStatus } = useData()
  const [f, setF] = useState({ q: '', role: '', dept: '', status: '' })
  const set = (k) => (v) => setF({ ...f, [k]: v })
  const all = [...db.students.map((s) => ({ ...s, role: 'student' })), ...db.faculty.map((s) => ({ ...s, role: 'faculty' }))]
  const statusOf = (id) => db.accounts.find((a) => a.userId === id)?.status || 'Active'
  const list = all.filter((p) => (!f.q || p.name.toLowerCase().includes(f.q.toLowerCase()) || p.id.toLowerCase().includes(f.q.toLowerCase())) && (!f.role || p.role === f.role) && (!f.dept || p.dept === f.dept) && (!f.status || statusOf(p.id) === f.status))
  return (
    <div>
      <PageHeader title="Accounts" subtitle="Passwords are never shown. Suspending an account blocks demo login." />
      <div className="card mb-4 grid gap-3 md:grid-cols-4"><SearchBox value={f.q} onChange={set('q')} placeholder="Name or ID" /><Select value={f.role} onChange={set('role')} placeholder="All roles" options={['student', 'faculty']} /><Select value={f.dept} onChange={set('dept')} placeholder="All departments" options={db.departments.map((d) => d.id)} /><Select value={f.status} onChange={set('status')} placeholder="All statuses" options={['Active', 'Suspended']} /></div>
      {list.length === 0 ? <Empty text="No accounts match." /> : (
        <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-ink/50"><tr><th className="py-2">Name</th><th>ID</th><th>Role</th><th>Dept</th><th>Class</th><th>Status</th><th /></tr></thead>
          <tbody>{list.map((p) => { const st = statusOf(p.id); return <tr key={p.id} className="border-t"><td className="py-2 font-semibold">{p.role === 'student' ? <Link className="hover:text-brand" to={`/profile/${p.id}`}>{p.name}</Link> : p.name}</td><td>{p.id}</td><td className="capitalize">{p.role}</td><td>{p.dept}</td><td>{p.classId || '-'}</td><td><Badge>{st}</Badge></td><td><button className="btn btn-outline btn-sm" onClick={() => setAccountStatus(p.id, st === 'Active' ? 'Suspended' : 'Active')}>{st === 'Active' ? 'Suspend' : 'Activate'}</button></td></tr> })}</tbody></table></div>
      )}
      <div className="mt-4"><Notice>Admins see account details only. Certificate content and confidential records are not exposed here.</Notice></div>
    </div>
  )
}
