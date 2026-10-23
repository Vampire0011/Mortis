// ===== Editable app configuration (labels, statuses, categories, navigation) =====
export const APP_NAME = 'CampusRecords'

export const ROLES = { STUDENT: 'student', FACULTY: 'faculty', ADMIN: 'admin' }

export const CERT_STATUS = {
  DRAFT: 'Draft',
  SELF: 'Self-Reported',
  PENDING: 'Pending Verification',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CHANGES: 'Changes Required',
}

export const ASSIGN_STATUS = {
  ASSIGNED: 'Assigned',
  NOT_SUBMITTED: 'Not Submitted',
  SUBMITTED: 'Submitted',
  REVIEW: 'Under Review',
  CHANGES: 'Changes Required',
  RESUBMITTED: 'Resubmitted',
  APPROVED: 'Approved',
  OVERDUE: 'Overdue',
}

export const SIGN_STATUS = {
  REQUESTED: 'Requested',
  REVIEW: 'Under Review',
  CHANGES: 'Changes Required',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SIGNED: 'Signed',
}

export const VISIBILITY = {
  PRIVATE: 'Private',
  UNIVERSITY: 'University Only',
  PUBLIC: 'Public Portfolio',
  CAMPUS: 'Campus Network',
}
export const VISIBILITY_HELP = {
  [VISIBILITY.PRIVATE]: 'Only you and authorised reviewers.',
  [VISIBILITY.UNIVERSITY]: 'Permitted users inside the institution.',
  [VISIBILITY.PUBLIC]: 'Eligible for the public-facing portfolio.',
  [VISIBILITY.CAMPUS]: 'Eligible for the campus achievement feed.',
}

export const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Social Service', 'Internship', 'Workshop', 'Seminar', 'Competition', 'Research', 'Certification', 'Other']
export const FLAIRS = ['Achievement', 'Hackathon', 'Internship', 'Academic', 'Leadership', 'Research', 'Volunteering', 'Technical Skills', 'Competition Winner']
export const COURSES = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech ME', 'B.Tech CE', 'B.Tech IT']
export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export const ALLOWED_CERT_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp']
export const MAX_FILE_MB = 5
export const MAX_PERSIST_BYTES = 300 * 1024 // image previews above this stay in memory only

// ===== Navigation per role (edit here to change the sidebar) =====
export const NAV = {
  student: [
    { to: '/student', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
    { to: '/student/profile', label: 'My Profile', icon: 'User' },
    { to: '/student/certificates', label: 'My Certificates', icon: 'Award' },
    { to: '/student/upload', label: 'Upload Certificate', icon: 'Upload' },
    { to: '/student/assignments', label: 'My Assignments', icon: 'ClipboardList' },
    { to: '/student/projects', label: 'My Projects', icon: 'FolderGit2' },
    { to: '/student/resume', label: 'My Resume', icon: 'FileText' },
    { to: '/network', label: 'Achievement Network', icon: 'Users' },
    { to: '/notifications', label: 'Notifications', icon: 'Bell', badge: 'unread' },
    { to: '/signatures', label: 'E-Signature Requests', icon: 'PenLine' },
    { to: '/reports', label: 'Reports', icon: 'BarChart3' },
    { to: '/settings', label: 'Settings', icon: 'Settings' },
  ],
  faculty: [
    { to: '/faculty', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
    { to: '/faculty/review', label: 'Certificate Review', icon: 'ShieldCheck' },
    { to: '/faculty/assignments', label: 'Assignments & Projects', icon: 'ClipboardList' },
    { to: '/signatures', label: 'Signature Requests', icon: 'PenLine' },
    { to: '/network', label: 'Achievement Network', icon: 'Users' },
    { to: '/notifications', label: 'Notifications', icon: 'Bell', badge: 'unread' },
    { to: '/reports', label: 'Reports', icon: 'BarChart3' },
    { to: '/settings', label: 'Settings', icon: 'Settings' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: 'LayoutDashboard', end: true },
    { to: '/admin/accounts', label: 'Accounts', icon: 'Users' },
    { to: '/admin/departments', label: 'Departments', icon: 'Building2' },
    { to: '/notifications', label: 'Notifications', icon: 'Bell', badge: 'unread' },
    { to: '/reports', label: 'Reports', icon: 'BarChart3' },
    { to: '/settings', label: 'Settings', icon: 'Settings' },
  ],
}
export const HOME = { student: '/student', faculty: '/faculty', admin: '/admin' }
