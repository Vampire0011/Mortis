import { CERT_STATUS, VISIBILITY } from '../config/constants.js'
// Privacy rules in ONE place. Frontend simulation only - real systems need server-side checks.
const SHAREABLE = [CERT_STATUS.APPROVED, CERT_STATUS.SELF]

// Can the owner publish this record at all?
export const canPublish = (c) => !c.confidential && c.shareEligible !== false && SHAREABLE.includes(c.status)
// Can OTHER users see it (profiles, etc.)? Confidential always wins over requested visibility.
export const isVisibleToOthers = (c) => c.published && canPublish(c) && c.visibility !== VISIBILITY.PRIVATE
export const inFeed = (c) => isVisibleToOthers(c) && c.visibility === VISIBILITY.CAMPUS
export const inPublicPortfolio = (c) => c.published && canPublish(c) && c.visibility === VISIBILITY.PUBLIC
export const isVerified = (c) => c.status === CERT_STATUS.APPROVED
export const canEditCert = (c) => [CERT_STATUS.DRAFT, CERT_STATUS.SELF, CERT_STATUS.CHANGES, CERT_STATUS.REJECTED].includes(c.status)
export const publishBlockReason = (c) => {
  if (c.confidential) return 'Marked confidential by faculty - cannot be published.'
  if (c.shareEligible === false) return 'Faculty marked this record as not eligible for sharing.'
  if (!SHAREABLE.includes(c.status)) return 'Only approved or self-reported records can be published.'
  if (c.visibility === VISIBILITY.PRIVATE) return 'Choose a non-private visibility to publish.'
  return ''
}
