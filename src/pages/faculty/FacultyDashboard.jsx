import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, StatCard, Empty } from '../../components/common/Ui.jsx'
import { CERT_STATUS, ASSIGN_STATUS, SIGN_STATUS } from '../../config/constants.js'
import { fmtDate } from '../../utils/validation.js'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const { db } = useData()
  const pending = db.certificates.filter((c) => c.status === CERT_STATUS.PENDING)
  const mine = db.certificates.filter((c) => c.reviewerId === user.id)
  const myAssign = db.assignments.filter((a) => a.facultyId === user.id)
  const toReview = db.submissions.filter((s) => myAssign.some((a) => a.id === s.assignmentId) && [ASSIGN_STATUS.SUBMITTED, ASSIGN_STATUS.RESUBMITTED, ASSIGN_STATUS.REVIEW].includes(s.status))
  const sigs = db.signatures.filter((r) => r.facultyId === user.id && [SIGN_STATUS.REQUESTED, SIGN_STATUS.REVIEW].includes(r.status))
  const recent = db.notifications.filter((n) => n.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  return (
    <div>
      <PageHeader title={`Hello, ${user.name}`} subtitle={`${user.designation} - ${user.dept}`}><Link className="btn btn-primary" to="/faculty/review">Open review queue</Link></PageHeader>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Certificates awaiting review" value={pending.length} tone="blue" />
        <StatCard label="Approved by me" value={mine.filter((c) => c.status === CERT_STATUS.APPROVED).length} tone="lime" />
        <StatCard label="Rejected / changes by me" value={mine.filter((c) => [CERT_STATUS.REJECTED, CERT_STATUS.CHANGES].includes(c.status)).length} />
        <StatCard label="Assignments created" value={myAssign.length} />
        <StatCard label="Submissions to review" value={toReview.length} />
        <StatCard label="Signature requests pending" value={sigs.length} />
      </div>
      <div className="card mt-6"><h2 className="mb-3 font-display text-lg uppercase">Recent activity</h2>
        {recent.length === 0 ? <Empty text="No recent activity." /> : <ul className="divide-y">{recent.map((n) => <li key={n.id} className="py-2 text-sm"><Link className="font-semibold hover:text-brand" to={n.link || '/notifications'}>{n.title}</Link> <span className="text-ink/60">- {n.message}</span> <span className="text-xs text-ink/40">{fmtDate(n.createdAt)}</span></li>)}</ul>}</div>
    </div>
  )
}
