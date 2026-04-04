import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import {
  Menu,
  Bell,
  Search,
  User,
} from 'lucide-react'

export function Topbar() {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  return (
    <header className="topbar">
      <div className="flex items-center gap-4 w-full max-w-[400px]">
        <button className="md:hidden p-2">
          <Menu size={20} className="text-[var(--color-secondary)]" />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-[var(--color-page-bg)] rounded-[20px] px-[16px] py-[8px] w-full">
          <Search size={16} strokeWidth={1.3} className="text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Enter your search request..."
            className="bg-transparent border-none outline-none text-[14px] text-[#111827] placeholder-[var(--color-muted)] w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-[16px]">
        <button className="w-[36px] h-[36px] rounded-full bg-[var(--color-page-bg)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors">
          <Bell size={16} strokeWidth={1.3} className="text-[#111827]" />
        </button>

        <button className="w-[36px] h-[36px] rounded-full overflow-hidden bg-[var(--color-page-bg)] flex items-center justify-center">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={16} strokeWidth={1.3} className="text-[#111827]" />
          )}
        </button>
      </div>
    </header>
  )
}
