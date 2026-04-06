import { useTranslation } from 'react-i18next'
import { type LucideIcon } from 'lucide-react'

interface PageShellProps {
  titleKey: string
  descriptionKey?: string
  icon: LucideIcon
  children?: React.ReactNode
  actions?: React.ReactNode
}

export function PageShell({ titleKey, descriptionKey, icon: Icon, children, actions }: PageShellProps) {
  const { t } = useTranslation()

  return (
    <div>
      {/* Page header */}
      <div
        className="page-header animate-fade-up"
        style={{ opacity: 0, animationFillMode: 'forwards' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32, height: 32,
              borderRadius: 'var(--r-sm)',
              background: 'var(--accent-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={15} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="page-title">{t(titleKey)}</h1>
            {descriptionKey && (
              <p className="page-subtitle">{t(descriptionKey)}</p>
            )}
          </div>
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {actions}
          </div>
        )}
      </div>

      {/* Content */}
      {children ?? (
        <div
          className="card animate-fade-up delay-100"
          style={{
            opacity: 0, animationFillMode: 'forwards',
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: 320,
          }}
        >
          <div
            style={{
              width: 48, height: 48,
              borderRadius: 'var(--r-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-weak)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Icon size={22} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <p style={{
            fontWeight: 600,
            fontSize: '0.9375rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            marginBottom: 6,
          }}>
            {t(titleKey)}
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-tertiary)',
            maxWidth: 380,
            lineHeight: 1.6,
            fontFamily: 'var(--font-sans)',
          }}>
            This module is ready for implementation. The full UI and business logic will be built progressively.
          </p>
          <span
            className="badge badge-neutral"
            style={{ marginTop: 16, fontSize: '0.75rem', padding: '4px 12px' }}
          >
            Phase 2+
          </span>
        </div>
      )}
    </div>
  )
}