import { Outlet } from 'react-router-dom'
import { Gem } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-dark)] pattern-kandyan flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[rgba(232,160,69,0.04)] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[rgba(184,50,50,0.03)] blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-up">
          <div className="w-12 h-12 rounded-xl gradient-saffron flex items-center justify-center">
            <Gem size={28} className="text-[var(--color-dark)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-[var(--font-display)] text-gradient-saffron">
              CeylonMart
            </h1>
            <p className="text-xs text-[var(--color-muted)] uppercase tracking-[0.25em]">
              Pro
            </p>
          </div>
        </div>

        {/* Kandyan band */}
        <div className="kandyan-band mb-6" />

        {/* Auth form container */}
        <div className="glass-card-static p-8 animate-fade-up delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--color-muted)] mt-6 animate-fade-up delay-300" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          Retail Management Platform for Sri Lanka 🇱🇰
        </p>
      </div>
    </div>
  )
}
