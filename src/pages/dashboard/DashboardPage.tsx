/**
 * CeylonMart – Premium Dashboard
 *
 * FULLY SELF-CONTAINED — zero Tailwind config dependency.
 * Every style is inline. Drop this file in and it works immediately.
 *
 * Dependencies (must be installed):
 *   npm install recharts lucide-react react-i18next
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  TrendingUp, ShoppingCart, AlertTriangle, CreditCard,
  ArrowUpRight, ArrowDownRight, ChevronRight, MoreHorizontal,
  Search, Bell, User, Package,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  surface: '#fdfdfd',
  page: '#edeef0',
  pageDark: '#e2e4e7',
  border: '#d2d6db',
  borderLight: '#e8eaec',
  muted: '#b7bac3',
  sub: '#8892a9',
  accent: '#845c58',
  accentHover: '#7a5450',
  accentLight: '#f5efee',
  accentMid: '#c9a09c',
  ink: '#18181b',
  inkSoft: '#3f3f46',
  green: '#2d7a5a',
  greenLight: '#eaf4ef',
  red: '#c0392b',
  redLight: '#fdf0ef',
  amber: '#a16207',
  amberLight: '#fefce8',
  white: '#ffffff',
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: C.white,
  border: `1px solid ${C.borderLight}`,
  borderRadius: 16,
  padding: '20px 22px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.03)',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  color: C.sub,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  margin: 0,
}

const valueStyle: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 650,
  letterSpacing: '-0.03em',
  color: C.ink,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  lineHeight: 1.1,
  margin: 0,
}

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: C.ink,
  letterSpacing: '-0.01em',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  margin: 0,
}

const bodyText: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
}

const pill = (color: string, bg: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  fontSize: 11,
  fontWeight: 600,
  padding: '3px 8px',
  borderRadius: 20,
  color,
  background: bg,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  letterSpacing: '0.01em',
  whiteSpace: 'nowrap' as const,
})

// ─── DATA ─────────────────────────────────────────────────────────────────────
const salesData = [
  { day: 'Sun', sales: 42000 },
  { day: 'Mon', sales: 58000 },
  { day: 'Tue', sales: 125000 },
  { day: 'Wed', sales: 85000 },
  { day: 'Thu', sales: 95000 },
  { day: 'Fri', sales: 110000 },
  { day: 'Sat', sales: 88000 },
]

const products = [
  { name: 'Maldive Fish (500g)', units: 1200, revenue: 485000, trend: 12.5 },
  { name: 'Ceylon Tea – Premium', units: 980, revenue: 385000, trend: 8.3 },
  { name: 'Coconut Oil (1L)', units: 850, revenue: 320000, trend: -2.1 },
  { name: 'Rice – Nadu (5kg)', units: 720, revenue: 285000, trend: 5.7 },
  { name: 'Sugar (1kg)', units: 690, revenue: 245000, trend: 3.2 },
]

type TxStatus = 'Paid' | 'Pending' | 'Overdue'
const transactions: { id: string; name: string; amount: number; ago: string; status: TxStatus }[] = [
  { id: 'INV-0847', name: 'Perera Stores', amount: 12500, ago: '2 min ago', status: 'Paid' },
  { id: 'INV-0846', name: 'Walk-in Customer', amount: 3200, ago: '15 min ago', status: 'Pending' },
  { id: 'INV-0845', name: 'Silva Pharmacy', amount: 45000, ago: '32 min ago', status: 'Overdue' },
  { id: 'INV-0844', name: 'Colombo Grocers', amount: 31000, ago: '1 hr ago', status: 'Paid' },
]

const branches = [
  { name: 'Colombo HQ', revenue: 2970000 },
  { name: 'Kandy', revenue: 1850000 },
  { name: 'Galle', revenue: 1420000 },
  { name: 'Jaffna', revenue: 970000 },
  { name: 'Matara', revenue: 760000 },
]

const navSections = [
  { heading: 'Core', items: ['Dashboard', 'Point of Sale', 'Inventory', 'Sales', 'Purchases', 'Customers', 'Suppliers'] },
  { heading: 'Finance', items: ['Accounting', 'General Ledger', 'VAT Report', 'Reconciliation'] },
  { heading: 'HR', items: ['Employees', 'Payroll', 'Salary Advances'] },
  { heading: 'Analytics', items: ['Reports', 'Sales Analytics'] },
  { heading: 'System', items: ['Branches', 'Settings'] },
]

// ─── UTILS ────────────────────────────────────────────────────────────────────
const rs = (n: number) =>
  'Rs. ' + n.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const statusStyle = (s: TxStatus) => ({
  Paid: { color: C.green, bg: C.greenLight },
  Pending: { color: C.amber, bg: C.amberLight },
  Overdue: { color: C.red, bg: C.redLight },
}[s])

// ─── ATOM: AVATAR ─────────────────────────────────────────────────────────────
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: C.accentLight, color: C.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
      ...bodyText,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

// ─── ATOM: ICON BUTTON ────────────────────────────────────────────────────────
function IconBtn({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(false)
  return (
    <button
      style={{
        width: 34, height: 34, borderRadius: 10, border: 'none',
        background: h ? C.pageDark : C.page,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: C.sub, transition: 'background 0.15s',
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      {children}
    </button>
  )
}

// ─── COMPONENT: KPI CARD ─────────────────────────────────────────────────────
interface KpiProps {
  label: string
  value: string
  delta: string
  up: boolean | null
  icon: React.ReactNode
}

function KpiCard({ label, value, delta, up, icon }: KpiProps) {
  const [hovered, setHovered] = useState(false)
  const tColor = up === null ? C.sub : up ? C.green : C.red
  const tBg = up === null ? C.page : up ? C.greenLight : C.redLight

  return (
    <div
      style={{
        ...card,
        cursor: 'default',
        transition: 'box-shadow 0.18s, transform 0.18s',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 6px 20px rgba(0,0,0,0.09)'
          : '0 1px 2px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <p style={labelStyle}>{label}</p>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: C.accentLight, color: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <p style={{ ...valueStyle, marginBottom: 10 }}>{value}</p>

      {/* Delta */}
      <span style={pill(tColor, tBg)}>
        {up === true && <ArrowUpRight size={11} />}
        {up === false && <ArrowDownRight size={11} />}
        {delta}
      </span>
    </div>
  )
}

