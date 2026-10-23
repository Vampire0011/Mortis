import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Field, Select, FileInput, ChipSelect, TagInput, Notice } from '../../components/common/Ui.jsx'
import { CATEGORIES, FLAIRS, VISIBILITY, VISIBILITY_HELP, CERT_STATUS } from '../../config/constants.js'
import { isEmpty, isUrl, today } from '../../utils/validation.js'

const empty = { title: '', category: '', issuer: '', issueDate: '', description: '', file: null, sourceUrl: '', sourceNote: '', evidenceNote: '', tags: [], flairs: [], visibility: VISIBILITY.PRIVATE }

export default function CertificateUpload() {
  const { user } = useAuth()
  const { addCertificate, uid, submitForVerification } = useData()
  const navigate = useNavigate()
  const [f, setF] = useState(empty)
  const [err, setErr] = useState({})
  const [msg, setMsg] = useState('')
  const set = (k) => (v) => setF({ ...f, [k]: v?.target ? v.target.value : v })

  // mode: 'draft' | 'self' (save without verification) | 'verify' (submit for faculty review)
  const save = (mode) => {
    const x = {}
    if (isEmpty(f.title)) x.title = 'Title is required.'
    if (!f.category) x.category = 'Choose a category.'
    if (isEmpty(f.issuer)) x.issuer = 'Issuing organisation is required.'
    if (!f.issueDate) x.issueDate = 'Issue date is required.'
    else if (f.issueDate > today()) x.issueDate = 'Issue date cannot be in the future.'
    if (f.sourceUrl && !isUrl(f.sourceUrl)) x.sourceUrl = 'Enter a valid http(s) URL.'
    if (mode !== 'draft' && !f.file) x.file = 'Attach the certificate file.'
    if (mode === 'verify' && !f.sourceUrl && isEmpty(f.sourceNote)) x.sourceNote = 'Provide a source URL, or explain where the certificate came from.'
    setErr(x)
    if (Object.keys(x).length) return
    const id = uid('C')
    const status = mode === 'self' ? CERT_STATUS.SELF : CERT_STATUS.DRAFT
    addCertificate({ ...f, id, ownerId: user.id, status, reviewerId: null, reviewComment: '', confidential: false, confidentialReason: '', shareEligible: true, published: false, reviewedAt: null, submittedAt: null, history: [] })
    if (mode === 'verify') submitForVerification(id) // sets status, notifies student and department faculty
    setMsg(mode === 'verify' ? 'Submitted for faculty verification. You will be notified of the decision.' : mode === 'self' ? 'Saved as a self-reported record (not verified).' : 'Saved as draft.')
    setTimeout(() => navigate('/student/certificates'), 1200)
  }

  return (
    <div>
      <PageHeader title="Upload Certificate" subtitle="Saving a record and requesting verification are separate actions." />
      {msg && <div className="mb-4"><Notice tone="ok">{msg}</Notice></div>}
      <div className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Certificate title" error={err.title}><input className="input" value={f.title} onChange={set('title')} /></Field>
          <Field label="Category" error={err.category}><Select value={f.category} onChange={set('category')} placeholder="Select" options={CATEGORIES} /></Field>
          <Field label="Issuing organisation" error={err.issuer}><input className="input" value={f.issuer} onChange={set('issuer')} /></Field>
          <Field label="Issue date" error={err.issueDate}><input type="date" className="input" value={f.issueDate} onChange={set('issueDate')} /></Field>
        </div>
        <Field label="Description"><textarea className="input" rows={3} value={f.description} onChange={set('description')} /></Field>
        <div><FileInput value={f.file} onChange={set('file')} label="Certificate file" />{err.file && <p className="mt-1 text-xs font-semibold text-red-600">{err.file}</p>}</div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Source / verification URL (if available)" error={err.sourceUrl}><input className="input" placeholder="https://" value={f.sourceUrl} onChange={set('sourceUrl')} /></Field>
          <Field label="No URL? Explain the source" error={err.sourceNote}><input className="input" value={f.sourceNote} onChange={set('sourceNote')} placeholder="e.g. Received by email from organisers" /></Field>
        </div>
        <Field label="Additional evidence (optional)"><textarea className="input" rows={2} value={f.evidenceNote} onChange={set('evidenceNote')} placeholder="Links to photos, event pages, mentors who can confirm..." /></Field>
        <Field label="Flairs"><ChipSelect options={FLAIRS} value={f.flairs} onChange={set('flairs')} /></Field>
        <Field label="Tags"><TagInput value={f.tags} onChange={set('tags')} placeholder="Type a tag and press Enter" /></Field>
        <Field label="Visibility preference" hint={VISIBILITY_HELP[f.visibility] + ' Nothing becomes public until you publish it, and faculty confidentiality always wins.'}><Select value={f.visibility} onChange={set('visibility')} options={Object.values(VISIBILITY)} /></Field>
        <div className="flex flex-wrap gap-3 border-t pt-4">
          <button className="btn btn-outline" onClick={() => save('draft')}>Save as draft</button>
          <button className="btn btn-lime" onClick={() => save('self')}>Save as self-reported record</button>
          <button className="btn btn-primary" onClick={() => save('verify')}>Submit for faculty verification</button>
        </div>
        <p className="text-xs text-ink/50">Demo only: files stay in your browser and are not uploaded anywhere. Small images are stored in localStorage; larger ones are kept only for the current session.</p>
      </div>
    </div>
  )
}
