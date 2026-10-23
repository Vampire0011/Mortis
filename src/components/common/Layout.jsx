import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import { Avatar } from './Ui.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useData } from '../../context/DataContext.jsx'
import { NAV, APP_NAME } from '../../config/constants.js'

// One reusable shell (sidebar + top bar) for every role. Menu items come from config/constants.js
export default function Layout() {
  const { user, role, logout } = useAuth()
  const { db } = useData()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const unread = db.notifications.filter((n) => n.userId === user?.id && !n.read).length
  const doLogout = () => { logout(); navigate('/login') }

  const sidebar = (
    <aside className="relative flex h-full w-64 flex-col overflow-y-auto bg-brand p-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      <div className="relative mb-6 flex items-center gap-1 px-2 pt-2">
        <span className="rounded-2xl rounded-bl-sm bg-white px-2 py-1 text-xs font-black text-black">CAMPUS</span>
        <span className="rounded-full border border-white bg-lime px-2 py-1 text-xs font-black text-black">RECORDS</span>
      </div>
      <nav className="relative flex-1 space-y-1" aria-label={`${APP_NAME} navigation`}>
        {NAV[role]?.map((item) => (
          <NavLink key={item.to + item.label} to={item.to} end={item.end} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? 'bg-lime text-black' : 'text-white/85 hover:bg-white/10'}`}>
            <Icon name={item.icon} size={17} /><span className="flex-1">{item.label}</span>
            {item.badge === 'unread' && unread > 0 && <span className="rounded-full bg-red-500 px-2 text-[10px] font-black text-white">{unread}</span>}
          </NavLink>
        ))}
      </nav>
      <button onClick={doLogout} className="relative mt-4 flex items-center gap-3 rounded-full border border-white/40 px-4 py-2 text-sm font-bold hover:bg-white hover:text-brand"><Icon name="LogOut" size={17} /> Logout</button>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">{sidebar}</div>
      {open && <div className="fixed inset-0 z-40 flex md:hidden"><div>{sidebar}</div><div className="flex-1 bg-black/50" onClick={() => setOpen(false)} /></div>}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink/5 bg-white px-4 py-3">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="Menu" /></button>
          <p className="hidden text-sm font-semibold text-ink/50 md:block">Demo environment - mock data only</p>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-mist" onClick={() => navigate('/notifications')} aria-label="Notifications"><Icon name="Bell" />{unread > 0 && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white">{unread}</span>}</button>
            <div className="flex items-center gap-2"><Avatar name={user?.name} size={34} /><div className="hidden text-xs leading-tight sm:block"><p className="font-bold">{user?.name}</p><p className="capitalize text-ink/50">{role} - {user?.id}</p></div></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