// ─── COMPONENT: CHART TOOLTIP ─────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: C.ink, color: C.white,
      borderRadius: 10, padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      ...bodyText, fontSize: 12,
    }}>
      <p style={{ fontWeight: 600, margin: '0 0 2px' }}>{label}</p>
      <p style={{ color: C.muted, margin: 0 }}>{rs(payload[0].value)}</p>
    </div>
  )
}

// ─── COMPONENT: SALES CHART CARD ──────────────────────────────────────────────
type Range = 'Week' | 'Month' | '3M'

function SalesChartCard() {
  const [range, setRange] = useState<Range>('Week')
  return (
    <div style={card}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <h3 style={{ ...sectionTitle, marginBottom: 5 }}>Sales Tracker</h3>
          <p style={{ ...bodyText, fontSize: 12, color: C.sub, lineHeight: 1.55, maxWidth: 360, margin: 0 }}>
            Track revenue changes over time across all branches and payment channels.
          </p>
        </div>
        {/* Range selector */}
        <div style={{ display: 'flex', gap: 2, padding: 3, background: C.page, borderRadius: 10, flexShrink: 0 }}>
          {(['Week', 'Month', '3M'] as Range[]).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '5px 12px', borderRadius: 8,
                border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: range === r ? 600 : 400,
                ...bodyText,
                background: range === r ? C.white : 'transparent',
                color: range === r ? C.ink : C.sub,
                boxShadow: range === r ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Hero number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
        <span style={{ ...bodyText, fontSize: 36, fontWeight: 700, color: C.ink, letterSpacing: '-0.04em' }}>
          +12.5%
        </span>
        <span style={{ ...bodyText, fontSize: 13, color: C.sub }}>vs last {range.toLowerCase()}</span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={185}>
        <LineChart data={salesData} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={C.borderLight} strokeDasharray="5 5" />
          <XAxis
            dataKey="day"
            axisLine={false} tickLine={false}
            tick={{ fill: C.muted, fontSize: 11, fontFamily: 'system-ui, sans-serif' }}
            dy={8}
          />
          <YAxis hide domain={['dataMin - 20000', 'dataMax + 30000']} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.borderLight, strokeWidth: 1 }} />
          <Line
            type="monotone" dataKey="sales"
            stroke={C.accent} strokeWidth={2.5} dot={false}
            activeDot={{ r: 5, fill: C.accent, stroke: C.white, strokeWidth: 2 }}
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── COMPONENT: TRANSACTION ROW ───────────────────────────────────────────────
function TxRow({ tx, last }: { tx: typeof transactions[0]; last: boolean }) {
  const [h, setH] = useState(false)
  const { color, bg } = statusStyle(tx.status)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 8px',
        borderRadius: 10,
        background: h ? C.page : 'transparent',
        borderBottom: last ? 'none' : `1px solid ${C.borderLight}`,
        transition: 'background 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <Avatar name={tx.name} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ ...bodyText, fontSize: 13, fontWeight: 500, color: C.ink, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {tx.name}
        </p>
        <p style={{ ...bodyText, fontSize: 11, color: C.sub, margin: 0 }}>
          {tx.id} · {tx.ago}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span style={{ ...bodyText, fontSize: 13, fontWeight: 600, color: C.ink }}>{rs(tx.amount)}</span>
        <span style={pill(color, bg)}>{tx.status}</span>
      </div>
    </div>
  )
}

