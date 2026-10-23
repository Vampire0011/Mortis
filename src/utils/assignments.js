import { ASSIGN_STATUS } from '../config/constants.js'
// Status a student sees for an assignment (derived from the submission + deadline)
export function statusFor(a, sub) {
  if (sub) return sub.status
  return new Date(a.deadline + 'T23:59:59') < new Date() ? ASSIGN_STATUS.OVERDUE : ASSIGN_STATUS.NOT_SUBMITTED
}
