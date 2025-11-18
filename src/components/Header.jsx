import { useState } from 'react'

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="relative z-10 border-b border-white/10 bg-slate-900/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-white font-semibold text-lg">Flux Exchange</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-blue-200">
          <a href="#convert" className="hover:text-white">Convert</a>
          <a href="#rates" className="hover:text-white">Rates</a>
          <a href="#history" className="hover:text-white">History</a>
          <a href="/test" className="hover:text-white">System</a>
        </nav>
        <button onClick={()=>setOpen(!open)} className="md:hidden text-blue-200">Menu</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4 text-blue-200">
          <a href="#convert" className="block py-2">Convert</a>
          <a href="#rates" className="block py-2">Rates</a>
          <a href="#history" className="block py-2">History</a>
          <a href="/test" className="block py-2">System</a>
        </div>
      )}
    </header>
  )
}

export default Header
