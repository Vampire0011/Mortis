import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Select, Empty, Notice } from '../../components/common/Ui.jsx'
import { CATEGORIES, CERT_STATUS, ASSIGN_STATUS } from '../../config/constants.js'
import { downloadCSV, downloadPDF } from '../../utils/exporters.js'
import { statusFor } from '../../utils/assignments.js'

export default function Reports() {
  const { user, role } = useAuth()
  const { db } = useData()
  const types = {
    student: ['My achievement summary', 'My approved certificates', 'My project summary', 'My assignment completion'],
    faculty: ['Approved certificate list', 'Assignment completion summary'],
    admin: ['Institution statistics', 'Approved certificate list', 'Assignment completion summary', 'Student project summary'],
  }[role]
  const [type, setType] = useState(types[0])
  const [dept, setDept] = useState('')
  const [category, setCategory] = useState('')
  const stu = (id) => db.students.find((s) => s.id === id)
  const inDept = (sid) => !dept || stu(sid)?.dept === dept

  // Every certificate row excludes confidential records - they never appear in any export.
  const certRows = (own) => db.certificates.filter((c) => !c.confidential && c.status === CERT_STATUS.APPROVED && (!own || c.ownerId === user.id) && inDept(c.ownerId) && (!category || c.category === category))
    .map((c) => ({ Student: stu(c.ownerId)?.name, ID: c.ownerId, Certificate: c.title, Category: c.category, Issuer: c.issuer, Date: c.issueDate }))
  const assignRows = (scope) => db.assignments.filter((a) => (scope === 'mine' ? a.assignedTo.includes(user.id) : role === 'faculty' ? a.facultyId === user.id : true)).flatMap((a) => (scope === 'mine' ? [user.id] : a.assignedTo).filter(inDept).map((sid) => ({ Assignment: a.title, Type: a.type, Student: stu(sid)?.name, ID: sid, Status: statusFor(a, db.submissions.find((s) => s.assignmentId === a.id && s.studentId === sid)) })))
  const projectRows = (own) => db.projects.filter((p) => (!own || p.ownerId === user.id) && inDept(p.ownerId)).map((p) => ({ Student: stu(p.ownerId)?.name, Project: p.title, Technologies: p.tech.join(', '), Published: p.published ? 'Yes' : 'No' }))

  let rows = []
  if (type === 'My achievement summary') rows = db.certificates.filter((c) => c.ownerId === user.id && !c.confidential).map((c) => ({ Title: c.title, Category: c.category, Status: c.status, Visibility: c.visibility }))
  else if (type === 'My approved certificates') rows = certRows(true)
  else if (type === 'My project summary') rows = projectRows(true)
  else if (type === 'My assignment completion') rows = assignRows('mine')
  else if (type === 'Approved certificate list') rows = certRows(false)
  else if (type === 'Assignment completion summary') rows = assignRows('all')
  else if (type === 'Student project summary') rows = projectRows(false)
  else if (type === 'Institution statistics') rows = db.departments.map((d) => { const ids = db.students.filter((s) => s.dept === d.id).map((s) => s.id); const cs = db.certificates.filter((c) => ids.includes(c.ownerId)); return { Department: d.id, Students: ids.length, Certificates: cs.length, Approved: cs.filter((c) => c.status === CERT_STATUS.APPROVED).length, Pending: cs.filter((c) => c.status === CERT_STATUS.PENDING).length } })

  const name = type.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <PageHeader title="Reports" subtitle="Filter, preview and export. Confidential records are always excluded." />
      <div className="card mb-4 grid gap-3 md:grid-cols-3"><Select value={type} onChange={setType} options={types} />
        {role !== 'student' && <Select value={dept} onChange={setDept} placeholder="All departments" options={db.departments.map((d) => d.id)} />}
        {/certificate/i.test(type) && <Select value={category} onChange={setCategory} placeholder="All categories" options={CATEGORIES} />}</div>
      <div className="mb-4 flex gap-2"><button className="btn btn-primary" disabled={!rows.length} onClick={() => downloadCSV(`${name}.csv`, rows)}>Export CSV</button><button className="btn btn-lime" disabled={!rows.length} onClick={() => downloadPDF(`${name}.pdf`, type, rows)}>Export PDF</button></div>
      {rows.length === 0 ? <Empty text="No data for the selected filters." /> : (
        <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-ink/50"><tr>{Object.keys(rows[0]).map((k) => <th key={k} className="py-2 pr-4">{k}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i} className="border-t">{Object.values(r).map((v, j) => <td key={j} className="py-1.5 pr-4">{String(v ?? '')}</td>)}</tr>)}</tbody></table></div>
      )}
      <div className="mt-4"><Notice>Exports are generated in your browser for demonstration. Real institutional reporting needs a backend with authorised access control.</Notice></div>
    </div>
  )
}
