import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
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

interface NavGroup {
  label: string
  items: NavItem[]
}

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()

  const navGroups: NavGroup[] = [
    {
      label: 'CORE',
      items: [
        { label: t('nav.dashboard'), path: '/', icon: <LayoutDashboard /> },
        { label: t('nav.pos'), path: '/pos', icon: <ShoppingCart /> },
        { label: t('nav.inventory'), path: '/inventory/products', icon: <Package /> },
        { label: t('nav.sales'), path: '/sales', icon: <Receipt /> },
        { label: t('nav.purchases'), path: '/purchases', icon: <Truck /> },
        { label: t('nav.customers'), path: '/customers', icon: <Users /> },
        { label: t('nav.suppliers'), path: '/suppliers', icon: <Building2 /> },
      ],
    },
    {
      label: 'FINANCE',
      items: [
        { label: t('nav.accounting'), path: '/accounting/ledger', icon: <BookOpen /> },
      ],
    },
    {
      label: 'HR',
      items: [
        { label: t('nav.employees'), path: '/hr/employees', icon: <UserCog /> },
      ],
    },
    {
      label: 'ANALYTICS',
      items: [
        { label: t('nav.reports'), path: '/reports', icon: <FileBarChart /> },
      ],
    },
    {
      label: 'SYSTEM',
      items: [
        { label: t('nav.branches'), path: '/branches', icon: <GitBranch /> },
        { label: t('nav.settings'), path: '/settings', icon: <Settings /> },
      ],
    },
  ]

  return (
    <aside className="sidebar flex flex-col">
      <div className="flex items-center gap-3 px-[24px] py-[24px]">
        <Gem size={20} className="text-[var(--color-accent)]" />
        <h1 className="text-[16px] font-medium text-[#111827]">
          CeylonMart
        </h1>
      </div>

      <nav className="flex-1 px-[16px] py-[10px] space-y-[24px]">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-[12px] mb-[8px] section-header">
              {group.label}
            </p>
            <div className="space-y-[4px]">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'sidebar-nav-item',
                      isActive && 'active'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
