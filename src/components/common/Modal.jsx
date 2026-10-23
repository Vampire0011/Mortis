import { useEffect } from 'react'
import Icon from './Icon.jsx'
export default function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
      <div className={`my-8 w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} rounded-[1.5rem] bg-white p-6 shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl uppercase">{title}</h3>
          <button className="rounded-full p-1 hover:bg-slate-100" onClick={onClose} aria-label="Close"><Icon name="X" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
