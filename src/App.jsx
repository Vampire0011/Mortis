import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { HOME } from './config/constants.js'
import Layout from './components/common/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import StudentProfile from './pages/student/StudentProfile.jsx'
import CertificateList from './pages/student/CertificateList.jsx'
import CertificateUpload from './pages/student/CertificateUpload.jsx'
import StudentAssignments from './pages/student/StudentAssignments.jsx'
import StudentProjects from './pages/student/StudentProjects.jsx'
import ResumeManagement from './pages/student/ResumeManagement.jsx'
import FacultyDashboard from './pages/faculty/FacultyDashboard.jsx'
import CertificateReview from './pages/faculty/CertificateReview.jsx'
import FacultyAssignments from './pages/faculty/FacultyAssignments.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminAccounts from './pages/admin/AdminAccounts.jsx'
import AdminDepartments from './pages/admin/AdminDepartments.jsx'
import AchievementNetwork from './pages/shared/AchievementNetwork.jsx'
import PublicProfile from './pages/shared/PublicProfile.jsx'
import Notifications from './pages/shared/Notifications.jsx'
import SignatureRequests from './pages/shared/SignatureRequests.jsx'
import Reports from './pages/shared/Reports.jsx'
import Settings from './pages/shared/Settings.jsx'

// Route guard (demo only - real access control must happen on a server).
// Not logged in -> /login. Wrong role -> own dashboard.
function Guard({ roles, children }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  if (roles && !roles.includes(session.role)) return <Navigate to={HOME[session.role]} replace />
  return children
}

export default function App() {
  const { session } = useAuth()
  const all = <Guard><Layout /></Guard>
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={session ? <Navigate to={HOME[session.role]} replace /> : <Login />} />
      <Route path="/register" element={session ? <Navigate to={HOME[session.role]} replace /> : <Register />} />

      <Route element={all}>
        <Route path="/student" element={<Guard roles={['student']}><StudentDashboard /></Guard>} />
        <Route path="/student/profile" element={<Guard roles={['student']}><StudentProfile /></Guard>} />
        <Route path="/student/certificates" element={<Guard roles={['student']}><CertificateList /></Guard>} />
        <Route path="/student/upload" element={<Guard roles={['student']}><CertificateUpload /></Guard>} />
        <Route path="/student/assignments" element={<Guard roles={['student']}><StudentAssignments /></Guard>} />
        <Route path="/student/projects" element={<Guard roles={['student']}><StudentProjects /></Guard>} />
        <Route path="/student/resume" element={<Guard roles={['student']}><ResumeManagement /></Guard>} />

        <Route path="/faculty" element={<Guard roles={['faculty']}><FacultyDashboard /></Guard>} />
        <Route path="/faculty/review" element={<Guard roles={['faculty']}><CertificateReview /></Guard>} />
        <Route path="/faculty/assignments" element={<Guard roles={['faculty']}><FacultyAssignments /></Guard>} />

        <Route path="/admin" element={<Guard roles={['admin']}><AdminDashboard /></Guard>} />
        <Route path="/admin/accounts" element={<Guard roles={['admin']}><AdminAccounts /></Guard>} />
        <Route path="/admin/departments" element={<Guard roles={['admin']}><AdminDepartments /></Guard>} />

        <Route path="/network" element={<Guard roles={['student', 'faculty']}><AchievementNetwork /></Guard>} />
        <Route path="/profile/:id" element={<Guard roles={['student', 'faculty', 'admin']}><PublicProfile /></Guard>} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/signatures" element={<Guard roles={['student', 'faculty']}><SignatureRequests /></Guard>} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
