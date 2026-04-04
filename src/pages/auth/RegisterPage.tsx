import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'

export function RegisterPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-warm)]">
          {t('auth.register')}
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Start your 14-day free trial
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input type="text" placeholder="Your full name" className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">{t('auth.email')}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input type="email" placeholder="you@company.lk" className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">{t('auth.password')}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input type="password" placeholder="••••••••" className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">{t('auth.confirm_password')}</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input type="password" placeholder="••••••••" className="input-field pl-10" />
          </div>
        </div>

        <Link to="/auth/onboarding" className="btn-primary w-full py-3 text-center block">
          {t('auth.sign_up')}
        </Link>
      </form>

      <p className="text-center text-sm text-[var(--color-muted)]">
        {t('auth.has_account')}{' '}
        <Link to="/auth/login" className="text-[var(--color-primary)] hover:underline font-medium">
          {t('auth.sign_in')}
        </Link>
      </p>
    </div>
  )
}
