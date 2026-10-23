import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Select, Empty, FileInput, Field, Notice } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import Modal from '../../components/common/Modal.jsx'
import { ASSIGN_STATUS } from '../../config/constants.js'
import { statusFor } from '../../utils/assignments.js'
import { fmtDate, isUrl } from '../../utils/validation.js'

const FILE_TYPES = ['application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'text/plain']

export default function StudentAssignments() {
  const { user } = useAuth()
  const { db, submitWork } = useData()
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(null)
  const [form, setForm] = useState({ file: null, link: '', note: '' })
  const [err, setErr] = useState('')

  const mine = db.assignments.filter((a) => a.assignedTo.includes(user.id))
  const subOf = (a) => db.submissions.find((s) => s.assignmentId === a.id && s.studentId === user.id)
  const rows = mine.map((a) => ({ a, sub: subOf(a), status: statusFor(a, subOf(a)) })).filter((r) => !filter || r.status === filter)
  const cur = mine.find((a) => a.id === open)
  const curSub = cur && subOf(cur)
  const canSubmit = cur && (!curSub || [ASSIGN_STATUS.CHANGES].includes(curSub.status))
  const late = cur && new Date(cur.deadline + 'T23:59:59') < new Date()

  const openIt = (a) => { setOpen(a.id); setErr(''); setForm({ file: null, link: '', note: '' }) }
  const submit = () => {
    if (!form.file && !form.link.trim()) return setErr('Attach a file or add a project link.')
    if (form.link && !isUrl(form.link)) return setErr('Enter a valid http(s) link.')
    if (form.link && !cur.formats.includes('link') && !form.file) return setErr('This assignment does not accept links - upload a file.')
    if (form.file) {
      const ext = form.file.name.split('.').pop().toLowerCase()
      if (!cur.formats.map((x) => x.toLowerCase()).includes(ext)) return setErr(`Allowed formats: ${cur.formats.join(', ')}`)
    }
    submitWork({ assignmentId: cur.id, studentId: user.id, file: form.file ? { name: form.file.name, size: form.file.size } : null, link: form.link, note: form.note })
    setOpen(null)
  }

  return (
    <div>
      <PageHeader title="My Assignments" subtitle="Assignments and projects assigned to you." />
      <div className="mb-4 max-w-xs"><Select value={filter} onChange={setFilter} placeholder="All statuses" options={Object.values(ASSIGN_STATUS)} /></div>
      {rows.length === 0 ? <Empty text="Nothing assigned yet." /> : (
        <div className="card overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-ink/50"><tr><th className="py-2">Title</th><th>Type</th><th>Deadline</th><th>Status</th><th /></tr></thead>
          <tbody>{rows.map(({ a, status }) => <tr key={a.id} className="border-t"><td className="py-2 font-semibold">{a.title}</td><td>{a.type}</td><td>{fmtDate(a.deadline)}</td><td><Badge>{status}</Badge></td><td><button className="btn btn-outline btn-sm" onClick={() => openIt(a)}>Open</button></td></tr>)}</tbody>
        </table></div>
      )}
      {cur && (
        <Modal title={cur.title} onClose={() => setOpen(null)}>
          <div className="space-y-3 text-sm">
            <p>{cur.description}</p>
            <p><b>Instructions:</b> {cur.instructions || '-'}</p>
            <p><b>Deadline:</b> {fmtDate(cur.deadline)} - <b>Formats:</b> {cur.formats.join(', ')}</p>
            {curSub && <div className="rounded-xl bg-mist p-3"><p><b>Your submission:</b> {curSub.file?.name || curSub.link} ({fmtDate(curSub.submittedAt)}) <Badge>{curSub.status}</Badge></p>{curSub.feedback && <p className="mt-1"><b>Faculty remarks:</b> {curSub.feedback}</p>}</div>}
            {canSubmit || !curSub ? (
              <div className="space-y-3 border-t pt-3">
                <h4 className="font-bold uppercase">{curSub ? 'Resubmit after corrections' : 'Submit your work'}</h4>
                {late && <Notice tone="warn">The deadline has passed. A late submission will still be sent to your faculty.</Notice>}
                <FileInput value={form.file} onChange={(v) => setForm({ ...form, file: v })} types={FILE_TYPES} maxMb={10} label="Upload file" hint={`Allowed formats: ${cur.formats.join(', ')}. Demo only - not uploaded anywhere.`} />
                <Field label="Or project link"><input className="input" placeholder="https://github.com/..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></Field>
                <Field label="Note to faculty"><textarea className="input" rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
                {err && <p className="text-xs font-semibold text-red-600">{err}</p>}
                <button className="btn btn-primary" onClick={submit}>{curSub ? 'Resubmit' : 'Submit'}</button>
              </div>
            ) : <p className="text-ink/60">No further action needed right now.</p>}
          </div>
        </Modal>
      )}
    </div>
  )
}