// ─── COMPONENT: TRANSACTIONS PANEL ────────────────────────────────────────────
function TransactionsPanel() {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={sectionTitle}>Recent Invoices</h3>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 3,
          fontSize: 12, color: C.accent, background: 'none',
          border: 'none', cursor: 'pointer', fontWeight: 500,
          ...bodyText, padding: 0,
        }}>
          See all <ChevronRight size={13} />
        </button>
      </div>
      {transactions.map((tx, i) => (
        <TxRow key={tx.id} tx={tx} last={i === transactions.length - 1} />
      ))}
    </div>
  )
}

// ─── COMPONENT: BRANCH CARD ───────────────────────────────────────────────────
function BranchCard() {
  const max = branches[0].revenue
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={sectionTitle}>Branch Performance</h3>
        <button style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 0 }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Summary strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
        background: C.page, borderRadius: 12, padding: '12px 0', marginBottom: 22,
      }}>
        {[
          { lbl: 'Total Revenue', val: 'Rs. 7.97M' },
          null,
          { lbl: 'Branches', val: '5' },
          null,
          { lbl: 'Growth', val: '+9.1%' },
        ].map((item, i) =>
          item === null
            ? <div key={i} style={{ background: C.border }} />
            : (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ ...bodyText, fontSize: 10, color: C.sub, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>
                  {item.lbl}
                </span>
                <span style={{ ...bodyText, fontSize: 15, fontWeight: 650, color: C.ink, letterSpacing: '-0.02em' }}>
                  {item.val}
                </span>
              </div>
            )
        )}
      </div>

      {/* Branch rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {branches.map(b => {
          const pct = Math.round((b.revenue / max) * 100)
          return (
            <div key={b.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ ...bodyText, fontSize: 13, color: C.inkSoft }}>{b.name}</span>
                <span style={{ ...bodyText, fontSize: 13, fontWeight: 600, color: C.ink }}>{rs(b.revenue)}</span>
              </div>
              <div style={{ height: 6, background: C.page, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: C.accent, borderRadius: 4, transition: 'width 0.7s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── COMPONENT: PRODUCT ROW ───────────────────────────────────────────────────
function ProductRow({ p, rank, max }: { p: typeof products[0]; rank: number; max: number }) {
  const [h, setH] = useState(false)
  const pct = Math.round((p.revenue / max) * 100)
  const tColor = p.trend > 0 ? C.green : C.red
  const tBg = p.trend > 0 ? C.greenLight : C.redLight
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: '20px 1fr 110px 90px 58px',
        gap: 12, padding: '10px 10px', alignItems: 'center',
        borderRadius: 10, background: h ? C.page : 'transparent', transition: 'background 0.12s',
        cursor: 'default',
      }}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
    >
      <span style={{ ...bodyText, fontSize: 12, fontWeight: 500, color: C.muted }}>{rank}</span>
      <div style={{ minWidth: 0 }}>
        <p style={{ ...bodyText, fontSize: 13, fontWeight: 500, color: C.ink, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {p.name}
        </p>
        <p style={{ ...bodyText, fontSize: 11, color: C.sub, margin: 0 }}>{p.units.toLocaleString()} units</p>
      </div>
      <div style={{ height: 5, background: C.borderLight, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: C.accent, borderRadius: 3 }} />
      </div>
      <span style={{ ...bodyText, fontSize: 13, fontWeight: 600, color: C.ink, textAlign: 'right' }}>
        {rs(p.revenue)}
      </span>
      <span style={{ ...pill(tColor, tBg), justifyContent: 'flex-end' }}>
        {p.trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
        {p.trend > 0 ? '+' : ''}{p.trend}%
      </span>
    </div>
  )
}

// ─── COMPONENT: PRODUCTS CARD ─────────────────────────────────────────────────
function ProductsCard() {
  const max = products[0].revenue
  const [btnH, setBtnH] = useState(false)

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={sectionTitle}>Top Products</h3>
        <button style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 0 }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '20px 1fr 110px 90px 58px',
        gap: 12, padding: '0 10px 10px', borderBottom: `1px solid ${C.borderLight}`, marginBottom: 4,
      }}>
        {['#', 'Product', 'Share', 'Revenue', 'Trend'].map(h => (
          <span key={h} style={{
            ...bodyText, fontSize: 10, fontWeight: 500, color: C.muted,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            textAlign: (h === 'Revenue' || h === 'Trend') ? 'right' as const : 'left' as const,
          }}>
            {h}
          </span>
        ))}
      </div>

      {products.map((p, i) => <ProductRow key={p.name} p={p} rank={i + 1} max={max} />)}

      <button
        style={{
          width: '100%', marginTop: 14, padding: '10px 0',
          borderRadius: 10, border: `1px solid ${C.borderLight}`,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all 0.15s',
          background: btnH ? C.pageDark : C.page,
          color: btnH ? C.inkSoft : C.sub,
          ...bodyText,
        }}
        onMouseEnter={() => setBtnH(true)}
        onMouseLeave={() => setBtnH(false)}
      >
        View Complete Inventory <ChevronRight size={13} />
      </button>
    </div>
  )
}

// ─── COMPONENT: TOP BAR ───────────────────────────────────────────────────────
function TopBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '11px 22px',
      background: C.white, borderBottom: `1px solid ${C.borderLight}`,
      flexShrink: 0,
    }}>
      <div style={{
        flex: 1, maxWidth: 320,
        display: 'flex', alignItems: 'center', gap: 8,
        background: C.page, border: `1px solid ${C.borderLight}`,
        borderRadius: 10, padding: '8px 12px',
      }}>
        <Search size={13} style={{ color: C.muted, flexShrink: 0 }} />
        <span style={{ ...bodyText, fontSize: 13, color: C.muted }}>Enter your search request...</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconBtn><Bell size={15} /></IconBtn>
        <IconBtn><User size={15} /></IconBtn>
      </div>
    </div>
  )
}

// ─── COMPONENT: SIDEBAR ───────────────────────────────────────────────────────
const navIcons: Record<string, React.ReactNode> = {
  Dashboard: <TrendingUp size={14} />,
  Inventory: <Package size={14} />,
  Sales: <ShoppingCart size={14} />,
  Purchases: <CreditCard size={14} />,
  Customers: <User size={14} />,
}

function Sidebar({ active = 'Dashboard' }: { active?: string }) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div style={{
      width: 200, flexShrink: 0,
      background: C.white,
      borderRight: `1px solid ${C.borderLight}`,
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '18px 16px 16px', borderBottom: `1px solid ${C.borderLight}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: C.accent, color: C.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700, ...bodyText,
        }}>C</div>
        <span style={{ ...bodyText, fontSize: 15, fontWeight: 600, color: C.ink, letterSpacing: '-0.02em' }}>
          CeylonMart
        </span>
      </div>

      {/* Nav */}
      <nav style={{ padding: '6px 8px', flex: 1 }}>
        {navSections.map(section => (
          <div key={section.heading} style={{ marginBottom: 4 }}>
            <p style={{
              ...bodyText, fontSize: 9.5, fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              color: C.muted, padding: '10px 8px 4px', margin: 0,
            }}>
              {section.heading}
            </p>
            {section.items.map(item => {
              const isActive = item === active
              const isHovered = item === hovered && !isActive
              return (
                <div
                  key={item}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 8, margin: '1px 0',
                    background: isActive ? C.accentLight : isHovered ? C.page : 'transparent',
                    color: isActive ? C.accent : C.sub,
                    cursor: 'pointer',
                    fontSize: 13, fontWeight: isActive ? 500 : 400,
                    ...bodyText, transition: 'background 0.12s, color 0.12s',
                  }}
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {navIcons[item] && (
                    <span style={{ opacity: isActive ? 1 : 0.6, display: 'flex' }}>
                      {navIcons[item]}
                    </span>
                  )}
                  {item}
                </div>
              )
            })}
          </div>
        ))}
      </nav>
    </div>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const { t } = useTranslation()

  const kpis: KpiProps[] = [
    {
      label: t('dashboard.todays_sales', "Today's Sales"),
      value: rs(287500),
      delta: '+12.5%',
      up: true,
      icon: <TrendingUp size={15} />,
    },
    {
      label: t('dashboard.total_orders', 'Total Orders'),
      value: '47',
      delta: '+8 today',
      up: true,
      icon: <ShoppingCart size={15} />,
    },
    {
      label: t('dashboard.low_stock', 'Low Stock Items'),
      value: '12',
      delta: '3 critical',
      up: false,
      icon: <AlertTriangle size={15} />,
    },
    {
      label: t('dashboard.receivables', 'Outstanding'),
      value: rs(1250000),
      delta: '−5.2%',
      up: false,
      icon: <CreditCard size={15} />,
    },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>

      {/* ROW 1 — KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {kpis.map(k => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* ROW 2 — Chart + Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
        <SalesChartCard />
        <TransactionsPanel />
      </div>

      {/* ROW 3 — Branches + Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <BranchCard />
        <ProductsCard />
      </div>

    </div>
  )
}

export default DashboardPage