import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/store/settingsStore'
import {
  X,
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Truck,
  Users,
  Building2,
  BookOpen,
  UserCog,
  FileBarChart,
  GitBranch,
  Settings,
  Gem,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const { t } = useTranslation()
  const { sidebarOpen, setSidebarOpen } = useSettingsStore()
  const location = useLocation()

  // Close on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, setSidebarOpen])

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [setSidebarOpen])

  const navItems = [
    { label: t('nav.dashboard'), path: '/', icon: <LayoutDashboard size={20} /> },
    { label: t('nav.pos'), path: '/pos', icon: <ShoppingCart size={20} /> },
    { label: t('nav.inventory'), path: '/inventory', icon: <Package size={20} /> },
    { label: t('nav.sales'), path: '/sales', icon: <Receipt size={20} /> },
    { label: t('nav.purchases'), path: '/purchases', icon: <Truck size={20} /> },
    { label: t('nav.customers'), path: '/customers', icon: <Users size={20} /> },
    { label: t('nav.suppliers'), path: '/suppliers', icon: <Building2 size={20} /> },
    { label: t('nav.accounting'), path: '/accounting', icon: <BookOpen size={20} /> },
    { label: t('nav.hr'), path: '/hr/employees', icon: <UserCog size={20} /> },
    { label: t('nav.reports'), path: '/reports', icon: <FileBarChart size={20} /> },
    { label: t('nav.branches'), path: '/branches', icon: <GitBranch size={20} /> },
    { label: t('nav.settings'), path: '/settings', icon: <Settings size={20} /> },
  ]

  if (!sidebarOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[var(--color-overlay)] z-40 md:hidden animate-fade-in"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[280px] bg-[var(--color-dark-2)] border-r border-[var(--color-border)] z-50 md:hidden animate-slide-left overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-saffron flex items-center justify-center">
              <Gem size={20} className="text-[var(--color-dark)]" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gradient-saffron leading-tight">
                CeylonMart
              </h1>
              <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
                Pro
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-[var(--color-dark-3)] transition-colors"
          >
            <X size={20} className="text-[var(--color-muted)]" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'sidebar-nav-item',
                  isActive && 'active'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom band */}
        <div className="kandyan-band mx-4 mb-4 mt-auto" />
      </div>
    </>
  )
}
