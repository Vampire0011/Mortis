import { useState } from 'react'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Select, SearchBox, Empty } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import CertificateDetail from '../../components/common/CertificateDetail.jsx'
import { CATEGORIES, CERT_STATUS } from '../../config/constants.js'
import { fmtDate } from '../../utils/validation.js'

export default function CertificateReview() {
  const { db } = useData()
  const [f, setF] = useState({ q: '', dept: '', category: '', status: CERT_STATUS.PENDING, from: '', to: '' })
  const [open, setOpen] = useState(null)
  const set = (k) => (v) => setF({ ...f, [k]: v })
  // Only records that were submitted for verification are visible to reviewers (drafts / self-reported stay with the student).
  const list = db.certificates.filter((c) => c.submittedAt).map((c) => ({ c, s: db.students.find((x) => x.id === c.ownerId) })).filter(({ c, s }) => s)
    .filter(({ c, s }) => (!f.q || s.name.toLowerCase().includes(f.q.toLowerCase()) || s.id.toLowerCase().includes(f.q.toLowerCase())) && (!f.dept || s.dept === f.dept) && (!f.category || c.category === f.category) && (!f.status || c.status === f.status) && (!f.from || c.submittedAt >= f.from) && (!f.to || c.submittedAt <= f.to))
    .sort((a, b) => b.c.submittedAt.localeCompare(a.c.submittedAt))
  return (
    <div>
      <PageHeader title="Certificate Review" subtitle="A submitted link or image is evidence for review, not proof of authenticity." />
      <div className="card mb-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <SearchBox value={f.q} onChange={set('q')} placeholder="Student name or ID" />
        <Select value={f.dept} onChange={set('dept')} placeholder="All departments" options={db.departments.map((d) => ({ value: d.id, label: d.id }))} />
        <Select value={f.category} onChange={set('category')} placeholder="All categories" options={CATEGORIES} />
        <Select value={f.status} onChange={set('status')} placeholder="All statuses" options={[CERT_STATUS.PENDING, CERT_STATUS.APPROVED, CERT_STATUS.REJECTED, CERT_STATUS.CHANGES]} />
        <input type="date" className="input" value={f.from} onChange={(e) => set('from')(e.target.value)} aria-label="Submitted from" />
        <input type="date" className="input" value={f.to} onChange={(e) => set('to')(e.target.value)} aria-label="Submitted to" />
      </div>
      {list.length === 0 ? <Empty text="No submissions match." /> : (
        <div className="card overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-ink/50"><tr><th className="py-2">Student</th><th>Certificate</th><th>Category</th><th>Submitted</th><th>Status</th><th /></tr></thead>
          <tbody>{list.map(({ c, s }) => <tr key={c.id} className="border-t"><td className="py-2">{s.name}<br /><span className="text-xs text-ink/50">{s.id} - {s.dept}</span></td><td className="font-semibold">{c.title}</td><td>{c.category}</td><td>{fmtDate(c.submittedAt)}</td><td><Badge>{c.status}</Badge> {c.confidential && <Badge tone="Confidential">Confidential</Badge>}</td><td><button className="btn btn-primary btn-sm" onClick={() => setOpen(c.id)}>{c.status === CERT_STATUS.PENDING ? 'Review' : 'View'}</button></td></tr>)}</tbody>
        </table></div>
      )}
      {open && <CertificateDetail certId={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
