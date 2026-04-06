import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, ShoppingCart, Package, Receipt,
  Truck, Users, Building2, BookOpen, UserCog,
  FileBarChart, GitBranch, Settings,
} from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ size?: number }>
  exact?: boolean
}

interface NavSection {
  heading: string
  items: NavItem[]
}

export function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()

  const sections: NavSection[] = [
    {
      heading: 'Core',
      items: [
        { label: t('nav.dashboard', 'Dashboard'), path: '/dashboard', icon: LayoutDashboard, exact: true },
        { label: t('nav.pos', 'Point of Sale'), path: '/pos', icon: ShoppingCart },
        { label: t('nav.inventory', 'Inventory'), path: '/inventory', icon: Package },
        { label: t('nav.sales', 'Sales'), path: '/sales', icon: Receipt },
        { label: t('nav.purchases', 'Purchases'), path: '/purchases', icon: Truck },
        { label: t('nav.customers', 'Customers'), path: '/customers', icon: Users },
        { label: t('nav.suppliers', 'Suppliers'), path: '/suppliers', icon: Building2 },
      ],
    },
    {
      heading: 'Finance',
      items: [
        { label: t('nav.accounting', 'Accounting'), path: '/accounting', icon: BookOpen },
      ],
    },
    {
      heading: 'HR',
      items: [
        { label: t('nav.employees', 'Employees'), path: '/hr/employees', icon: UserCog },
      ],
    },
    {
      heading: 'Analytics',
      items: [
        { label: t('nav.reports', 'Reports'), path: '/reports', icon: FileBarChart },
      ],
    },
    {
      heading: 'System',
      items: [
        { label: t('nav.branches', 'Branches'), path: '/branches', icon: GitBranch },
        { label: t('nav.settings', 'Settings'), path: '/settings', icon: Settings },
      ],
    },
  ]

  const isActive = (item: NavItem) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <Package size={16} />
        </div>
        <span className="sidebar-logo-text">Ceylon Mart</span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section.heading} className="sidebar-section">
            <p className="sidebar-section-label">{section.heading}</p>
            {section.items.map(item => {
              const active = isActive(item)
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`sidebar-item${active ? ' active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: Plan badge */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-weak)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '12px',
            background: 'var(--accent-muted)',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--accent-border, rgba(34, 197, 94, 0.1))',
          }}
        >
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-text)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}>
            Growth Plan
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-tertiary)',
            marginTop: 2,
          }}>
            3 branches · 500+ sales
          </p>
        </div>
      </div>
    </aside>
  )
}