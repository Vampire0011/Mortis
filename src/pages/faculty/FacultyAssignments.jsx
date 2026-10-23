import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Empty, Field, Select, ChipSelect, Notice } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import Modal from '../../components/common/Modal.jsx'
import { ASSIGN_STATUS } from '../../config/constants.js'
import { statusFor } from '../../utils/assignments.js'
import { fmtDate, isEmpty, today } from '../../utils/validation.js'

const FORMATS = ['pdf', 'docx', 'zip', 'png', 'jpg', 'link']
const blank = { type: 'Assignment', title: '', description: '', instructions: '', deadline: '', formats: ['pdf'], classId: '', picked: [], confidential: false }

export default function FacultyAssignments() {
  const { user } = useAuth()
  const { db, addAssignment, uid, reviewSubmission } = useData()
  const [create, setCreate] = useState(false)
  const [f, setF] = useState(blank)
  const [err, setErr] = useState('')
  const [openId, setOpenId] = useState(null)
  const [fb, setFb] = useState({})
  const mine = db.assignments.filter((a) => a.facultyId === user.id)
  const classes = db.departments.flatMap((d) => d.classes)
  const cur = mine.find((a) => a.id === openId)
  const studentsOfClass = (cls) => db.students.filter((s) => s.classId === cls).map((s) => s.id)

  const save = () => {
    if (isEmpty(f.title) || isEmpty(f.description)) return setErr('Title and description are required.')
    if (!f.deadline) return setErr('Set a deadline.')
    if (f.deadline < today()) return setErr('The deadline cannot be in the past.')
    if (f.formats.length === 0) return setErr('Select at least one permitted format.')
    const assignedTo = [...new Set([...(f.classId ? studentsOfClass(f.classId) : []), ...f.picked])]
    if (assignedTo.length === 0) return setErr('Choose a class or at least one student.')
    const dept = db.departments.find((d) => d.classes.includes(f.classId))?.id || user.dept
    addAssignment({ id: uid('A'), type: f.type, title: f.title, description: f.description, instructions: f.instructions, facultyId: user.id, deptId: dept, classId: f.classId, assignedTo, deadline: f.deadline, formats: f.formats, confidential: f.type === 'Assignment' ? true : f.confidential, createdAt: today() })
    setCreate(false); setF(blank); setErr('')
  }

  return (
    <div>
      <PageHeader title="Assignments & Projects" subtitle="Create work, track submissions and give feedback."><button className="btn btn-primary" onClick={() => setCreate(true)}>Create new</button></PageHeader>
      {mine.length === 0 ? <Empty text="You have not created any assignments." /> : (
        <div className="grid gap-4 md:grid-cols-2">{mine.map((a) => {
          const subs = db.submissions.filter((s) => s.assignmentId === a.id)
          return <div key={a.id} className="card"><div className="flex items-center justify-between"><h3 className="font-bold">{a.title}</h3><Badge tone="Assigned">{a.type}</Badge></div>
            <p className="text-xs text-ink/60">Due {fmtDate(a.deadline)} - {a.classId || 'Selected students'} - {a.assignedTo.length} students</p>
            <p className="mt-2 text-sm">{subs.length} submitted, {a.assignedTo.length - subs.length} missing</p>
            <button className="btn btn-outline btn-sm mt-3" onClick={() => setOpenId(a.id)}>Track & review</button></div>
        })}</div>
      )}

      {create && (
        <Modal title="Create assignment / project" onClose={() => setCreate(false)} wide>
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2"><Field label="Type"><Select value={f.type} onChange={(v) => setF({ ...f, type: v })} options={['Assignment', 'Project']} /></Field><Field label="Deadline"><input type="date" className="input" min={today()} value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} /></Field></div>
            <Field label="Title"><input className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
            <Field label="Description"><textarea className="input" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <Field label="Submission instructions"><textarea className="input" rows={2} value={f.instructions} onChange={(e) => setF({ ...f, instructions: e.target.value })} /></Field>
            <Field label="Permitted formats"><ChipSelect options={FORMATS} value={f.formats} onChange={(v) => setF({ ...f, formats: v })} /></Field>
            <Field label="Class / group"><Select value={f.classId} onChange={(v) => setF({ ...f, classId: v })} placeholder="None (pick students below)" options={classes} /></Field>
            <Field label="Additional students"><div className="grid max-h-36 gap-1 overflow-y-auto rounded-xl border p-2 md:grid-cols-2">{db.students.map((s) => <label key={s.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.picked.includes(s.id)} onChange={(e) => setF({ ...f, picked: e.target.checked ? [...f.picked, s.id] : f.picked.filter((x) => x !== s.id) })} />{s.name} ({s.id})</label>)}</div></Field>
            {f.type === 'Project' && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.confidential} onChange={(e) => setF({ ...f, confidential: e.target.checked })} /> Confidential academic work (cannot be added to a public portfolio)</label>}
            {f.type === 'Assignment' && <Notice>Graded assignments are treated as confidential academic work and never become portfolio entries.</Notice>}
            {err && <p className="text-xs font-semibold text-red-600">{err}</p>}
            <button className="btn btn-primary" onClick={save}>Create & notify students</button>
          </div>
        </Modal>
      )}

      {cur && (
        <Modal title={cur.title} onClose={() => setOpenId(null)} wide>
          <div className="space-y-3 text-sm">
            <p>{cur.description} <span className="text-ink/50">(Due {fmtDate(cur.deadline)})</span></p>
            <table className="w-full text-left"><thead className="text-xs uppercase text-ink/50"><tr><th className="py-1">Student</th><th>Status</th><th>Submission</th></tr></thead>
              <tbody>{cur.assignedTo.map((sid) => {
                const st = db.students.find((s) => s.id === sid); const sub = db.submissions.find((s) => s.assignmentId === cur.id && s.studentId === sid)
                return <tr key={sid} className="border-t align-top"><td className="py-2">{st?.name}<br /><span className="text-xs text-ink/50">{sid}</span></td><td><Badge>{statusFor(cur, sub)}</Badge></td>
                  <td>{sub ? <div className="space-y-1"><p>{sub.file?.name} {sub.link && <a className="text-brand underline" href={sub.link} target="_blank" rel="noreferrer">{sub.link}</a>}</p>{sub.note && <p className="text-xs text-ink/60">Note: {sub.note}</p>}{sub.feedback && <p className="text-xs">Feedback: {sub.feedback}</p>}
                    <input className="input" placeholder="Feedback / remarks" value={fb[sub.id] || ''} onChange={(e) => setFb({ ...fb, [sub.id]: e.target.value })} />
                    <div className="flex flex-wrap gap-1">
                      <button className="btn btn-outline btn-sm" onClick={() => reviewSubmission(sub.id, ASSIGN_STATUS.REVIEW, fb[sub.id] || '')}>Under review</button>
                      <button className="btn btn-outline btn-sm" onClick={() => { if (!fb[sub.id]?.trim()) return alert('Add remarks explaining the corrections.'); reviewSubmission(sub.id, ASSIGN_STATUS.CHANGES, fb[sub.id]) }}>Request changes</button>
                      <button className="btn btn-primary btn-sm" onClick={() => reviewSubmission(sub.id, ASSIGN_STATUS.APPROVED, fb[sub.id] || '')}>Approve</button></div></div> : <span className="text-ink/40">Not submitted</span>}</td></tr>
              })}</tbody></table>
          </div>
        </Modal>
      )}
    </div>
  )
}
