import { useState } from 'react'
import Icon from './Icon.jsx'
import { ALLOWED_CERT_TYPES, MAX_FILE_MB, MAX_PERSIST_BYTES } from '../../config/constants.js'
import { formatSize, validateFile } from '../../utils/validation.js'

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="h-title">{title}</h1>{subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}
export function StatCard({ label, value, tone = 'white' }) {
  const t = { white: 'bg-white', blue: 'bg-brand text-white', lime: 'bg-lime' }[tone]
  return <div className={`rounded-[1.5rem] border border-ink/5 p-5 shadow-sm ${t}`}><p className="font-display text-3xl">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wide opacity-70">{label}</p></div>
}
export function Empty({ text }) {
  return <div className="rounded-[1.5rem] border-2 border-dashed border-ink/10 p-8 text-center text-sm text-ink/50">{text}</div>
}
export function Notice({ tone = 'info', children }) {
  const c = { info: 'bg-blue-50 text-blue-800 border-blue-200', warn: 'bg-amber-50 text-amber-800 border-amber-200', error: 'bg-red-50 text-red-700 border-red-200', ok: 'bg-emerald-50 text-emerald-700 border-emerald-200' }[tone]
  return <div className={`rounded-xl border px-4 py-2 text-sm ${c}`}>{children}</div>
}
export function Field({ label, error, children, hint }) {
  return <div><label className="label">{label}</label>{children}{hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}{error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}</div>
}
export function Select({ value, onChange, options, placeholder, className = '' }) {
  return (
    <select className={`input ${className}`} value={value} onChange={(e) => onChange(e.target.value)}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}
    </select>
  )
}
export function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return <div className="relative"><span className="pointer-events-none absolute left-3 top-2.5 text-ink/40"><Icon name="Search" size={16} /></span><input className="input pl-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>
}
export function Tabs({ tabs, value, onChange }) {
  return <div className="mb-4 flex flex-wrap gap-2">{tabs.map((t) => <button key={t} onClick={() => onChange(t)} className={`btn btn-sm ${value === t ? 'btn-primary' : 'btn-outline'}`}>{t}</button>)}</div>
}
// Comma separated tags editor (skills, tags, technologies)
export function TagInput({ value, onChange, placeholder }) {
  const [text, setText] = useState('')
  const add = () => { const v = text.trim(); if (v && !value.includes(v)) onChange([...value, v]); setText('') }
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1">{value.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-mist px-2 py-0.5 text-xs font-semibold">{t}<button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`}><Icon name="X" size={12} /></button></span>)}</div>
      <div className="flex gap-2"><input className="input" value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} /><button type="button" className="btn btn-outline" onClick={add}>Add</button></div>
    </div>
  )
}
export function ChipSelect({ options, value, onChange }) {
  return <div className="flex flex-wrap gap-2">{options.map((o) => { const on = value.includes(o); return <button type="button" key={o} onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${on ? 'border-brand bg-brand text-white' : 'border-ink/10 bg-white'}`}>{o}</button> })}</div>
}
// File picker with validation + image preview + remove/replace. Value = { name, size, type, dataUrl? }
export function FileInput({ value, onChange, types = ALLOWED_CERT_TYPES, maxMb = MAX_FILE_MB, label = 'File', hint }) {
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(value?.dataUrl || '')
  const pick = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    const err = validateFile(f, types, maxMb)
    if (err) { setError(err); e.target.value = ''; return }
    setError('')
    const meta = { name: f.name, size: f.size, type: f.type, uploadedAt: new Date().toISOString() }
    if (f.type.startsWith('image/')) {
      const r = new FileReader()
      r.onload = () => { setPreview(r.result); onChange({ ...meta, dataUrl: f.size <= MAX_PERSIST_BYTES ? r.result : undefined, previewOnly: f.size > MAX_PERSIST_BYTES }) }
      r.readAsDataURL(f)
    } else { setPreview(''); onChange(meta) }
  }
  const clear = () => { setPreview(''); setError(''); onChange(null) }
  return (
    <div>
      <label className="label">{label}</label>
      {value ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-ink/10 p-3 text-sm">
          {(preview || value.dataUrl) && <img src={preview || value.dataUrl} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />}
          <div className="min-w-0 flex-1"><p className="truncate font-semibold">{value.name}</p><p className="text-xs text-ink/50">{formatSize(value.size)} {value.type && `- ${value.type.split('/')[1]}`}</p>{value.previewOnly && <p className="text-xs text-amber-600">Large image: preview is kept for this session only.</p>}</div>
          <label className="btn btn-outline btn-sm cursor-pointer">Replace<input type="file" className="hidden" accept={types.join(',')} onChange={pick} /></label>
          <button type="button" className="btn btn-outline btn-sm" onClick={clear}>Remove</button>
        </div>
      ) : (
        <input type="file" className="input" accept={types.join(',')} onChange={pick} />
      )}
      <p className="mt-1 text-xs text-ink/50">{hint || `Allowed: PDF, PNG, JPG, WEBP. Max ${maxMb} MB. Demo only - the file is not sent to any server.`}</p>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  )
}
// Editable list of text lines (education, internships...)
export function ListEditor({ value, onChange, placeholder }) {
  const [text, setText] = useState('')
  const add = () => { if (text.trim()) { onChange([...value, text.trim()]); setText('') } }
  return (
    <div>
      <ul className="mb-2 space-y-1">{value.map((v, i) => <li key={i} className="flex items-center justify-between rounded-lg bg-mist px-3 py-1.5 text-sm">{v}<button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove"><Icon name="Trash2" size={14} /></button></li>)}</ul>
      <div className="flex gap-2"><input className="input" value={text} placeholder={placeholder} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} /><button type="button" className="btn btn-outline" onClick={add}>Add</button></div>
    </div>
  )
}
export function Avatar({ name = '?', size = 40 }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('')
  return <div style={{ width: size, height: size, fontSize: size / 2.6 }} className="flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-lime font-black text-black shadow">{initials}</div>
}
