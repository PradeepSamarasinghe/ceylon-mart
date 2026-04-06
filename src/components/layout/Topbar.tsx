import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { Search, Bell, ChevronDown, Menu, Wifi, WifiOff, Moon, Sun } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

const LANG_LABELS: Record<string, string> = { en: 'EN', si: 'සිං', ta: 'தமி' }

export function Topbar() {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const { language, setLanguage, setSidebarOpen, darkMode, toggleDarkMode } = useSettingsStore()
  const [online] = useState(true)
  const [langOpen, setLangOpen] = useState(false)

  const displayName = user?.full_name?.split(' ')[0] ?? 'Admin'
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) ?? 'AD'

  const switchLang = (lang: 'en' | 'si' | 'ta') => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    setLangOpen(false)
  }

  return (
    <header className="topbar">
      {/* Mobile menu toggle */}
      <button
        className="btn-icon md:hidden"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={16} />
      </button>

      {/* Search */}
      <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
        <Search size={13} style={{ color: 'var(--text-disabled)', flexShrink: 0 }} />
        <input placeholder={t('common.search', 'Search...')} aria-label="Search" />
        <kbd
          style={{
            fontSize: '0.625rem',
            padding: '2px 5px',
            background: 'var(--bg-active)',
            border: '1px solid var(--border-base)',
            borderRadius: 4,
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}
        >⌘K</kbd>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        {/* Online indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            background: online ? 'var(--success-subtle)' : 'var(--danger-subtle)',
            border: `1px solid ${online ? 'var(--success-border)' : 'var(--danger-border)'}`,
            borderRadius: 'var(--r-full)',
          }}
        >
          {online
            ? <Wifi size={11} style={{ color: 'var(--success)' }} />
            : <WifiOff size={11} style={{ color: 'var(--danger)' }} />
          }
          <span style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: online ? 'var(--success)' : 'var(--danger)',
            fontFamily: 'var(--font-sans)',
          }}>
            {online ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          className="btn-icon"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Language switcher */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '5px 10px', gap: 4, fontSize: '0.8125rem' }}
            onClick={() => setLangOpen(!langOpen)}
            aria-haspopup="true"
            aria-expanded={langOpen}
          >
            {LANG_LABELS[language]}
            <ChevronDown size={11} />
          </button>
          {langOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--r-md)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                zIndex: 50,
                minWidth: 100,
              }}
            >
              {(['en', 'si', 'ta'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => switchLang(lang)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '8px 12px',
                    background: language === lang ? 'var(--accent-muted)' : 'transparent',
                    color: language === lang ? 'var(--accent-text)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: language === lang ? 600 : 400,
                    textAlign: 'left',
                    transition: 'background var(--t-fast)',
                  }}
                >
                  {lang === 'en' ? '🇬🇧 English' : lang === 'si' ? '🇱🇰 සිංහල' : '🇱🇰 தமிழ்'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="btn-icon" aria-label="Notifications">
            <Bell size={15} />
          </button>
          <span
            style={{
              position: 'absolute',
              top: 4, right: 4,
              width: 7, height: 7,
              borderRadius: '50%',
              background: 'var(--danger)',
              border: '2px solid var(--bg-surface)',
            }}
          />
        </div>

        {/* User avatar */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 8px 4px 4px',
            background: 'transparent',
            border: '1px solid var(--border-weak)',
            borderRadius: 'var(--r-sm)',
            cursor: 'pointer',
            transition: 'all var(--t-fast)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'
              ; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-base)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent'
              ; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-weak)'
          }}
          aria-label="User menu"
        >
          <div className="avatar" style={{ width: 24, height: 24, fontSize: '0.6875rem' }}>
            {initials}
          </div>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
          }}>
            {displayName}
          </span>
          <ChevronDown size={11} style={{ color: 'var(--text-tertiary)' }} />
        </button>
      </div>
    </header>
  )
}