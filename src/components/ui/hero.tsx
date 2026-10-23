import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// --- Custom SVG Components for Hand-Drawn Accents ---

const ArrowGreenLeft = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#CCFF00] stroke-current overflow-visible" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowGreenRight = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#CCFF00] stroke-current overflow-visible" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

const ArrowBlack = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-black stroke-current overflow-visible" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

const CircularBadge = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} aria-label="Open the login page" className="relative w-28 h-28 md:w-36 md:h-36 bg-[#CCFF00] rounded-full flex items-center justify-center shadow-xl rotate-12 hover:scale-105 transition-transform cursor-pointer border-[3px] border-black/5">
    <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
        <text className="text-[11px] font-black tracking-[0.18em] uppercase" fill="black">
          <textPath href="#circlePath" startOffset="0%">
            TRY THE DEMO NOW • TRY THE DEMO NOW • 
          </textPath>
        </text>
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-10 h-10 text-black stroke-current overflow-visible" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,80 Q 40,50 30,30 T 80,20" />
        <path d="M60,10 L80,20 L70,40" />
      </svg>
    </div>
  </button>
);

const headingShadow = '1px 1px 0 #001A99, 2px 2px 0 #001A99, 3px 3px 0 #001A99, 4px 4px 0 #001A99, 5px 5px 0 #001A99, 6px 6px 0 #001A99, 7px 7px 0 #001A99, 8px 8px 0 #001A99, 9px 9px 0 #001A99, 10px 10px 0 #001A99, 11px 11px 0 #001A99, 12px 12px 0 #001A99, 13px 13px 0 #001A99, 14px 14px 0 #001A99';

