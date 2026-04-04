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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[rgba(232,160,69,0.1)]">
            <Icon size={24} className="text-[var(--color-primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
              {t(titleKey)}
            </h1>
            {descriptionKey && (
              <p className="text-sm text-[var(--color-muted)] mt-0.5">
                {t(descriptionKey)}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Kandyan Band */}
      <div className="kandyan-band" />

      {/* Content */}
      {children || (
        <div className="glass-card-static p-12 text-center animate-fade-up delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(232,160,69,0.08)] flex items-center justify-center">
            <Icon size={32} className="text-[var(--color-primary)] opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-warm)] mb-2">
            {t(titleKey)}
          </h3>
          <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto">
            This module is ready for Phase 2+ implementation. The full UI, data tables, forms, and business logic will be built progressively.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="badge badge-primary">Coming Soon</span>
          </div>
        </div>
      )}
    </div>
  )
}
