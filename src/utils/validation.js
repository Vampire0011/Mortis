export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || '')
export const isUrl = (v) => { try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:' } catch { return false } }
export const isEmpty = (v) => !v || !String(v).trim()
export const isUserId = (v) => /^[A-Za-z0-9_-]{4,20}$/.test(v || '')

export function validateFile(file, allowedTypes, maxMb) {
  if (!file) return 'Please choose a file.'
  if (allowedTypes && !allowedTypes.includes(file.type)) return 'Unsupported file type.'
  if (file.size > maxMb * 1024 * 1024) return `File is larger than ${maxMb} MB.`
  return ''
}
export const formatSize = (b = 0) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)
export const fmtDate = (d) => { if (!d) return '-'; const x = new Date(d); return isNaN(x) ? d : x.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) }
export const today = () => new Date().toISOString().slice(0, 10)
