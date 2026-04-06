/**
 * CeylonMart Pro — Dashboard v3
 * Green (#22c55e) accent, dark/light mode, dot background
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp, TrendingDown, ShoppingCart, AlertTriangle,
  CreditCard, ArrowUpRight, ArrowDownRight, ChevronRight,
  MoreHorizontal, Package, ExternalLink, RefreshCw,
  Sun, Moon,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

// ─── TYPES ─────────────────────────────────────────────────

type TrendDir = 'up' | 'down' | 'flat'
type TxStatus = 'Paid' | 'Pending' | 'Overdue'
type Range = '7D' | '30D' | '3M'

interface KpiData {
  label: string
  value: string
  delta: string
  deltaLabel: string
  trend: TrendDir
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconColor: string
  iconBg: string
}

interface Transaction {
  id: string
  name: string
  amount: number
  time: string
  status: TxStatus
  method: string
  initials: string
}

interface Branch {
  name: string
  revenue: number
  orders: number
  growth: number
}

interface Product {
  name: string
  sku: string
  units: number
  revenue: number
  delta: number
}

// ─── STATIC DATA ───────────────────────────────────────────

const chartData7D = [
  { day: 'Mon', revenue: 58000, orders: 42 },
  { day: 'Tue', revenue: 125000, orders: 89 },
  { day: 'Wed', revenue: 85000, orders: 61 },
  { day: 'Thu', revenue: 95000, orders: 71 },
  { day: 'Fri', revenue: 110000, orders: 83 },
  { day: 'Sat', revenue: 88000, orders: 64 },
  { day: 'Sun', revenue: 287500, orders: 47 },
]

const chartData30D = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: 60000 + ((i * 137.5) % 1) * 180000 + Math.sin(i) * 40000,
  orders: 30 + Math.floor(((i * 97.3) % 1) * 80),
}))

const chartData3M = Array.from({ length: 12 }, (_, i) => ({
  day: `W${i + 1}`,
  revenue: 400000 + ((i * 137.5) % 1) * 800000 + Math.sin(i) * 100000,
  orders: 200 + Math.floor(((i * 97.3) % 1) * 400),
}))

const CHART_DATA: Record<Range, typeof chartData7D> = {
  '7D': chartData7D,
  '30D': chartData30D,
  '3M': chartData3M,
}

const TRANSACTIONS: Transaction[] = [
  { id: 'INV-0847', name: 'Perera Stores', amount: 12500, time: '2m ago', status: 'Paid', method: 'Cash', initials: 'PS' },
  { id: 'INV-0846', name: 'Walk-in Customer', amount: 3200, time: '15m ago', status: 'Pending', method: 'LankaQR', initials: 'WK' },
  { id: 'INV-0845', name: 'Silva Pharmacy', amount: 45000, time: '32m ago', status: 'Overdue', method: 'Credit', initials: 'SP' },
  { id: 'INV-0844', name: 'Colombo Grocers', amount: 31000, time: '1h ago', status: 'Paid', method: 'PayHere', initials: 'CG' },
  { id: 'INV-0843', name: 'Fernando & Sons', amount: 8750, time: '2h ago', status: 'Paid', method: 'Cash', initials: 'FS' },
]

const BRANCHES: Branch[] = [
  { name: 'Colombo HQ', revenue: 2970000, orders: 1420, growth: 14.2 },
  { name: 'Kandy', revenue: 1850000, orders: 890, growth: 8.7 },
  { name: 'Galle', revenue: 1420000, orders: 680, growth: -2.1 },
  { name: 'Jaffna', revenue: 970000, orders: 461, growth: 22.4 },
  { name: 'Matara', revenue: 760000, orders: 362, growth: 5.3 },
]

const PRODUCTS: Product[] = [
  { name: 'Maldive Fish (500g)', sku: 'MF-500', units: 1200, revenue: 485000, delta: 12.5 },
  { name: 'Ceylon Tea Premium', sku: 'CT-100P', units: 980, revenue: 385000, delta: 8.3 },
  { name: 'Coconut Oil (1L)', sku: 'CO-1L', units: 850, revenue: 320000, delta: -2.1 },
  { name: 'Rice - Nadu (5kg)', sku: 'RN-5KG', units: 720, revenue: 285000, delta: 5.7 },
  { name: 'Sugar (1kg)', sku: 'SG-1KG', units: 690, revenue: 245000, delta: 3.2 },
]

// ─── HELPERS ───────────────────────────────────────────────

function rs(n: number): string {
  if (n >= 1_000_000) return `Rs. ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `Rs. ${(n / 1_000).toFixed(0)}K`
  return `Rs. ${n.toLocaleString()}`
}

function rsFull(n: number): string {
  return 'Rs. ' + n.toLocaleString('en-LK')
}

const STATUS_CONFIG: Record<TxStatus, { cls: string }> = {
  Paid: { cls: 'badge badge-success' },
  Pending: { cls: 'badge badge-warning' },
  Overdue: { cls: 'badge badge-danger' },
}

// (Themes and Shared CSS moved to index.css)

// ─── SUB-COMPONENTS ────────────────────────────────────────

function TrendChip({ value, label }: { value: number; label?: string }) {
  const up = value > 0
  const cls = up ? 'badge trend-up' : value < 0 ? 'badge trend-down' : 'badge trend-flat'
  return (
    <span className={cls} style={{ fontSize: '0.6875rem', borderRadius: 'var(--r-full)', padding: '2px 7px' }}>
      {up ? <ArrowUpRight size={10} /> : value < 0 ? <ArrowDownRight size={10} /> : null}
      {up ? '+' : ''}{value.toFixed(1)}%{label ? ` ${label}` : ''}
    </span>
  )
}

function KpiCard({ kpi, delay }: { kpi: KpiData; delay: number }) {
  const [hovered, setHovered] = useState(false)
  const IconComp = kpi.icon
  return (
    <div
      className={`card card-hover animate-fade-up delay-${delay} p-5`}
      style={{ opacity: 0, animationFillMode: 'forwards' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-label" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</p>
        <div style={{
          width: 32, height: 32,
          borderRadius: 'var(--r-sm)',
          background: kpi.iconBg,
          color: kpi.iconColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform var(--t-base)',
          transform: hovered ? 'scale(1.10)' : 'scale(1)',
        }}>
          <IconComp size={15} />
        </div>
      </div>
      <p style={{
        fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em',
        lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 10,
        fontFamily: 'var(--font-sans)',
      }}>
        {kpi.value}
      </p>
      <div className="flex items-center gap-2">
        <TrendChip value={kpi.trend === 'up' ? parseFloat(kpi.delta) : kpi.trend === 'down' ? -parseFloat(kpi.delta) : 0} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{kpi.deltaLabel}</span>
      </div>
    </div>
  )
}

function RangeSelector({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div style={{
      display: 'flex', gap: 2, padding: 3,
      background: 'var(--bg-subtle)',
      borderRadius: 'var(--r-sm)',
      border: '1px solid var(--border-weak)',
    }}>
      {(['7D', '30D', '3M'] as Range[]).map(r => (
        <button key={r} onClick={() => onChange(r)} style={{
          padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: '0.75rem',
          fontWeight: value === r ? 700 : 400,
          color: value === r ? 'var(--accent)' : 'var(--text-tertiary)',
          background: value === r ? 'var(--bg-surface)' : 'transparent',
          boxShadow: value === r ? 'var(--shadow-xs)' : 'none',
          transition: 'all var(--t-fast)',
        }}>
          {r}
        </button>
      ))}
    </div>
  )
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="tooltip-card">
      <p style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.8125rem', color: '#fff' }}>{label}</p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>{rsFull(Math.round(payload[0].value))}</p>
      {payload[1] && (
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 2 }}>
          {Math.round(payload[1].value)} orders
        </p>
      )}
    </div>
  )
}

function SalesChartCard() {
  const [range, setRange] = useState<Range>('7D')
  const data = CHART_DATA[range]
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const growth = 11.5 // simulated

  return (
    <div className="card animate-fade-up delay-250" style={{ opacity: 0, animationFillMode: 'forwards' }}>
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-label" style={{ color: 'var(--text-tertiary)', marginBottom: 6 }}>Revenue</p>
            <div className="flex items-baseline gap-3">
              <span style={{
                fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.04em',
                color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
              }}>
                {rs(totalRevenue)}
              </span>
              <TrendChip value={growth} label="vs prev" />
            </div>
          </div>
          <RangeSelector value={range} onChange={setRange} />
        </div>
      </div>

      <div style={{ padding: '0 0 8px' }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border-weak)" strokeDasharray="4 4" />
            <XAxis
              dataKey="day" axisLine={false} tickLine={false} dy={8}
              tick={{ fill: 'var(--text-disabled)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
            />
            <YAxis hide domain={['dataMin - 20000', 'dataMax + 40000']} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border-base)', strokeWidth: 1.5 }} />
            <Area
              type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2}
              fill="url(#rev-grad)" dot={false}
              activeDot={{ r: 4, fill: '#22c55e', stroke: 'white', strokeWidth: 2 }}
              animationDuration={600} animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border-weak)' }}>
        {[
          { label: 'Total Orders', value: data.reduce((s, d) => s + d.orders, 0).toLocaleString() },
          { label: 'Avg. Order Value', value: rs(Math.round(totalRevenue / data.reduce((s, d) => s + d.orders, 0))) },
          { label: 'Peak Day', value: data.reduce((a, b) => a.revenue > b.revenue ? a : b).day },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            padding: '14px 16px',
            borderLeft: i > 0 ? '1px solid var(--border-weak)' : 'none',
          }}>
            <p className="text-label" style={{ color: 'var(--text-tertiary)', marginBottom: 4 }}>{stat.label}</p>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TxRow({ tx, last }: { tx: Transaction; last: boolean }) {
  const [hovered, setHovered] = useState(false)
  const { cls } = STATUS_CONFIG[tx.status]
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
        background: hovered ? 'var(--bg-subtle)' : 'transparent',
        borderBottom: last ? 'none' : '1px solid var(--border-weak)',
        transition: 'background var(--t-fast)', cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="avatar">{tx.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 1, fontFamily: 'var(--font-sans)',
        }}>{tx.name}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}>
          {tx.id} · {tx.time}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, fontFamily: 'var(--font-sans)' }}>
          {rsFull(tx.amount)}
        </p>
        <span className={cls}>{tx.status}</span>
      </div>
    </div>
  )
}

function TransactionsCard() {
  return (
    <div className="card animate-fade-up delay-300" style={{ opacity: 0, animationFillMode: 'forwards' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px 12px', borderBottom: '1px solid var(--border-weak)',
      }}>
        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
          Recent Invoices
        </p>
        <button className="btn btn-ghost" style={{ fontSize: '0.8125rem', padding: '4px 8px', gap: 4 }}>
          View all <ChevronRight size={13} />
        </button>
      </div>
      {TRANSACTIONS.map((tx, i) => (
        <TxRow key={tx.id} tx={tx} last={i === TRANSACTIONS.length - 1} />
      ))}
    </div>
  )
}

function BranchCard() {
  const max = BRANCHES[0].revenue
  return (
    <div className="card animate-fade-up delay-350" style={{ opacity: 0, animationFillMode: 'forwards' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px 12px', borderBottom: '1px solid var(--border-weak)',
      }}>
        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
          Branch Performance
        </p>
        <button className="btn-icon"><MoreHorizontal size={15} /></button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-weak)',
      }}>
        {[
          { label: 'Total Revenue', value: 'Rs. 7.97M' },
          { label: 'Active Branches', value: '5' },
          { label: 'Avg. Growth', value: '+9.7%' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '12px 16px', borderLeft: i > 0 ? '1px solid var(--border-weak)' : 'none' }}>
            <p className="text-label" style={{ color: 'var(--text-tertiary)', marginBottom: 3 }}>{s.label}</p>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ padding: '8px 0' }}>
        {BRANCHES.map((b, i) => {
          const pct = Math.round((b.revenue / max) * 100)
          return (
            <div key={b.name} style={{ padding: '10px 16px', borderTop: i > 0 ? '1px solid var(--border-weak)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                    {b.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: 8, fontFamily: 'var(--font-sans)' }}>
                    {b.orders.toLocaleString()} orders
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                    {rs(b.revenue)}
                  </span>
                  <TrendChip value={b.growth} />
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProductsCard() {
  const max = PRODUCTS[0].revenue
  return (
    <div className="card animate-fade-up delay-400" style={{ opacity: 0, animationFillMode: 'forwards' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px 12px', borderBottom: '1px solid var(--border-weak)',
      }}>
        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
          Top Products
        </p>
        <button className="btn btn-ghost" style={{ fontSize: '0.8125rem', padding: '4px 8px', gap: 4 }}>
          View all <ExternalLink size={12} />
        </button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: '16px 1fr 80px 88px 60px', gap: 10,
        padding: '8px 16px 6px', borderBottom: '1px solid var(--border-weak)',
      }}>
        {['#', 'Product', 'Share', 'Revenue', 'Δ'].map(h => (
          <span key={h} className="text-label" style={{ color: 'var(--text-disabled)' }}>{h}</span>
        ))}
      </div>

      <div style={{ padding: '4px 0 8px' }}>
        {PRODUCTS.map((p, i) => {
          const pct = Math.round((p.revenue / max) * 100)
          const [hovered, setHovered] = useState(false)
          return (
            <div
              key={p.sku}
              style={{
                display: 'grid', gridTemplateColumns: '16px 1fr 80px 88px 60px',
                gap: 10, padding: '9px 16px',
                background: hovered ? 'var(--bg-subtle)' : 'transparent',
                transition: 'background var(--t-fast)', cursor: 'default', alignItems: 'center',
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-disabled)', fontFamily: 'var(--font-sans)' }}>
                {i + 1}
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                }}>{p.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-sans)' }}>
                  {p.units.toLocaleString()} units
                </p>
              </div>
              <div>
                <div className="progress-track" style={{ height: 4 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span style={{
                fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)',
                textAlign: 'right', fontFamily: 'var(--font-sans)',
              }}>
                {rs(p.revenue)}
              </span>
              <TrendChip value={p.delta} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LowStockAlert() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <div className="animate-fade-up delay-50" style={{
      opacity: 0, animationFillMode: 'forwards',
      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
      background: 'var(--warning-subtle)',
      border: '1px solid var(--warning-border)',
      borderRadius: 'var(--r-md)', marginBottom: 20,
    }}>
      <AlertTriangle size={14} style={{ color: 'var(--warning)', flexShrink: 0 }} />
      <p style={{ fontSize: '0.875rem', color: 'var(--warning-text)', flex: 1, fontFamily: 'var(--font-sans)' }}>
        <strong>12 products</strong> are below reorder level — 3 are critically out of stock.
      </p>
      <button className="btn" style={{
        fontSize: '0.8125rem', padding: '4px 12px',
        background: 'var(--warning)', color: 'white', borderRadius: 'var(--r-sm)',
        fontFamily: 'var(--font-sans)',
      }}>
        Review Stock
      </button>
      <button className="btn-icon" onClick={() => setDismissed(true)} style={{ color: 'var(--warning)' }}>
        ×
      </button>
    </div>
  )
}

// ─── MAIN DASHBOARD PAGE ───────────────────────────────────

export function DashboardPage() {
  const { t } = useTranslation()
  const [refreshing, setRefreshing] = useState(false)
  const { darkMode, toggleDarkMode } = useSettingsStore()

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }, [])

  const KPI_DATA: KpiData[] = [
    {
      label: "Today's Revenue",
      value: rsFull(287500),
      delta: '12.5', deltaLabel: 'vs yesterday', trend: 'up',
      icon: TrendingUp,
      iconColor: 'var(--success)', iconBg: 'var(--success-subtle)',
    },
    {
      label: 'Total Orders',
      value: '47',
      delta: '8', deltaLabel: 'more than avg', trend: 'up',
      icon: ShoppingCart,
      iconColor: 'var(--info)', iconBg: 'var(--info-subtle)',
    },
    {
      label: 'Outstanding',
      value: 'Rs. 1.25M',
      delta: '5.2', deltaLabel: 'reduction', trend: 'up',
      icon: CreditCard,
      iconColor: 'var(--warning)', iconBg: 'var(--warning-subtle)',
    },
    {
      label: 'Low Stock Items',
      value: '12',
      delta: '3', deltaLabel: 'critical', trend: 'down',
      icon: Package,
      iconColor: 'var(--danger)', iconBg: 'var(--danger-subtle)',
    },
  ]

  return (
      <div className="dot-background" style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        padding: '28px',
        maxWidth: 1400,
        margin: '0 auto',
        transition: 'background var(--t-base)',
        position: 'relative',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Page header */}
          <div className="page-header animate-fade-up" style={{ animationFillMode: 'forwards', opacity: 0 }}>
            <div>
              <h1 className="page-title">{t('dashboard.title', 'Dashboard')}</h1>
              <p className="page-subtitle">Sunday, April 6 · Colombo HQ</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Dark mode toggle */}
              <button
                className="btn btn-secondary"
                onClick={toggleDarkMode}
                style={{ gap: 6 }}
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <Sun size={13} /> : <Moon size={13} />}
                {darkMode ? 'Light' : 'Dark'}
              </button>
              <button className="btn btn-secondary" onClick={handleRefresh} style={{ gap: 6 }}>
                <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
              <button className="btn btn-primary">
                <ShoppingCart size={13} />
                New Sale
              </button>
            </div>
          </div>

          <LowStockAlert />

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
            {KPI_DATA.map((kpi, i) => (
              <KpiCard key={kpi.label} kpi={kpi} delay={(i + 1) * 50} />
            ))}
          </div>

          {/* Chart + Transactions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, marginBottom: 16 }}>
            <SalesChartCard />
            <TransactionsCard />
          </div>

          {/* Branches + Products */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <BranchCard />
            <ProductsCard />
          </div>
      </div>
    </div>
  )
}

export default DashboardPage