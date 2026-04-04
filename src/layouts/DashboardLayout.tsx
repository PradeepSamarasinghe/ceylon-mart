import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MobileNav } from '@/components/layout/MobileNav'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-page-bg)]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileNav />
      <Topbar />

      <main
        className="pt-[var(--topbar-height)] transition-all duration-300"
        style={{
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768
            ? 'var(--sidebar-width)'
            : '0',
        }}
      >
        <div className="p-[18px] md:p-[20px] max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