const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export const Component = () => {
  const navigate = useNavigate();
  const navLinks = [
    { label: 'About', action: () => goTo('about') },
    { label: 'How it works', action: () => goTo('features') },
    { label: 'Roles', action: () => goTo('roles') },
    { label: 'Register', action: () => navigate('/register') },
  ];

  return (
    <div className="min-h-screen bg-[#0038FF] flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black relative overflow-hidden w-full">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 md:px-10 md:py-8 max-w-[1440px] mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <div className="bg-white text-black font-black tracking-tight text-xs md:text-sm px-3 py-1.5 rounded-2xl rounded-bl-sm relative shadow-sm">
            CAMPUS
            <div className="absolute -bottom-1.5 left-0 w-3 h-3 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
          </div>
          <div className="bg-[#CCFF00] text-black font-black text-xs md:text-sm px-3 py-1.5 rounded-full border-[1.5px] border-white shadow-sm">
            RECORDS
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">
          {navLinks.map((item) => (
            <button key={item.label} onClick={item.action} className="px-4 py-1.5 rounded-full border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors">
              {item.label}
            </button>
          ))}
        </div>

        {/* Login Button */}
        <button onClick={() => navigate('/login')} className="px-6 py-2 rounded-full border border-white text-white text-xs md:text-sm font-semibold hover:bg-white hover:text-[#0038FF] transition-colors">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-8 pb-32 md:pt-12 md:pb-48 px-4 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto">

        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-10 mt-4 mb-16">

          {/* Text Stack */}
          <div className="w-full flex flex-col items-center relative z-10 space-y-2 md:space-y-4">

            <div className="w-full flex justify-start pl-[10%] md:pl-[25%] relative z-30">
              <h1 className="text-[clamp(4.5rem,12vw,160px)] font-black leading-[0.85] tracking-tighter text-[#CCFF00] m-0 p-0 uppercase" style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: headingShadow }}>
                #CAMPUS
              </h1>
            </div>

            <div className="w-full flex justify-center relative z-20">
              <h1 className="text-[clamp(5rem,15vw,220px)] font-black leading-[0.85] tracking-tighter text-white m-0 p-0 uppercase" style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: headingShadow }}>
                ACHIEVE
              </h1>
            </div>

            <div className="w-full flex justify-start pl-[15%] md:pl-[30%] relative z-10">
              <h1 className="text-[clamp(4.5rem,12vw,160px)] font-black leading-[0.85] tracking-tighter text-white m-0 p-0 uppercase" style={{ fontFamily: '"Arial Black", Impact, sans-serif', textShadow: headingShadow }}>
                RECORDS
              </h1>
            </div>

          </div>

          {/* Absolute Overlays (Cards, Arrows, Badge) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">

            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[10%] left-[5%] md:left-[20%] z-30 pointer-events-auto">
              <div className="w-40 md:w-52 aspect-[3/3.5] bg-white/20 backdrop-blur-md border border-white/40 rounded-[2rem] p-5 flex flex-col items-center justify-center rotate-[-12deg] shadow-2xl hover:rotate-0 transition-transform duration-500">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#D2B48C] rounded-full flex items-center justify-center mb-4 shadow-inner border-[3px] border-white/50 overflow-hidden">
                  <img src="https://cdn.21st.dev/assets/mirror/a9/a9ba4bfede6313e1469d3a9f805603867503389824f1daedfd5ed293c3a8156c.svg" alt="Student avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-center mt-2">
                  <p className="font-bold text-sm md:text-lg text-white">Aarav Sharma</p>
                  <p className="text-[10px] md:text-xs text-white/80 mt-1">6 achievements</p>
                </div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute top-[15%] right-[5%] md:right-[22%] z-30 pointer-events-auto">
              <div className="w-40 md:w-52 aspect-[3/3.5] bg-white/20 backdrop-blur-md border border-white/40 rounded-[2rem] p-5 flex flex-col items-center justify-center rotate-[12deg] shadow-2xl hover:rotate-0 transition-transform duration-500">
                <div className="w-16 h-16 md:w-24 md:h-24 bg-[#2C3E50] rounded-full flex items-center justify-center mb-4 shadow-inner border-[3px] border-white/50 overflow-hidden">
                  <img src="https://cdn.21st.dev/assets/mirror/0e/0eb34959afb0ef3df22405b23720146876e98b56ebf8e59f9d7fdeec5752d082.svg" alt="Student avatar" className="w-full h-full object-cover scale-150" />
                </div>
                <div className="text-center mt-2">
                  <p className="font-bold text-sm md:text-lg text-white">Diya Patel</p>
                  <p className="text-[10px] md:text-xs text-white/80 mt-1">2 verified</p>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-[0%] left-[0%] md:left-[10%] w-24 h-24 md:w-32 md:h-32 z-20"><ArrowGreenLeft /></div>
            <div className="absolute top-[5%] right-[0%] md:right-[10%] w-24 h-24 md:w-32 md:h-32 z-20"><ArrowGreenRight /></div>

            <div className="absolute bottom-[-10%] right-[0%] md:right-[15%] z-40 pointer-events-auto">
              <CircularBadge onClick={() => navigate('/login')} />
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Features Section */}
      <section id="features" className="bg-white text-black rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-6 py-12 md:px-10 md:py-16 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] mt-auto w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

          <div className="bg-[#F8F9FA] rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-gray-100">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black">UPLOAD YOUR<br/>CERTIFICATES</h3>
            <p className="text-[10px] md:text-xs text-black/60 font-bold mb-auto">keep a private record or submit it for review</p>
            <div className="relative w-full flex justify-center mt-6">
              <div className="flex items-center bg-[#0038FF] rounded-2xl p-2 pr-16 text-white shadow-lg relative z-10">
                <div className="w-8 h-8 bg-[#D2B48C] rounded-full mr-3 border border-white/30 overflow-hidden flex-shrink-0">
                  <img src="https://cdn.21st.dev/assets/mirror/a9/a9ba4bfede6313e1469d3a9f805603867503389824f1daedfd5ed293c3a8156c.svg" alt="Student avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold leading-none">AWS Cloud Practitioner</p>
                  <p className="text-[8px] text-white/70 leading-none mt-1">Certification</p>
                </div>
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#CCFF00] text-black font-black text-[10px] px-3 py-2 rounded-xl z-20 shadow-md">Submitted</div>
            </div>
            <div className="hidden md:block absolute -right-12 bottom-8 w-16 h-16 z-30"><ArrowBlack /></div>
          </div>

          <div className="bg-[#F8F9FA] rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-gray-100">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black">FACULTY REVIEWS<br/>THE EVIDENCE</h3>
            <p className="text-[10px] md:text-xs text-black/60 font-bold mb-auto">approve, reject or ask for changes</p>
            <div className="relative w-full flex justify-center mt-6">
              <div className="flex items-center bg-[#0038FF] rounded-full p-1.5 text-white shadow-lg">
                <div className="bg-white/20 text-white font-bold text-sm px-4 py-2 rounded-full mr-2">Approved</div>
                <div className="font-bold text-xs px-4">Dr. Iyer</div>
              </div>
              <div className="absolute -bottom-6 right-1/3 bg-[#CCFF00] rounded-full p-2.5 shadow-lg transform rotate-12 z-20">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-black stroke-current" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
              </div>
            </div>
            <div className="hidden md:block absolute -right-12 bottom-8 w-16 h-16 z-30"><ArrowBlack /></div>
          </div>

          <div className="bg-[#F8F9FA] rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-gray-100">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black">PUBLISH ONLY<br/>WHEN YOU CHOOSE</h3>
            <p className="text-[10px] md:text-xs text-black/60 font-bold mb-auto">confidential records never go public</p>
            <div className="flex flex-col items-center bg-[#CCFF00] rounded-[2rem] px-6 py-4 text-black shadow-lg mt-6 relative w-full max-w-[200px]">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1">Campus Network</p>
              <p className="text-xl font-black">Visible</p>
              <div className="absolute -bottom-2 left-8 w-5 h-5 bg-[#CCFF00] transform rotate-45"></div>
            </div>
          </div>

        </div>

        {/* About + Roles */}
        <div id="about" className="max-w-6xl mx-auto mt-16 text-center">
          <h2 className="font-black text-3xl uppercase">One platform for student activity records</h2>
          <p className="text-black/60 mt-3 max-w-2xl mx-auto text-sm">Certificates, assignments, projects, resumes, a campus achievement network and approval requests - all in one place. This is a frontend demonstration using mock data; it does not perform real certificate verification, secure authentication or legal e-signatures.</p>
        </div>
        <div id="roles" className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { r: 'Student', t: 'Upload certificates, submit work, build a profile and share achievements.' },
            { r: 'Faculty', t: 'Review evidence, set confidentiality, create assignments and handle approvals.' },
            { r: 'Super Admin', t: 'Monitor statistics, manage accounts and departments, export reports.' },
          ].map((x) => (
            <div key={x.r} className="rounded-[2rem] border border-gray-100 bg-[#F8F9FA] p-6 text-center">
              <h3 className="font-black uppercase text-xl">{x.r}</h3>
              <p className="text-sm text-black/60 mt-2 mb-4">{x.t}</p>
              <button onClick={() => navigate('/login')} className="px-5 py-2 rounded-full bg-[#0038FF] text-white text-sm font-bold hover:bg-[#001A99] transition-colors">Login as {x.r}</button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-black/40 mt-12">© CampusRecords - BTech project demo. Frontend only; real confidentiality needs server-side permissions.</p>
      </section>

    </div>
  );
};
