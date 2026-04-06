import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MobileNav } from '@/components/layout/MobileNav'

export function DashboardLayout() {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <MobileNav />

      {/* Topbar */}
      <Topbar />

      {/* Main content */}
      <main className="page-content">
        <div className="page-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}