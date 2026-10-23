import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, FileInput, Select, Notice, Field } from '../../components/common/Ui.jsx'
import { VISIBILITY } from '../../config/constants.js'
import { downloadPDF } from '../../utils/exporters.js'
import { inPublicPortfolio } from '../../utils/permissions.js'
import { completion } from '../../utils/profile.js'
import { fmtDate, formatSize } from '../../utils/validation.js'

const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export default function ResumeManagement() {
  const { user } = useAuth()
  const { db, updateStudent } = useData()
  const [msg, setMsg] = useState('')
  const certs = db.certificates.filter((c) => c.ownerId === user.id)
  const eligible = certs.filter(inPublicPortfolio)
  const setResume = (file) => { updateStudent(user.id, { resume: file ? { name: file.name, size: file.size, type: file.type, uploadedAt: file.uploadedAt || new Date().toISOString() } : null }); setMsg(file ? 'Resume saved for this demo.' : 'Resume removed.') }
  const pdf = () => downloadPDF(`${user.id}-profile-summary.pdf`, `${user.name} - Profile Summary`, [
    { Course: `${user.course}, ${user.year}` }, { Summary: user.summary || '-' }, { Skills: user.skills.join(', ') || '-' },
    ...eligible.map((c) => ({ Achievement: c.title, Issuer: c.issuer, Date: c.issueDate })),
  ])
  return (
    <div>
      <PageHeader title="My Resume" subtitle="Your resume is never published automatically." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-4">
          <FileInput value={user.resume} onChange={(v) => setResume(v)} types={RESUME_TYPES} label="Resume file" hint="PDF or Word, max 5 MB. Demo only - only the file name and details are stored." />
          {user.resume && <p className="text-xs text-ink/60">{user.resume.name} - {formatSize(user.resume.size)} - uploaded {fmtDate(user.resume.uploadedAt)}</p>}
          {msg && <Notice tone="ok">{msg}</Notice>}
          <Field label="Resume visibility" hint="Private by default."><Select value={user.resumeVisibility} onChange={(v) => updateStudent(user.id, { resumeVisibility: v })} options={[VISIBILITY.PRIVATE, VISIBILITY.UNIVERSITY]} /></Field>
          <div><p className="text-xs font-bold">Profile completion: {completion(user, certs.length)}%</p><div className="mt-1 h-2 rounded-full bg-mist"><div className="h-2 rounded-full bg-brand" style={{ width: `${completion(user, certs.length)}%` }} /></div></div>
        </div>
        <div className="card space-y-2 text-sm">
          <h3 className="font-display text-lg uppercase">Preview</h3>
          <p className="text-xl font-black">{user.name}</p><p className="text-ink/60">{user.course} - {user.year} - {user.dept}</p>
          <p>{user.summary || 'Add a summary in My Profile.'}</p>
          <p><b>Skills:</b> {user.skills.join(', ') || '-'}</p>
          <p><b>Education:</b> {user.sections.education.join('; ') || '-'}</p>
          <p><b>Public-eligible achievements:</b> {eligible.map((c) => c.title).join('; ') || 'None (confidential and private records are excluded)'}</p>
          <button className="btn btn-primary btn-sm" onClick={pdf}>Download simple profile PDF</button>
          <p className="text-xs text-ink/50">Full resume generation / templates is a future integration point.</p>
        </div>
      </div>
    </div>
  )
}
