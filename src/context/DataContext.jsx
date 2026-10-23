import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { load, save, remove } from '../utils/storage.js'
import { demoAccounts } from '../data/demoAccounts.js'
import { students } from '../data/students.js'
import { faculty, admins } from '../data/faculty.js'
import { departments } from '../data/departments.js'
import { certificates } from '../data/certificates.js'
import { assignments, submissions, projects } from '../data/assignments.js'
import { notifications, signatures, comments, follows, likes, bookmarks } from '../data/misc.js'
import { CERT_STATUS, ASSIGN_STATUS, SIGN_STATUS, MAX_PERSIST_BYTES } from '../config/constants.js'
import { canPublish } from '../utils/permissions.js'
import { today } from '../utils/validation.js'

const KEY = 'hei_demo_db_v1'
const seed = () => ({ accounts: demoAccounts, students, faculty, admins, departments, certificates, assignments, submissions, projects, notifications, signatures, comments, follows, likes, bookmarks })
const Ctx = createContext(null)
export const useData = () => useContext(Ctx)
let counter = 0
const uid = (p) => `${p}${Date.now().toString(36)}${(counter++).toString(36)}`

export function DataProvider({ children }) {
  const [db, setDb] = useState(() => load(KEY, null) || seed())
  // Persist after every change. Large files are never stored (see sanitize below).
  useEffect(() => { save(KEY, db) }, [db])

  const mutate = useCallback((fn) => setDb((prev) => { const next = structuredClone(prev); fn(next); return next }), [])
  const notify = (d, userId, type, title, message, link) =>
    d.notifications.unshift({ id: uid('N'), userId, type, title, message, link, createdAt: new Date().toISOString(), read: false })
  const nameOf = (d, id) => [...d.students, ...d.faculty, ...d.admins].find((x) => x.id === id)?.name || id

  const actions = useMemo(() => ({
    uid,
    // ---------- certificates ----------
    addCertificate: (cert) => mutate((d) => { d.certificates.unshift(cert) }),
    updateCertificate: (id, patch) => mutate((d) => { Object.assign(d.certificates.find((c) => c.id === id), patch) }),
    deleteCertificate: (id) => mutate((d) => { d.certificates = d.certificates.filter((c) => c.id !== id) }),
    submitForVerification: (id, extra = {}) => mutate((d) => {
      const c = d.certificates.find((x) => x.id === id)
      Object.assign(c, extra, { status: CERT_STATUS.PENDING, submittedAt: today() })
      c.history.push({ at: new Date().toISOString(), text: 'Submitted for verification' })
      const owner = d.students.find((s) => s.id === c.ownerId)
      d.faculty.filter((f) => f.dept === owner?.dept).forEach((f) => notify(d, f.id, 'Certificate', 'Certificate awaiting review', `${owner.name} submitted ${c.title}.`, '/faculty/review'))
      notify(d, c.ownerId, 'Certificate', 'Submitted for verification', `${c.title} is now in the faculty review queue.`, '/student/certificates')
    }),
    reviewCertificate: (id, { decision, comment, confidential, reason, shareEligible, reviewerId }) => mutate((d) => {
      const c = d.certificates.find((x) => x.id === id)
      const status = decision === 'approve' ? CERT_STATUS.APPROVED : decision === 'reject' ? CERT_STATUS.REJECTED : CERT_STATUS.CHANGES
      Object.assign(c, { status, reviewerId, reviewComment: comment, reviewedAt: today(), confidential, confidentialReason: confidential ? reason : '', shareEligible })
      if (confidential || !shareEligible || status !== CERT_STATUS.APPROVED) { c.published = false }
      if (confidential) c.visibility = 'Private' // confidentiality beats the student's request
      c.history.push({ at: new Date().toISOString(), text: `${status} by ${nameOf(d, reviewerId)}` })
      const msgs = { Approved: 'was approved. You can now choose to publish it.', Rejected: 'was rejected.', 'Changes Required': 'needs changes or more evidence.' }
      notify(d, c.ownerId, 'Certificate', `Certificate ${status.toLowerCase()}`, `${c.title} ${msgs[status]}${comment ? ' Comment: ' + comment : ''}`, '/student/certificates')
    }),
    setPublished: (id, value) => mutate((d) => {
      const c = d.certificates.find((x) => x.id === id)
      if (value && !canPublish(c)) return // rules enforced again here, not just in the UI
      c.published = value
    }),
    setVisibility: (id, vis) => mutate((d) => {
      const c = d.certificates.find((x) => x.id === id)
      if (c.confidential) return // student cannot override faculty confidentiality
      c.visibility = vis
      if (vis === 'Private') c.published = false
    }),
    // ---------- assignments ----------
    addAssignment: (a) => mutate((d) => {
      d.assignments.unshift(a)
      a.assignedTo.forEach((sid) => notify(d, sid, 'Assignment', `New ${a.type.toLowerCase()} assigned`, `${a.title} - deadline ${a.deadline}.`, '/student/assignments'))
    }),
    submitWork: (sub) => mutate((d) => {
      const prev = d.submissions.find((s) => s.assignmentId === sub.assignmentId && s.studentId === sub.studentId)
      const a = d.assignments.find((x) => x.id === sub.assignmentId)
      if (prev) { Object.assign(prev, sub, { status: ASSIGN_STATUS.RESUBMITTED, submittedAt: today() }) }
      else d.submissions.push({ ...sub, id: uid('S'), status: ASSIGN_STATUS.SUBMITTED, submittedAt: today(), feedback: '', history: [] })
      notify(d, a.facultyId, 'Assignment', 'Work submitted', `${nameOf(d, sub.studentId)} submitted ${a.title}.`, '/faculty/assignments')
    }),
    reviewSubmission: (id, status, feedback) => mutate((d) => {
      const s = d.submissions.find((x) => x.id === id)
      const a = d.assignments.find((x) => x.id === s.assignmentId)
      Object.assign(s, { status, feedback })
      notify(d, s.studentId, 'Assignment', status === ASSIGN_STATUS.APPROVED && a.type === 'Project' ? 'Project approved' : 'Faculty feedback added', `${a.title}: ${status}. ${feedback || ''}`, a.type === 'Project' ? '/student/projects' : '/student/assignments')
    }),
    addProject: (p) => mutate((d) => { d.projects.unshift(p) }),
    updateProject: (id, patch) => mutate((d) => { Object.assign(d.projects.find((p) => p.id === id), patch) }),
    // ---------- signatures ----------
    addSignature: (r) => mutate((d) => {
      d.signatures.unshift(r)
      notify(d, r.facultyId, 'Signature', 'New signature request', `${nameOf(d, r.studentId)} requested approval: ${r.title}.`, '/signatures')
    }),
    updateSignature: (id, status, text, byId) => mutate((d) => {
      const r = d.signatures.find((x) => x.id === id)
      r.status = status
      if (text) r.remarks.push({ by: byId, text, at: today() })
      notify(d, r.studentId, 'Signature', 'Signature request updated', `${r.title} is now: ${status}.`, '/signatures')
    }),
    // ---------- notifications ----------
    markRead: (id) => mutate((d) => { const n = d.notifications.find((x) => x.id === id); if (n) n.read = true }),
    markAllRead: (userId) => mutate((d) => { d.notifications.forEach((n) => { if (n.userId === userId) n.read = true }) }),
    addNotification: (userId, type, title, message, link) => mutate((d) => notify(d, userId, type, title, message, link)),
    // ---------- network ----------
    toggleFollow: (me, other) => mutate((d) => { const l = d.follows[me] || (d.follows[me] = []); const i = l.indexOf(other); i >= 0 ? l.splice(i, 1) : l.push(other) }),
    toggleLike: (me, certId) => mutate((d) => { const l = d.likes[certId] || (d.likes[certId] = []); const i = l.indexOf(me); i >= 0 ? l.splice(i, 1) : l.push(me) }),
    toggleBookmark: (me, certId) => mutate((d) => { const l = d.bookmarks[me] || (d.bookmarks[me] = []); const i = l.indexOf(certId); i >= 0 ? l.splice(i, 1) : l.push(certId) }),
    addComment: (certId, userId, text) => mutate((d) => { d.comments.push({ id: uid('M'), certId, userId, text, at: new Date().toISOString() }) }),
    // ---------- profile / accounts ----------
    updateStudent: (id, patch) => mutate((d) => { Object.assign(d.students.find((s) => s.id === id), patch) }),
    register: (profile, password) => mutate((d) => {
      d.students.push(profile)
      d.accounts.push({ userId: profile.id, password, role: 'student', status: 'Active' })
    }),
    setAccountStatus: (userId, status) => mutate((d) => {
      const a = d.accounts.find((x) => x.userId === userId); if (a) a.status = status
      const p = [...d.students, ...d.faculty].find((x) => x.id === userId); if (p) p.status = status
    }),
    addDepartment: (dept) => mutate((d) => { d.departments.push(dept) }),
    removeDepartment: (id) => mutate((d) => { d.departments = d.departments.filter((x) => x.id !== id) }),
    renameDepartment: (id, name) => mutate((d) => { d.departments.find((x) => x.id === id).name = name }),
    addClass: (id, cls) => mutate((d) => { const x = d.departments.find((z) => z.id === id); if (!x.classes.includes(cls)) x.classes.push(cls) }),
    resetDemo: () => { remove(KEY); setDb(seed()) },
  }), [mutate])

  return <Ctx.Provider value={{ db, ...actions }}>{children}</Ctx.Provider>
}

// Keep persisted size small: images above the limit are kept in memory only.
export const canPersistFile = (size) => size <= MAX_PERSIST_BYTES
export { SIGN_STATUS }
