import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Tabs, Field, TagInput, ListEditor, Avatar, Notice, Empty } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import { isUrl } from '../../utils/validation.js'
import { completion } from '../../utils/profile.js'

const SECTIONS = [['education', 'Education'], ['internships', 'Internships'], ['workshops', 'Workshops & seminars'], ['competitions', 'Competitions'], ['volunteer', 'Volunteer work']]
const TABS = ['Details', 'Skills', 'Experience', 'Achievements', 'Projects', 'Certificates']

export default function StudentProfile() {
  const { user } = useAuth()
  const { db, updateStudent } = useData()
  const [tab, setTab] = useState('Details')
  const [f, setF] = useState({ summary: user.summary, github: user.github, linkedin: user.linkedin, portfolio: user.portfolio, showContact: user.showContact })
  const [err, setErr] = useState(''); const [saved, setSaved] = useState(false)
  const certs = db.certificates.filter((c) => c.ownerId === user.id)
  const projects = db.projects.filter((p) => p.ownerId === user.id)
  const pct = completion(user, certs.length)

  const saveDetails = () => {
    for (const k of ['github', 'linkedin', 'portfolio']) if (f[k] && !isUrl(f[k])) return setErr(`${k} must be a valid http(s) link.`)
    setErr(''); updateStudent(user.id, f); setSaved(true); setTimeout(() => setSaved(false), 1500)
  }
  return (
    <div>
      <PageHeader title="My Profile" subtitle="Official identity fields are locked; everything else is editable.">
        <Link to={`/profile/${user.id}`} className="btn btn-outline">View as others see it</Link>
      </PageHeader>
      <div className="card mb-4 flex flex-wrap items-center gap-4"><Avatar name={user.name} size={64} /><div className="flex-1"><h2 className="text-xl font-black">{user.name}</h2><p className="text-sm text-ink/60">{user.id} - {user.course} - {user.year}</p></div>
        <div className="w-48"><p className="text-xs font-bold">Profile completion: {pct}%</p><div className="mt-1 h-2 rounded-full bg-mist"><div className="h-2 rounded-full bg-brand" style={{ width: `${pct}%` }} /></div></div></div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} />
      <div className="card space-y-4">
        {tab === 'Details' && (<>
          <div className="grid gap-3 md:grid-cols-3">{[['Official name', user.name], ['User ID', user.id], ['Email', user.email], ['Department', user.dept], ['Course', user.course], ['Year', user.year]].map(([l, v]) => <div key={l}><p className="label">{l} (locked)</p><p className="rounded-xl bg-mist px-3 py-2 text-sm">{v}</p></div>)}</div>
          <Field label="Professional summary"><textarea className="input" rows={3} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} /></Field>
          <div className="grid gap-3 md:grid-cols-3">{['github', 'linkedin', 'portfolio'].map((k) => <Field key={k} label={`${k} link`}><input className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder="https://" /></Field>)}</div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.showContact} onChange={(e) => setF({ ...f, showContact: e.target.checked })} /> Show my email on my profile (off by default)</label>
          {err && <p className="text-xs font-semibold text-red-600">{err}</p>}{saved && <Notice tone="ok">Profile saved.</Notice>}
          <button className="btn btn-primary" onClick={saveDetails}>Save details</button></>)}
        {tab === 'Skills' && (<><Field label="Technical skills"><TagInput value={user.skills} onChange={(v) => updateStudent(user.id, { skills: v })} placeholder="Add a skill" /></Field><Field label="Soft skills"><TagInput value={user.softSkills} onChange={(v) => updateStudent(user.id, { softSkills: v })} placeholder="Add a soft skill" /></Field></>)}
        {tab === 'Experience' && SECTIONS.map(([k, l]) => <Field key={k} label={l}><ListEditor value={user.sections[k]} onChange={(v) => updateStudent(user.id, { sections: { ...user.sections, [k]: v } })} placeholder={`Add to ${l.toLowerCase()}`} /></Field>)}
        {tab === 'Achievements' && (certs.filter((c) => c.status === 'Approved').length ? certs.filter((c) => c.status === 'Approved').map((c) => <div key={c.id} className="flex items-center justify-between border-b py-2 text-sm"><span>{c.title}</span><span className="flex gap-1"><Badge>{c.visibility}</Badge>{c.confidential && <Badge tone="Confidential">Confidential</Badge>}</span></div>) : <Empty text="No verified achievements yet." />)}
        {tab === 'Projects' && (projects.length ? projects.map((p) => <div key={p.id} className="flex items-center justify-between border-b py-2 text-sm"><span>{p.title}</span><Badge tone={p.published ? 'Active' : 'Private'}>{p.published ? 'Published' : 'Private'}</Badge></div>) : <Empty text="No portfolio projects yet. Add them from My Projects." />)}
        {tab === 'Certificates' && (certs.length ? certs.map((c) => <div key={c.id} className="flex items-center justify-between border-b py-2 text-sm"><span>{c.title}</span><Badge>{c.status}</Badge></div>) : <Empty text="No certificates yet." />)}
      </div>
    </div>
  )
}
