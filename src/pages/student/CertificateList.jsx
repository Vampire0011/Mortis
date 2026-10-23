import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Select, SearchBox, Empty } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import CertificateDetail from '../../components/common/CertificateDetail.jsx'
import { CATEGORIES, CERT_STATUS, VISIBILITY } from '../../config/constants.js'
import { fmtDate } from '../../utils/validation.js'

export default function CertificateList() {
  const { user } = useAuth()
  const { db } = useData()
  const [f, setF] = useState({ q: '', category: '', status: '', visibility: '', from: '', to: '' })
  const [open, setOpen] = useState(null)
  const set = (k) => (v) => setF({ ...f, [k]: v })
  const list = db.certificates.filter((c) => c.ownerId === user.id)
    .filter((c) => (!f.q || c.title.toLowerCase().includes(f.q.toLowerCase())) && (!f.category || c.category === f.category) && (!f.status || c.status === f.status) && (!f.visibility || c.visibility === f.visibility) && (!f.from || c.issueDate >= f.from) && (!f.to || c.issueDate <= f.to))
    .sort((a, b) => b.issueDate.localeCompare(a.issueDate))

  return (
    <div>
      <PageHeader title="My Certificates" subtitle="Filter and manage your records."><Link to="/student/upload" className="btn btn-primary">Upload new</Link></PageHeader>
      <div className="card mb-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <SearchBox value={f.q} onChange={set('q')} placeholder="Search title" />
        <Select value={f.category} onChange={set('category')} placeholder="All categories" options={CATEGORIES} />
        <Select value={f.status} onChange={set('status')} placeholder="All statuses" options={Object.values(CERT_STATUS)} />
        <Select value={f.visibility} onChange={set('visibility')} placeholder="All visibility" options={Object.values(VISIBILITY)} />
        <input type="date" className="input" value={f.from} onChange={(e) => set('from')(e.target.value)} aria-label="From date" />
        <input type="date" className="input" value={f.to} onChange={(e) => set('to')(e.target.value)} aria-label="To date" />
      </div>
      {list.length === 0 ? <Empty text="No certificates match your filters." /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <div key={c.id} className="card flex flex-col">
              <div className="mb-2 flex flex-wrap gap-1"><Badge>{c.status}</Badge><Badge>{c.visibility}</Badge>{c.confidential && <Badge tone="Confidential">Confidential</Badge>}</div>
              <h3 className="font-bold">{c.title}</h3>
              <p className="text-xs text-ink/60">{c.category} - {c.issuer} - {fmtDate(c.issueDate)}</p>
              {c.published && <p className="mt-1 text-xs font-semibold text-emerald-700">Published</p>}
              <button className="btn btn-outline btn-sm mt-auto self-start" onClick={() => setOpen(c.id)}>View details</button>
            </div>
          ))}
        </div>
      )}
      {open && <CertificateDetail certId={open} onClose={() => setOpen(null)} />}
    </div>
  )
}
