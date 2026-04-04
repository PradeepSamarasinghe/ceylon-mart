import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Store,
  Pill,
  Wrench,
  ShoppingCart,
  Truck,
  MapPin,
  Building,
  Check,
  ArrowRight,
  ArrowLeft,
  Crown,
  Sparkles,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function OnboardingPage() {
  const { t } = useTranslation()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('growth')

  const businessTypes = [
    { id: 'retail', label: 'Retail Shop', icon: Store, emoji: '🏪' },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, emoji: '💊' },
    { id: 'hardware', label: 'Hardware', icon: Wrench, emoji: '🔧' },
    { id: 'superette', label: 'Superette', icon: ShoppingCart, emoji: '🛒' },
    { id: 'wholesale', label: 'Wholesale', icon: Truck, emoji: '🚚' },
  ]

  const plans = [
    {
      id: 'starter',
      name: t('onboarding.plan_starter'),
      price: 'Rs. 2,500',
      icon: Zap,
      features: ['1 Branch', '2 Users', 'Basic POS', 'Basic Reports', 'Email Support'],
      color: '#8A7A6A',
    },
    {
      id: 'growth',
      name: t('onboarding.plan_growth'),
      price: 'Rs. 7,500',
      icon: Sparkles,
      features: ['3 Branches', '10 Users', 'Full POS + Offline', 'Payroll + EPF/ETF', 'WhatsApp Receipts', 'VAT/SVAT Reports', 'Priority Support'],
      color: '#E8A045',
      popular: true,
    },
    {
      id: 'chain',
      name: t('onboarding.plan_chain'),
      price: 'Rs. 15,000',
      icon: Crown,
      features: ['Unlimited Branches', 'Unlimited Users', 'Everything in Growth', 'Multi-Branch Analytics', 'Stock Transfers', 'Custom Reports', 'Dedicated Support', 'API Access'],
      color: '#B83232',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                s === step
                  ? 'gradient-saffron text-[var(--color-dark)]'
                  : s < step
                  ? 'bg-[var(--color-success)] text-white'
                  : 'bg-[var(--color-dark-3)] text-[var(--color-muted)]'
              )}
            >
              {s < step ? <Check size={14} /> : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  'w-12 h-0.5 rounded',
                  s < step ? 'bg-[var(--color-success)]' : 'bg-[var(--color-dark-3)]'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Organization */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <h3 className="text-lg font-semibold text-center font-[family-name:var(--font-display)]">
            {t('onboarding.step1_title')}
          </h3>

          <div>
            <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
              {t('onboarding.business_name')} *
            </label>
            <input type="text" className="input-field" placeholder="My Business Name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
                {t('onboarding.business_name_si')}
              </label>
              <input type="text" className="input-field" placeholder="සිංහල නම" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
                {t('onboarding.business_name_ta')}
              </label>
              <input type="text" className="input-field" placeholder="தமிழ் பெயர்" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-2">
              {t('onboarding.business_type')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {businessTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'p-3 rounded-xl border text-center transition-all',
                    selectedType === type.id
                      ? 'border-[var(--color-primary)] bg-[rgba(232,160,69,0.08)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                  )}
                >
                  <span className="text-2xl">{type.emoji}</span>
                  <p className="text-xs mt-1 text-[var(--color-warm-dim)]">{type.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
              VAT Number (Optional)
            </label>
            <input type="text" className="input-field" placeholder="VAT Registration Number" />
          </div>

          <button onClick={() => setStep(2)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            {t('common.next')} <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Branch */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <h3 className="text-lg font-semibold text-center font-[family-name:var(--font-display)]">
            {t('onboarding.step2_title')}
          </h3>

          <div>
            <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
              {t('onboarding.branch_name')} *
            </label>
            <div className="relative">
              <Building size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input type="text" className="input-field pl-10" placeholder="Main Branch" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-warm-dim)] mb-1.5">
              {t('common.address')}
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-[var(--color-muted)]" />
              <textarea className="input-field pl-10 min-h-[80px]" placeholder="123 Main Street, Colombo 03" />
            </div>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-dark-3)] cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-primary)]" />
            <div>
              <p className="text-sm font-medium text-[var(--color-warm)]">{t('onboarding.is_headquarters')}</p>
              <p className="text-xs text-[var(--color-muted)]">Mark this as your main branch</p>
            </div>
          </label>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1 flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> {t('common.back')}
            </button>
            <button onClick={() => setStep(3)} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {t('common.next')} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Plan Selection */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-in">
          <h3 className="text-lg font-semibold text-center font-[family-name:var(--font-display)]">
            {t('onboarding.step3_title')}
          </h3>
          <p className="text-center text-sm text-[var(--color-primary)] font-medium">
            ✨ {t('onboarding.free_trial')} — no payment required
          </p>

          <div className="space-y-3">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all relative',
                  selectedPlan === plan.id
                    ? 'border-[var(--color-primary)] bg-[rgba(232,160,69,0.05)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider gradient-saffron text-[var(--color-dark)]">
                    Most Popular
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${plan.color}15` }}>
                      <plan.icon size={20} style={{ color: plan.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-warm)]">{plan.name}</p>
                      <p className="text-lg font-bold" style={{ color: plan.color }}>
                        {plan.price}
                        <span className="text-xs font-normal text-[var(--color-muted)]"> {t('onboarding.per_month')}</span>
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1',
                      selectedPlan === plan.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                        : 'border-[var(--color-muted)]'
                    )}
                  >
                    {selectedPlan === plan.id && <Check size={12} className="text-[var(--color-dark)]" />}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {plan.features.map((f) => (
                    <span key={f} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-dark-3)] text-[var(--color-muted)]">
                      {f}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-ghost flex-1 flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> {t('common.back')}
            </button>
            <Link to="/" className="btn-primary flex-1 flex items-center justify-center gap-2">
              {t('onboarding.start_trial')} 🚀
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
