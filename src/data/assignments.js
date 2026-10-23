export const assignments = [
  { id: 'A001', type: 'Project', title: 'Student Portal Mini Project', description: 'Build a small full-stack style portal (frontend focus).', instructions: 'Upload a zip or share a GitHub link. Include a README.', facultyId: 'FAC001', deptId: 'CSE', classId: 'CSE-3A', assignedTo: ['STU001', 'STU002'], deadline: '2026-12-15', formats: ['zip', 'pdf', 'link'], confidential: false, createdAt: '2026-09-20' },
  { id: 'A002', type: 'Assignment', title: 'DBMS Normalization Worksheet', description: 'Solve normalization problems 1-10.', instructions: 'Submit a PDF.', facultyId: 'FAC001', deptId: 'CSE', classId: 'CSE-3A', assignedTo: ['STU001', 'STU002'], deadline: '2026-10-20', formats: ['pdf'], confidential: true, createdAt: '2026-10-01' },
  { id: 'A003', type: 'Assignment', title: 'Operating Systems Lab Report', description: 'Report on process scheduling experiments.', instructions: 'Submit a PDF.', facultyId: 'FAC001', deptId: 'CSE', classId: 'CSE-3A', assignedTo: ['STU001', 'STU002'], deadline: '2026-09-30', formats: ['pdf', 'docx'], confidential: true, createdAt: '2026-09-10' },
]
export const submissions = [
  { id: 'S001', assignmentId: 'A003', studentId: 'STU001', file: { name: 'os-lab.pdf', size: 80000 }, link: '', note: 'Submitted on time.', status: 'Changes Required', submittedAt: '2026-09-28', feedback: 'Add the Gantt chart for Round Robin.', history: [] },
  { id: 'S002', assignmentId: 'A003', studentId: 'STU002', file: { name: 'diya-os.pdf', size: 90000 }, link: '', note: '', status: 'Approved', submittedAt: '2026-09-29', feedback: 'Good work.', history: [] },
]
export const projects = [] // portfolio entries are created by students from approved projects
