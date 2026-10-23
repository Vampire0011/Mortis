import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { PageHeader, Notice } from '../../components/common/Ui.jsx'
import { APP_NAME } from '../../config/constants.js'

export default function Settings() {
  const { user, role, logout } = useAuth()
  const { resetDemo } = useData()
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-1 text-sm"><h2 className="mb-2 font-display text-lg uppercase">Account</h2><p><b>Name:</b> {user.name}</p><p><b>ID:</b> {user.id}</p><p><b>Role:</b> <span className="capitalize">{role}</span></p><p><b>Email:</b> {user.email}</p>
          <button className="btn btn-outline mt-3" onClick={logout}>Logout</button></div>
        <div className="card space-y-3 text-sm"><h2 className="font-display text-lg uppercase">Demo data</h2>
          <p>{APP_NAME} stores demo data in this browser (localStorage). Clear it to restore the original sample data.</p>
          <button className="btn btn-danger" onClick={() => { if (confirm('Reset all demo data and log out?')) { resetDemo(); logout() } }}>Reset demo data</button></div>
      </div>
      <div className="mt-4 space-y-2"><Notice tone="warn">Frontend-only demo: login, privacy and confidentiality are simulated in the browser. Real confidentiality needs server-side permissions and protected file access. E-signatures here are workflow simulation only and are not legally valid.</Notice></div>
    </div>
  )
}
