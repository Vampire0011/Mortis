import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, StatCard, Empty } from '../../components/common/Ui.jsx'
import { CERT_STATUS, ASSIGN_STATUS, SIGN_STATUS } from '../../config/constants.js'
import { statusFor } from '../../utils/assignments.js'
import { fmtDate } from '../../utils/validation.js'

export default function StudentDashboard() {
  const { user } = useAuth()
  const { db } = useData()
  const certs = db.certificates.filter((c) => c.ownerId === user.id)
  const my = db.assignments.filter((a) => a.assignedTo.includes(user.id))
  const subOf = (a) => db.submissions.find((s) => s.assignmentId === a.id && s.studentId === user.id)
  const awaiting = my.filter((a) => [ASSIGN_STATUS.NOT_SUBMITTED, ASSIGN_STATUS.OVERDUE, ASSIGN_STATUS.CHANGES].includes(statusFor(a, subOf(a)))).length
  const projectsSubmitted = my.filter((a) => a.type === 'Project' && subOf(a)).length
  const pendingApprovals = db.signatures.filter((r) => r.studentId === user.id && [SIGN_STATUS.REQUESTED, SIGN_STATUS.REVIEW].includes(r.status)).length
  const sigAction = db.signatures.filter((r) => r.studentId === user.id && r.status === SIGN_STATUS.CHANGES).length
  const cnt = (s) => certs.filter((c) => c.status === s).length
  const recent = db.notifications.filter((n) => n.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6)

  return (
    <div>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Your academic and professional activity overview.">
        <Link to="/student/upload" className="btn btn-primary">Upload certificate</Link>
      </PageHeader>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total certificates" value={certs.length} tone="blue" />
        <StatCard label="Verified" value={cnt(CERT_STATUS.APPROVED)} tone="lime" />
        <StatCard label="Pending verification" value={cnt(CERT_STATUS.PENDING)} />
        <StatCard label="Rejected" value={cnt(CERT_STATUS.REJECTED)} />
        <StatCard label="Assignments awaiting submission" value={awaiting} />
        <StatCard label="Projects submitted" value={projectsSubmitted} />
        <StatCard label="Pending faculty approvals" value={pendingApprovals} />
        <StatCard label="Signature requests needing action" value={sigAction} />
      </div>
      <div className="card mt-6">
        <h2 className="mb-3 font-display text-lg uppercase">Recent activity</h2>
        {recent.length === 0 ? <Empty text="No activity yet." /> : (
          <ul className="divide-y">{recent.map((n) => <li key={n.id} className="py-2 text-sm"><Link to={n.link || '/notifications'} className="font-semibold hover:text-brand">{n.title}</Link><span className="text-ink/60"> - {n.message}</span><span className="ml-2 text-xs text-ink/40">{fmtDate(n.createdAt)}</span></li>)}</ul>
        )}
      </div>
    </div>
  )
}
