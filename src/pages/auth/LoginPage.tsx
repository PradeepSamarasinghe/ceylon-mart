import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Mail, Lock, Globe } from 'lucide-react'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-warm)]">
          {t('auth.login')}
        </h2>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          Sign in to your CeylonMart Pro account
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
            {t('auth.email')}
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="email"
              placeholder="you@company.lk"
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-[var(--color-warm-dim)]">
              {t('auth.password')}
            </label>
            <button
              type="button"
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              {t('auth.forgot_password')}
            </button>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="password"
              placeholder="••••••••"
              className="input-field pl-10"
            />
          </div>
        </div>

        <Link
          to="/"
          className="btn-primary w-full py-3 text-center block"
        >
          {t('auth.sign_in')}
        </Link>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-[var(--color-dark-2)] text-[var(--color-muted)]">
            {t('auth.or')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button className="btn-ghost w-full flex items-center justify-center gap-2 py-2.5">
          <Globe size={18} className="text-[var(--color-primary)]" />
          {t('auth.google')}
        </button>
        <button className="btn-ghost w-full flex items-center justify-center gap-2 py-2.5">
          <Mail size={18} className="text-[var(--color-primary)]" />
          {t('auth.magic_link')}
        </button>
      </div>

      <p className="text-center text-sm text-[var(--color-muted)]">
        {t('auth.no_account')}{' '}
        <Link to="/auth/register" className="text-[var(--color-primary)] hover:underline font-medium">
          {t('auth.sign_up')}
        </Link>
      </p>
    </div>
  )
}
