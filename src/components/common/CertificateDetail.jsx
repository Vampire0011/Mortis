import { useState } from 'react'
import Modal from './Modal.jsx'
import Badge from './Badge.jsx'
import { Notice, Select, Field } from './Ui.jsx'
import { useData } from '../../context/DataContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { CERT_STATUS, VISIBILITY, VISIBILITY_HELP } from '../../config/constants.js'
import { canPublish, canEditCert, publishBlockReason } from '../../utils/permissions.js'
import { fmtDate, formatSize, isUrl } from '../../utils/validation.js'

// Shared detail modal. Shows student actions for the owner and the review form for faculty.
export default function CertificateDetail({ certId, onClose }) {
  const { db, setPublished, setVisibility, submitForVerification, deleteCertificate, reviewCertificate } = useData()
  const { user, role } = useAuth()
  const c = db.certificates.find((x) => x.id === certId)
  const [src, setSrc] = useState({ sourceUrl: '', sourceNote: '' })
  const [srcErr, setSrcErr] = useState('')
  const [rv, setRv] = useState({ decision: 'approve', comment: '', confidential: false, reason: '', shareEligible: true })
  const [rvErr, setRvErr] = useState('')
  if (!c) return null
  const owner = db.students.find((s) => s.id === c.ownerId)
  const reviewer = db.faculty.find((f) => f.id === c.reviewerId)
  const isOwner = role === 'student' && user.id === c.ownerId
  const isStaff = role === 'faculty' || role === 'admin'
  const block = publishBlockReason(c)

  const resubmit = () => {
    const url = (src.sourceUrl || c.sourceUrl || '').trim(); const note = (src.sourceNote || c.sourceNote || '').trim()
    if (!url && !note) return setSrcErr('Provide a source/verification URL, or explain where the certificate came from.')
    if (url && !isUrl(url)) return setSrcErr('Enter a valid URL starting with http:// or https://')
    submitForVerification(c.id, { sourceUrl: url, sourceNote: note })
    onClose()
  }
  const review = () => {
    if (rv.decision !== 'approve' && !rv.comment.trim()) return setRvErr('A comment is required when rejecting or requesting changes.')
    if (rv.confidential && !rv.reason.trim()) return setRvErr('Give a reason for marking this record confidential.')
    reviewCertificate(c.id, { ...rv, reviewerId: user.id })
    onClose()
  }

  return (
    <Modal title={c.title} onClose={onClose} wide>
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap gap-2"><Badge>{c.status}</Badge><Badge>{c.visibility}</Badge>{c.confidential && <Badge tone="Confidential">Confidential</Badge>}{c.published && <Badge tone="Active">Published</Badge>}</div>
        <div className="grid gap-2 md:grid-cols-2">
          <p><b>Owner:</b> {owner?.name} ({c.ownerId})</p><p><b>Category:</b> {c.category}</p>
          <p><b>Issuer:</b> {c.issuer}</p><p><b>Issue date:</b> {fmtDate(c.issueDate)}</p>
          <p><b>Submitted:</b> {fmtDate(c.submittedAt)}</p><p><b>Reviewed by:</b> {reviewer?.name || '-'} {c.reviewedAt && `(${fmtDate(c.reviewedAt)})`}</p>
        </div>
        {c.description && <p>{c.description}</p>}
        {c.flairs.length + c.tags.length > 0 && <div className="flex flex-wrap gap-1">{c.flairs.map((f) => <span key={f} className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold">{f}</span>)}{c.tags.map((t) => <span key={t} className="rounded-full bg-mist px-2 py-0.5 text-xs">#{t}</span>)}</div>}
        <div className="rounded-xl bg-mist p-3">
          <p className="mb-1 font-bold">Evidence (for review - not proof of authenticity by itself)</p>
          {c.file ? <div className="flex items-center gap-3">{c.file.dataUrl && <img src={c.file.dataUrl} alt="Certificate" className="h-24 rounded-lg" />}<span>{c.file.name} ({formatSize(c.file.size)})</span></div> : <p className="text-ink/50">No file attached.</p>}
          {c.sourceUrl && <p className="mt-1">Source: <a className="font-semibold text-brand underline" href={c.sourceUrl} target="_blank" rel="noreferrer">{c.sourceUrl}</a></p>}
          {c.sourceNote && <p className="mt-1"><b>Student's explanation:</b> {c.sourceNote}</p>}
          {c.evidenceNote && <p className="mt-1"><b>Additional evidence:</b> {c.evidenceNote}</p>}
        </div>
        {(isOwner || isStaff) && c.reviewComment && <Notice tone={c.status === CERT_STATUS.APPROVED ? 'ok' : 'warn'}><b>Faculty comment:</b> {c.reviewComment}</Notice>}
        {c.confidential && (isOwner || isStaff) && <Notice tone="error"><b>Confidential:</b> {c.confidentialReason || 'Marked by faculty'}. This record cannot be published, shared, or exported publicly.</Notice>}
        {c.history.length > 0 && <details><summary className="cursor-pointer font-bold">History</summary><ul className="mt-1 list-disc pl-5">{c.history.map((h, i) => <li key={i}>{fmtDate(h.at)} - {h.text}</li>)}</ul></details>}

        {isOwner && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-bold uppercase">Your actions</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Visibility" hint={c.confidential ? 'Locked by faculty confidentiality flag.' : VISIBILITY_HELP[c.visibility]}>
                <Select value={c.visibility} onChange={(v) => setVisibility(c.id, v)} options={Object.values(VISIBILITY)} className={c.confidential ? 'opacity-50' : ''} />
              </Field>
              <div className="flex items-end">
                {c.published ? <button className="btn btn-outline" onClick={() => setPublished(c.id, false)}>Unpublish</button>
                  : <button className="btn btn-lime" disabled={!canPublish(c) || c.visibility === VISIBILITY.PRIVATE} onClick={() => setPublished(c.id, true)}>Publish achievement</button>}
              </div>
            </div>
            {!c.published && block && <p className="text-xs text-amber-700">{block}</p>}
            {c.status === CERT_STATUS.APPROVED && !c.published && !block && <p className="text-xs text-emerald-700">Approved but not public. Publishing is your choice.</p>}
            {[CERT_STATUS.DRAFT, CERT_STATUS.SELF, CERT_STATUS.CHANGES, CERT_STATUS.REJECTED].includes(c.status) && (
              <div className="space-y-2 rounded-xl border p-3">
                <p className="font-bold">{c.status === CERT_STATUS.CHANGES || c.status === CERT_STATUS.REJECTED ? 'Update evidence & resubmit' : 'Submit for faculty verification'}</p>
                <input className="input" placeholder="Certificate source / verification URL (optional)" defaultValue={c.sourceUrl} onChange={(e) => setSrc({ ...src, sourceUrl: e.target.value })} />
                <textarea className="input" rows={2} placeholder="No URL? Explain where the certificate came from" defaultValue={c.sourceNote} onChange={(e) => setSrc({ ...src, sourceNote: e.target.value })} />
                {srcErr && <p className="text-xs font-semibold text-red-600">{srcErr}</p>}
                <button className="btn btn-primary btn-sm" onClick={resubmit}>Submit for verification</button>
              </div>
            )}
            {canEditCert(c) && c.status !== CERT_STATUS.REJECTED && <button className="btn btn-danger btn-sm" onClick={() => { if (confirm('Delete this record?')) { deleteCertificate(c.id); onClose() } }}>Delete record</button>}
          </div>
        )}

        {role === 'faculty' && c.status === CERT_STATUS.PENDING && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-bold uppercase">Faculty review</h4>
            <div className="flex flex-wrap gap-4">
              {[['approve', 'Approve'], ['reject', 'Reject'], ['changes', 'Request changes / evidence']].map(([v, l]) => <label key={v} className="flex items-center gap-1"><input type="radio" name="dec" checked={rv.decision === v} onChange={() => setRv({ ...rv, decision: v })} />{l}</label>)}
            </div>
            <textarea className="input" rows={3} placeholder="Review comment / reason" value={rv.comment} onChange={(e) => setRv({ ...rv, comment: e.target.value })} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={rv.confidential} onChange={(e) => setRv({ ...rv, confidential: e.target.checked, shareEligible: e.target.checked ? false : rv.shareEligible })} /> Mark as confidential (never public)</label>
            {rv.confidential && <input className="input" placeholder="Reason (e.g. examination results)" value={rv.reason} onChange={(e) => setRv({ ...rv, reason: e.target.value })} />}
            <label className="flex items-center gap-2"><input type="checkbox" disabled={rv.confidential} checked={rv.shareEligible} onChange={(e) => setRv({ ...rv, shareEligible: e.target.checked })} /> Eligible for sharing</label>
            {rvErr && <p className="text-xs font-semibold text-red-600">{rvErr}</p>}
            <p className="text-xs text-ink/50">Faculty decisions are simulated in this demo; the app does not verify authenticity automatically.</p>
            <button className="btn btn-primary" onClick={review}>Record decision</button>
          </div>
        )}
      </div>
    </Modal>
  )
}
