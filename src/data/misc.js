export const notifications = [
  { id: 'N001', userId: 'STU001', type: 'Certificate', title: 'Certificate approved', message: 'AWS Cloud Practitioner was approved. You can now publish it.', createdAt: '2025-08-22T10:00:00', read: false, link: '/student/certificates' },
  { id: 'N002', userId: 'STU001', type: 'Certificate', title: 'Certificate rejected', message: 'Internship Offer - Unknown Source was rejected.', createdAt: '2025-06-12T10:00:00', read: true, link: '/student/certificates' },
  { id: 'N003', userId: 'STU001', type: 'Assignment', title: 'Faculty feedback added', message: 'Changes requested on Operating Systems Lab Report.', createdAt: '2026-09-30T09:00:00', read: false, link: '/student/assignments' },
  { id: 'N004', userId: 'STU001', type: 'Assignment', title: 'New project assigned', message: 'Student Portal Mini Project was assigned. Deadline: 2026-12-15.', createdAt: '2026-09-20T09:00:00', read: true, link: '/student/assignments' },
  { id: 'N005', userId: 'FAC001', type: 'Certificate', title: 'Certificate awaiting review', message: 'Aarav Sharma submitted Smart India Hackathon Finalist.', createdAt: '2026-01-10T09:00:00', read: false, link: '/faculty/review' },
]
export const signatures = [
  { id: 'R001', studentId: 'STU001', facultyId: 'FAC001', title: 'Internship NOC Letter', purpose: 'Need approval to attend a summer internship.', docRef: 'Other', file: { name: 'noc-request.pdf', size: 40000 }, status: 'Under Review', createdAt: '2026-10-05', remarks: [{ by: 'FAC001', text: 'Reviewing with the department head.', at: '2026-10-06' }] },
]
export const comments = [
  { id: 'M001', certId: 'C007', userId: 'STU001', text: 'Congrats Diya! Great achievement.', at: '2025-09-27T10:00:00' },
]
export const follows = { STU001: ['STU002'], STU002: ['STU001', 'STU003'] }
export const likes = { C007: ['STU001'], C009: ['STU002'] }
export const bookmarks = {}
