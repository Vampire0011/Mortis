import { useData } from '../../context/DataContext.jsx'
import { PageHeader, StatCard } from '../../components/common/Ui.jsx'
import { CERT_STATUS, CATEGORIES } from '../../config/constants.js'
import { fmtDate } from '../../utils/validation.js'
import { downloadCSV } from '../../utils/exporters.js'

function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return <div className="space-y-2">{data.map((d) => <div key={d.label} className="flex items-center gap-2 text-xs"><span className="w-28 shrink-0 truncate">{d.label}</span><div className="h-4 flex-1 rounded-full bg-mist"><div className="h-4 rounded-full bg-brand" style={{ width: `${(d.value / max) * 100}%` }} /></div><span className="w-6 text-right font-bold">{d.value}</span></div>)}</div>
}

export default function AdminDashboard() {
  const { db } = useData()
  const submitted = db.certificates.filter((c) => c.submittedAt)
  const count = (s) => db.certificates.filter((c) => c.status === s).length
  const approved = count(CERT_STATUS.APPROVED), rejected = count(CERT_STATUS.REJECTED)
  const rate = approved + rejected ? Math.round((approved / (approved + rejected)) * 100) : 0
  const cats = CATEGORIES.map((c) => ({ label: c, value: db.certificates.filter((x) => x.category === c).length })).filter((d) => d.value > 0)
  const depts = db.departments.map((d) => {
    const ids = db.students.filter((s) => s.dept === d.id).map((s) => s.id)
    const cs = db.certificates.filter((c) => ids.includes(c.ownerId))
    return { dept: d.id, students: ids.length, faculty: db.faculty.filter((f) => f.dept === d.id).length, certificates: cs.length, approved: cs.filter((c) => c.status === CERT_STATUS.APPROVED).length, pending: cs.filter((c) => c.status === CERT_STATUS.PENDING).length }
  })
  const recent = [...db.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8)
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Institution-wide summary (authorised administrative view)."><button className="btn btn-outline" onClick={() => downloadCSV('department-statistics.csv', depts)}>Export department stats (simulated)</button></PageHeader>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Registered students" value={db.students.length} tone="blue" /><StatCard label="Faculty members" value={db.faculty.length} />
        <StatCard label="Certificates submitted" value={submitted.length} /><StatCard label="Pending verification" value={count(CERT_STATUS.PENDING)} />
        <StatCard label="Approved" value={approved} tone="lime" /><StatCard label="Rejected" value={rejected} />
        <StatCard label="Assignments & projects" value={db.assignments.length} /><StatCard label="Approval rate" value={`${rate}%`} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card"><h2 className="mb-3 font-display text-lg uppercase">Activity by category</h2><Bars data={cats} /></div>
        <div className="card overflow-x-auto"><h2 className="mb-3 font-display text-lg uppercase">Department statistics</h2>
          <table className="w-full text-left text-sm"><thead className="text-xs uppercase text-ink/50"><tr><th>Dept</th><th>Students</th><th>Faculty</th><th>Certs</th><th>Approved</th><th>Pending</th></tr></thead>
            <tbody>{depts.map((d) => <tr key={d.dept} className="border-t"><td className="py-1 font-semibold">{d.dept}</td><td>{d.students}</td><td>{d.faculty}</td><td>{d.certificates}</td><td>{d.approved}</td><td>{d.pending}</td></tr>)}</tbody></table></div>
      </div>
      <div className="card mt-4"><h2 className="mb-3 font-display text-lg uppercase">Recent activity</h2><ul className="divide-y text-sm">{recent.map((n) => <li key={n.id} className="py-1.5"><b>{n.title}</b> <span className="text-ink/60">- {n.message}</span> <span className="text-xs text-ink/40">{fmtDate(n.createdAt)}</span></li>)}</ul></div>
    </div>
  )
}
