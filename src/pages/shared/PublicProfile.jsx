import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Avatar, Empty } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import { isVisibleToOthers } from '../../utils/permissions.js'
import { fmtDate } from '../../utils/validation.js'

// What OTHER users see. Private, pending, rejected and confidential records are never listed here.
export default function PublicProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const { db, toggleFollow } = useData()
  const navigate = useNavigate()
  const s = db.students.find((x) => x.id === id)
  if (!s) return <div><PageHeader title="Profile not found" /><button className="btn btn-outline" onClick={() => navigate(-1)}>Go back</button></div>
  const certs = db.certificates.filter((c) => c.ownerId === id && isVisibleToOthers(c))
  const projects = db.projects.filter((p) => p.ownerId === id && p.published)
  const following = (db.follows[user.id] || []).includes(id)
  const isStudent = db.students.some((x) => x.id === user.id)
  const sec = [['education', 'Education'], ['internships', 'Internships'], ['workshops', 'Workshops & seminars'], ['competitions', 'Competitions'], ['volunteer', 'Volunteer work']]
  return (
    <div>
      <PageHeader title={s.name} subtitle={`${s.id} - ${s.course} - ${s.year} - ${s.dept}`}>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Back</button>
        {isStudent && user.id !== id && <button className={`btn ${following ? 'btn-outline' : 'btn-primary'}`} onClick={() => toggleFollow(user.id, id)}>{following ? 'Unfollow' : 'Follow'}</button>}
      </PageHeader>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card space-y-3 text-sm"><Avatar name={s.name} size={72} /><p>{s.summary || 'No summary added.'}</p>
          {s.showContact && <p><b>Email:</b> {s.email}</p>}
          <div className="flex flex-wrap gap-2">{[['GitHub', s.github], ['LinkedIn', s.linkedin], ['Portfolio', s.portfolio]].filter(([, v]) => v).map(([l, v]) => <a key={l} href={v} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">{l}</a>)}</div>
          <div><p className="label">Skills</p><div className="flex flex-wrap gap-1">{[...s.skills, ...s.softSkills].map((k) => <span key={k} className="rounded-full bg-mist px-2 py-0.5 text-xs">{k}</span>)}</div></div>
          {s.resume && s.resumeVisibility !== 'Private' && <p className="text-xs text-ink/60">Resume available to the university ({s.resume.name}).</p>}</div>
        <div className="space-y-4 lg:col-span-2">
          <div className="card"><h2 className="mb-2 font-display text-lg uppercase">Published achievements</h2>
            {certs.length === 0 ? <Empty text="No published achievements." /> : certs.map((c) => <div key={c.id} className="flex items-start justify-between border-b py-2 text-sm"><div><p className="font-semibold">{c.title}</p><p className="text-xs text-ink/50">{c.issuer} - {fmtDate(c.issueDate)}</p></div><Badge tone={c.status === 'Approved' ? 'Verified' : 'Self-Reported'}>{c.status === 'Approved' ? 'Verified' : 'Self-reported'}</Badge></div>)}</div>
          <div className="card"><h2 className="mb-2 font-display text-lg uppercase">Projects</h2>
            {projects.length === 0 ? <Empty text="No published projects." /> : projects.map((p) => <div key={p.id} className="border-b py-2 text-sm"><p className="font-semibold">{p.title}</p><p>{p.description}</p><p className="text-xs text-ink/50">{p.tech.join(', ')}</p></div>)}</div>
          <div className="card text-sm"><h2 className="mb-2 font-display text-lg uppercase">Background</h2>{sec.map(([k, l]) => s.sections[k]?.length > 0 && <p key={k}><b>{l}:</b> {s.sections[k].join('; ')}</p>)}</div>
        </div>
      </div>
      <p className="mt-4 text-xs text-ink/40">Private, pending, rejected and confidential records are never shown on this page. <Link className="underline" to="/network">Back to network</Link></p>
    </div>
  )
}
