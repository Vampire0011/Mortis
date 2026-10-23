import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Select, SearchBox, Empty, Tabs, Avatar } from '../../components/common/Ui.jsx'
import Badge from '../../components/common/Badge.jsx'
import Icon from '../../components/common/Icon.jsx'
import { CATEGORIES, FLAIRS } from '../../config/constants.js'
import { inFeed } from '../../utils/permissions.js'
import { fmtDate } from '../../utils/validation.js'

function Post({ c, owner }) {
  const { user } = useAuth()
  const { db, toggleLike, toggleBookmark, addComment } = useData()
  const [show, setShow] = useState(false)
  const [text, setText] = useState('')
  const likes = db.likes[c.id] || []
  const comments = db.comments.filter((m) => m.certId === c.id)
  const liked = likes.includes(user.id), saved = (db.bookmarks[user.id] || []).includes(c.id)
  const send = () => { if (text.trim()) { addComment(c.id, user.id, text.trim()); setText('') } }
  return (
    <div className="card">
      <div className="mb-2 flex items-center gap-3"><Avatar name={owner.name} /><div className="flex-1"><Link to={`/profile/${owner.id}`} className="font-bold hover:text-brand">{owner.name}</Link><p className="text-xs text-ink/50">{owner.id} - {owner.dept} - {fmtDate(c.issueDate)}</p></div>
        <Badge tone={c.status === 'Approved' ? 'Verified' : 'Self-Reported'}>{c.status === 'Approved' ? 'Verified' : 'Self-reported (unverified)'}</Badge></div>
      <h3 className="font-bold">{c.title}</h3><p className="text-sm text-ink/70">{c.issuer} - {c.category}</p>
      {c.description && <p className="mt-1 text-sm">{c.description}</p>}
      <div className="mt-2 flex flex-wrap gap-1">{c.flairs.map((f) => <span key={f} className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold">{f}</span>)}{c.tags.map((t) => <span key={t} className="rounded-full bg-mist px-2 py-0.5 text-xs">#{t}</span>)}</div>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <button onClick={() => toggleLike(user.id, c.id)} className={`flex items-center gap-1 font-semibold ${liked ? 'text-red-600' : 'text-ink/60'}`} aria-pressed={liked}><Icon name="Heart" size={16} />{liked ? 'Unlike' : 'Like'} ({likes.length})</button>
        <button onClick={() => setShow(!show)} className="flex items-center gap-1 font-semibold text-ink/60"><Icon name="MessageCircle" size={16} />Comments ({comments.length})</button>
        <button onClick={() => toggleBookmark(user.id, c.id)} className={`flex items-center gap-1 font-semibold ${saved ? 'text-brand' : 'text-ink/60'}`}><Icon name="Bookmark" size={16} />{saved ? 'Saved' : 'Save'}</button>
      </div>
      {show && <div className="mt-3 space-y-2 border-t pt-3 text-sm">
        {comments.map((m) => <p key={m.id}><b>{[...db.students, ...db.faculty].find((p) => p.id === m.userId)?.name || m.userId}:</b> {m.text}</p>)}
        <div className="flex gap-2"><input className="input" value={text} placeholder="Write a comment" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} /><button className="btn btn-primary btn-sm" onClick={send}>Post</button></div></div>}
    </div>
  )
}

export default function AchievementNetwork() {
  const { user } = useAuth()
  const { db, toggleFollow } = useData()
  const [tab, setTab] = useState('Feed')
  const [f, setF] = useState({ q: '', dept: '', category: '', flair: '', skill: '', following: false })
  const set = (k) => (v) => setF({ ...f, [k]: v })
  const following = db.follows[user.id] || []
  const stu = (id) => db.students.find((s) => s.id === id)
  const q = f.q.toLowerCase()

  // Only eligible, published, non-confidential posts reach the feed (see utils/permissions.js)
  const posts = db.certificates.filter(inFeed).map((c) => ({ c, o: stu(c.ownerId) })).filter(({ o }) => o && o.status === 'Active')
    .filter(({ c, o }) => (!q || o.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)) && (!f.dept || o.dept === f.dept) && (!f.category || c.category === f.category) && (!f.flair || c.flairs.includes(f.flair)) && (!f.following || following.includes(o.id)))
    .sort((a, b) => b.c.issueDate.localeCompare(a.c.issueDate))
  const saved = db.bookmarks[user.id] || []
  const people = db.students.filter((s) => s.id !== user.id && s.status === 'Active').filter((s) => (!q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) && (!f.dept || s.dept === f.dept) && (!f.skill || s.skills.some((k) => k.toLowerCase().includes(f.skill.toLowerCase()))))

  return (
    <div>
      <PageHeader title="Achievement Network" subtitle="Only published, eligible, non-confidential achievements appear here." />
      <Tabs tabs={['Feed', 'People', 'Saved']} value={tab} onChange={setTab} />
      <div className="card mb-4 grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        <SearchBox value={f.q} onChange={set('q')} placeholder="Name, ID or title" />
        <Select value={f.dept} onChange={set('dept')} placeholder="All departments" options={db.departments.map((d) => d.id)} />
        {tab === 'People' ? <input className="input" placeholder="Skill" value={f.skill} onChange={(e) => set('skill')(e.target.value)} /> : <Select value={f.category} onChange={set('category')} placeholder="All categories" options={CATEGORIES} />}
        {tab !== 'People' && <Select value={f.flair} onChange={set('flair')} placeholder="All flairs" options={FLAIRS} />}
        {tab === 'Feed' && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.following} onChange={(e) => set('following')(e.target.checked)} /> Following only</label>}
      </div>
      {tab === 'Feed' && (posts.length === 0 ? <Empty text="No achievements match." /> : <div className="grid gap-4 lg:grid-cols-2">{posts.map(({ c, o }) => <Post key={c.id} c={c} owner={o} />)}</div>)}
      {tab === 'Saved' && (() => { const s = posts.filter(({ c }) => saved.includes(c.id)); return s.length === 0 ? <Empty text="No saved posts." /> : <div className="grid gap-4 lg:grid-cols-2">{s.map(({ c, o }) => <Post key={c.id} c={c} owner={o} />)}</div> })()}
      {tab === 'People' && (people.length === 0 ? <Empty text="No students match." /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{people.map((s) => { const on = following.includes(s.id); return (
          <div key={s.id} className="card"><div className="flex items-center gap-3"><Avatar name={s.name} size={48} /><div><Link to={`/profile/${s.id}`} className="font-bold hover:text-brand">{s.name}</Link><p className="text-xs text-ink/50">{s.id} - {s.dept} - {s.year}</p></div></div>
            <div className="mt-2 flex flex-wrap gap-1">{s.skills.slice(0, 4).map((k) => <span key={k} className="rounded-full bg-mist px-2 py-0.5 text-xs">{k}</span>)}</div>
            <button className={`btn btn-sm mt-3 ${on ? 'btn-outline' : 'btn-primary'}`} onClick={() => toggleFollow(user.id, s.id)}>{on ? 'Unfollow' : 'Follow'}</button></div>) })}</div>))}
    </div>
  )
}
