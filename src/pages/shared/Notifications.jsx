import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Empty } from '../../components/common/Ui.jsx'
import { fmtDate } from '../../utils/validation.js'

export default function Notifications() {
  const { user, role } = useAuth()
  const { db, markRead, markAllRead, addNotification } = useData()
  const navigate = useNavigate()
  const list = db.notifications.filter((n) => n.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const unread = list.filter((n) => !n.read).length
  const open = (n) => { markRead(n.id); if (n.link) navigate(n.link) }
  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${unread} unread - in-app demo notifications only (no emails or push).`}>
        {role === 'student' && <button className="btn btn-outline" onClick={() => addNotification(user.id, 'Assignment', 'Deadline approaching', 'Demo reminder: an assignment deadline is near.', '/student/assignments')}>Simulate deadline reminder</button>}
        <button className="btn btn-primary" disabled={!unread} onClick={() => markAllRead(user.id)}>Mark all as read</button>
      </PageHeader>
      {list.length === 0 ? <Empty text="You're all caught up - no notifications yet." /> : (
        <div className="space-y-2">{list.map((n) => (
          <div key={n.id} className={`card flex items-start gap-3 ${n.read ? 'opacity-70' : 'border-l-4 border-l-brand'}`}>
            <div className="flex-1"><p className="text-xs font-bold uppercase text-brand">{n.type}</p><p className="font-bold">{n.title}</p><p className="text-sm text-ink/70">{n.message}</p><p className="text-xs text-ink/40">{fmtDate(n.createdAt)}</p></div>
            <div className="flex flex-col gap-1">{n.link && <button className="btn btn-primary btn-sm" onClick={() => open(n)}>Open</button>}{!n.read && <button className="btn btn-outline btn-sm" onClick={() => markRead(n.id)}>Mark read</button>}</div>
          </div>))}</div>
      )}
    </div>
  )
}
