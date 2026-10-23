import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Empty, Field, TagInput, Notice } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import Modal from '../../components/common/Modal.jsx'
import { ASSIGN_STATUS } from '../../config/constants.js'
import { isUrl } from '../../utils/validation.js'

export default function StudentProjects() {
  const { user } = useAuth()
  const { db, addProject, updateProject, uid } = useData()
  const [target, setTarget] = useState(null) // submission being converted
  const [f, setF] = useState({ description: '', tech: [], github: '', demo: '', team: '', published: false })
  const [err, setErr] = useState('')

  const subs = db.submissions.filter((s) => s.studentId === user.id).map((s) => ({ s, a: db.assignments.find((x) => x.id === s.assignmentId) })).filter((r) => r.a?.type === 'Project')
  const portfolio = db.projects.filter((p) => p.ownerId === user.id)
  const added = (id) => portfolio.some((p) => p.submissionId === id)

  const save = () => {
    if (!f.description.trim()) return setErr('Add a short project description.')
    if (f.tech.length === 0) return setErr('List at least one technology or skill.')
    if ((f.github && !isUrl(f.github)) || (f.demo && !isUrl(f.demo))) return setErr('GitHub / demo links must be valid http(s) URLs.')
    const team = f.team.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => { const [n, ...c] = l.split('-'); return { name: n.trim(), contribution: c.join('-').trim() } })
    addProject({ id: uid('P'), ownerId: user.id, submissionId: target.s.id, assignmentId: target.a.id, title: target.a.title, description: f.description, tech: f.tech, github: f.github, demo: f.demo, team, published: f.published })
    setTarget(null); setF({ description: '', tech: [], github: '', demo: '', team: '', published: false }); setErr('')
  }

  return (
    <div>
      <PageHeader title="My Projects" subtitle="Approved projects can be added to your portfolio - publishing is always your choice." />
      <h2 className="mb-2 font-display text-lg uppercase">Project submissions</h2>
      {subs.length === 0 ? <Empty text="No project submissions yet. Submit work from My Assignments." /> : (
        <div className="grid gap-4 md:grid-cols-2">{subs.map(({ s, a }) => (
          <div key={s.id} className="card"><div className="mb-1 flex items-center justify-between"><h3 className="font-bold">{a.title}</h3><Badge>{s.status}</Badge></div>
            {s.feedback && <p className="text-sm text-ink/60">Remarks: {s.feedback}</p>}
            {s.status === ASSIGN_STATUS.APPROVED && !a.confidential && !added(s.id) && <button className="btn btn-lime btn-sm mt-3" onClick={() => setTarget({ s, a })}>Add to portfolio</button>}
            {a.confidential && <p className="mt-2 text-xs text-red-600">Confidential academic work cannot become a portfolio entry.</p>}
            {added(s.id) && <p className="mt-2 text-xs text-emerald-700">Added to portfolio.</p>}
          </div>))}</div>
      )}
      <h2 className="mb-2 mt-8 font-display text-lg uppercase">Portfolio projects</h2>
      {portfolio.length === 0 ? <Empty text="No portfolio projects yet." /> : (
        <div className="grid gap-4 md:grid-cols-2">{portfolio.map((p) => (
          <div key={p.id} className="card"><div className="flex items-center justify-between"><h3 className="font-bold">{p.title}</h3><Badge tone={p.published ? 'Active' : 'Private'}>{p.published ? 'Published' : 'Private'}</Badge></div>
            <p className="mt-1 text-sm">{p.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">{p.tech.map((t) => <span key={t} className="rounded-full bg-mist px-2 py-0.5 text-xs">{t}</span>)}</div>
            {p.team.length > 0 && <ul className="mt-2 text-xs text-ink/60">{p.team.map((m, i) => <li key={i}>{m.name}{m.contribution && ` - ${m.contribution}`}</li>)}</ul>}
            <div className="mt-2 flex gap-3 text-xs">{p.github && <a className="text-brand underline" href={p.github} target="_blank" rel="noreferrer">GitHub</a>}{p.demo && <a className="text-brand underline" href={p.demo} target="_blank" rel="noreferrer">Demo</a>}</div>
            <button className="btn btn-outline btn-sm mt-3" onClick={() => updateProject(p.id, { published: !p.published })}>{p.published ? 'Unpublish' : 'Publish'}</button></div>))}</div>
      )}
      {target && (
        <Modal title={`Add "${target.a.title}" to portfolio`} onClose={() => setTarget(null)}>
          <div className="space-y-3">
            <Field label="Project description"><textarea className="input" rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
            <Field label="Technologies & skills"><TagInput value={f.tech} onChange={(v) => setF({ ...f, tech: v })} placeholder="React, Node..." /></Field>
            <div className="grid gap-3 md:grid-cols-2"><Field label="GitHub link"><input className="input" value={f.github} onChange={(e) => setF({ ...f, github: e.target.value })} /></Field><Field label="Demo link"><input className="input" value={f.demo} onChange={(e) => setF({ ...f, demo: e.target.value })} /></Field></div>
            <Field label="Team members (one per line: Name - contribution)"><textarea className="input" rows={3} value={f.team} onChange={(e) => setF({ ...f, team: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} /> Publish on my profile now</label>
            <Notice>Do not include marks, internal grades or confidential material.</Notice>
            {err && <p className="text-xs font-semibold text-red-600">{err}</p>}
            <button className="btn btn-primary" onClick={save}>Save to portfolio</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
