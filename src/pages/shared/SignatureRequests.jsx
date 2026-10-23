import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Empty, Field, Select, FileInput, Notice } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import Modal from '../../components/common/Modal.jsx'
import { SIGN_STATUS } from '../../config/constants.js'
import { fmtDate, isEmpty, today } from '../../utils/validation.js'

export default function SignatureRequests() {
  const { user, role } = useAuth()
  const { db, addSignature, updateSignature, uid } = useData()
  const [create, setCreate] = useState(false)
  const [f, setF] = useState({ title: '', docRef: '', facultyId: '', purpose: '', file: null })
  const [err, setErr] = useState('')
  const [openId, setOpenId] = useState(null)
  const [remark, setRemark] = useState('')
  const [rerr, setRerr] = useState('')
  const list = db.signatures.filter((r) => (role === 'student' ? r.studentId === user.id : r.facultyId === user.id))
  const cur = list.find((r) => r.id === openId)
  const nm = (id) => [...db.students, ...db.faculty].find((p) => p.id === id)?.name || id
  const docs = role === 'student' ? [...db.certificates.filter((c) => c.ownerId === user.id).map((c) => `Certificate: ${c.title}`), ...db.projects.filter((p) => p.ownerId === user.id).map((p) => `Project: ${p.title}`), 'Other document'] : []

  const save = () => {
    if (isEmpty(f.title) || !f.docRef || !f.facultyId || isEmpty(f.purpose)) return setErr('Title, document, faculty member and purpose are required.')
    addSignature({ id: uid('R'), studentId: user.id, facultyId: f.facultyId, title: f.title, purpose: f.purpose, docRef: f.docRef, file: f.file ? { name: f.file.name, size: f.file.size } : null, status: SIGN_STATUS.REQUESTED, createdAt: today(), remarks: [] })
    setCreate(false); setF({ title: '', docRef: '', facultyId: '', purpose: '', file: null }); setErr('')
  }
  const act = (status, needsRemark) => {
    if (needsRemark && !remark.trim()) return setRerr('Add a remark explaining your decision.')
    updateSignature(cur.id, status, remark.trim(), user.id); setRemark(''); setRerr('')
  }

  return (
    <div>
      <PageHeader title={role === 'student' ? 'E-Signature Requests' : 'Signature Requests'} subtitle="Approval workflow simulation.">{role === 'student' && <button className="btn btn-primary" onClick={() => setCreate(true)}>New request</button>}</PageHeader>
      <div className="mb-4"><Notice tone="warn">Approval is not a legal electronic signature. "Signed" here only marks a demo step; integrate a genuine e-signing provider in a later phase.</Notice></div>
      {list.length === 0 ? <Empty text="No requests yet." /> : (
        <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs uppercase text-ink/50"><tr><th className="py-2">Title</th><th>{role === 'student' ? 'Faculty' : 'Student'}</th><th>Created</th><th>Status</th><th /></tr></thead>
          <tbody>{list.map((r) => <tr key={r.id} className="border-t"><td className="py-2 font-semibold">{r.title}</td><td>{nm(role === 'student' ? r.facultyId : r.studentId)}</td><td>{fmtDate(r.createdAt)}</td><td><Badge>{r.status}</Badge></td><td><button className="btn btn-outline btn-sm" onClick={() => setOpenId(r.id)}>Open</button></td></tr>)}</tbody></table></div>
      )}
      {create && (
        <Modal title="New approval / signature request" onClose={() => setCreate(false)}>
          <div className="space-y-3">
            <Field label="Request title"><input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Document / project"><Select value={f.docRef} onChange={(v) => setF({ ...f, docRef: v })} placeholder="Select" options={docs} /></Field>
            <Field label="Faculty member"><Select value={f.facultyId} onChange={(v) => setF({ ...f, facultyId: v })} placeholder="Select" options={db.faculty.map((x) => ({ value: x.id, label: `${x.name} (${x.dept})` }))} /></Field>
            <Field label="Purpose"><textarea className="input" rows={3} value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} /></Field>
            <FileInput value={f.file} onChange={(v) => setF({ ...f, file: v })} label="Supporting file (optional)" />
            {err && <p className="text-xs font-semibold text-red-600">{err}</p>}
            <button className="btn btn-primary" onClick={save}>Submit request</button>
          </div>
        </Modal>
      )}
      {cur && (
        <Modal title={cur.title} onClose={() => { setOpenId(null); setRerr('') }}>
          <div className="space-y-3 text-sm">
            <div className="flex gap-2"><Badge>{cur.status}</Badge></div>
            <p><b>{role === 'student' ? 'Faculty' : 'Student'}:</b> {nm(role === 'student' ? cur.facultyId : cur.studentId)}</p>
            <p><b>Document:</b> {cur.docRef} {cur.file && `- ${cur.file.name}`}</p><p><b>Purpose:</b> {cur.purpose}</p>
            <div><p className="font-bold">Remarks</p>{cur.remarks.length === 0 ? <p className="text-ink/50">None yet.</p> : cur.remarks.map((m, i) => <p key={i}>{fmtDate(m.at)} - {nm(m.by)}: {m.text}</p>)}</div>
            {role === 'faculty' && ![SIGN_STATUS.REJECTED, SIGN_STATUS.SIGNED].includes(cur.status) && (
              <div className="space-y-2 border-t pt-3"><input className="input" placeholder="Remarks" value={remark} onChange={(e) => setRemark(e.target.value)} />{rerr && <p className="text-xs font-semibold text-red-600">{rerr}</p>}
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-outline btn-sm" onClick={() => act(SIGN_STATUS.REVIEW)}>Mark under review</button>
                  <button className="btn btn-outline btn-sm" onClick={() => act(SIGN_STATUS.CHANGES, true)}>Ask for corrections</button>
                  <button className="btn btn-danger btn-sm" onClick={() => act(SIGN_STATUS.REJECTED, true)}>Reject</button>
                  <button className="btn btn-primary btn-sm" onClick={() => act(SIGN_STATUS.APPROVED)}>Approve</button>
                  <button className="btn btn-lime btn-sm" disabled={cur.status !== SIGN_STATUS.APPROVED} title="Available after approval" onClick={() => act(SIGN_STATUS.SIGNED)}>Mark as signed (simulated)</button></div></div>)}
            {role === 'student' && cur.status === SIGN_STATUS.CHANGES && (
              <div className="space-y-2 border-t pt-3"><input className="input" placeholder="What did you correct?" value={remark} onChange={(e) => setRemark(e.target.value)} /><button className="btn btn-primary btn-sm" onClick={() => act(SIGN_STATUS.REQUESTED)}>Resubmit request</button></div>)}
          </div>
        </Modal>
      )}
    </div>
  )
}
