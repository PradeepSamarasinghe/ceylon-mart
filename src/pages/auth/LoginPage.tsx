import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Globe, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.user) {
        // Check if user has an organization
        const { data: profile } = await (supabase
          .from('profiles') as any)
          .select('organization_id')
          .eq('id', data.user.id)
          .single()

        if (profile?.organization_id) {
          navigate('/')
        } else {
          navigate('/auth/onboarding')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

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

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
            {t('auth.email')}
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.lk"
              className="input-field pl-10"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : t('auth.sign_in')}
        </button>
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
        <button 
          onClick={handleGoogleLogin}
          type="button" 
          className="btn-ghost w-full flex items-center justify-center gap-2 py-2.5"
        >
          <Globe size={18} className="text-[var(--color-primary)]" />
          {t('auth.google')}
        </button>
        <button type="button" className="btn-ghost w-full flex items-center justify-center gap-2 py-2.5">
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

