const colors = {
  Approved: 'bg-emerald-100 text-emerald-700', Signed: 'bg-emerald-100 text-emerald-700', Active: 'bg-emerald-100 text-emerald-700', Verified: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700', Overdue: 'bg-red-100 text-red-700', Suspended: 'bg-red-100 text-red-700', Confidential: 'bg-red-600 text-white',
  'Pending Verification': 'bg-amber-100 text-amber-700', 'Under Review': 'bg-amber-100 text-amber-700', Requested: 'bg-amber-100 text-amber-700', Submitted: 'bg-blue-100 text-blue-700', Resubmitted: 'bg-blue-100 text-blue-700',
  'Changes Required': 'bg-orange-100 text-orange-700', 'Self-Reported': 'bg-slate-200 text-slate-700', Draft: 'bg-slate-100 text-slate-500',
  Assigned: 'bg-blue-100 text-blue-700', 'Not Submitted': 'bg-slate-200 text-slate-700',
  Private: 'bg-slate-800 text-white', 'University Only': 'bg-indigo-100 text-indigo-700', 'Public Portfolio': 'bg-lime text-black', 'Campus Network': 'bg-brand text-white',
}
export default function Badge({ children, tone }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold ${colors[tone || children] || 'bg-slate-100 text-slate-700'}`}>{children}</span>
}
