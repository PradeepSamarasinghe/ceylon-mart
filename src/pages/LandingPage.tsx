/**
 * Ceylon Mart — Premium 3D Landing Page
 * Pure CSS 3D + React hooks — no Three.js, no GSAP overhead
 * Effects: mouse parallax hero, 3D tilt cards, scroll reveals,
 *          floating product UI, network canvas background, glass morphism
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate } from 'react-router-dom'
import {
  Package, Boxes, Calculator, Users, Play, CheckCircle2,
  ChevronDown, ShoppingCart, Sun, Moon, ArrowRight,
  TrendingUp, Zap, Shield, Globe, BarChart3, Layers,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'

// ─── HOOKS ─────────────────────────────────────────────────────────────────

/** Global mouse position, normalized -1 to 1 */
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      })
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

/** 3D tilt based on mouse within element */
function useTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 50, gy: 50 })
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / (rect.width / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        setTilt({
          x: -dy * strength,
          y: dx * strength,
          gx: ((e.clientX - rect.left) / rect.width) * 100,
          gy: ((e.clientY - rect.top) / rect.height) * 100,
        })
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frameRef.current)
      setTilt({ x: 0, y: 0, gx: 50, gy: 50 })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(frameRef.current)
    }
  }, [strength])

  return { ref, tilt }
}

/** Scroll-based reveal with IntersectionObserver */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── NETWORK CANVAS (REPLICA) ───────────────────────────────────
function NetworkCanvas({ dark }: { dark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const stateRef = useRef<{ nodes: any[], W: number, H: number }>({ nodes: [], W: 0, H: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const s = stateRef.current

    const NODE_COUNT = () => Math.min(100, Math.floor((s.W * s.H) / 13000))
    const MAX_DIST = 155
    const SPEED = 0.30
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const randV = () => (Math.random() - 0.5) * SPEED * 2

    // Emerald Green theme (Ceylon Mart)
    let DOT_RGB = dark ? '34,197,94' : '16,163,74'
    let LINE_RGB = dark ? '34,197,94' : '16,163,74'

    function buildNodes() {
      s.nodes = Array.from({ length: NODE_COUNT() }, () => ({
        x: rand(0, s.W),
        y: rand(0, s.H),
        vx: randV(),
        vy: randV(),
        r: rand(1.3, 2.6),
        op: rand(0.20, 0.65),
        phase: rand(0, Math.PI * 2),
        freq: rand(0.006, 0.014),
      }))
    }

    function resize() {
      const canv = canvasRef.current
      if (!canv) return
      s.W = canv.width = window.innerWidth
      s.H = canv.height = window.innerHeight
      buildNodes()
    }

    function frame() {
      const c = canvasRef.current
      const cx = c?.getContext('2d')
      if (!c || !cx) return

      cx.clearRect(0, 0, s.W, s.H)
      const ns = s.nodes

      for (const n of ns) {
        n.x += n.vx; n.y += n.vy
        if (n.x < -20) n.x = s.W + 20
        if (n.x > s.W + 20) n.x = -20
        if (n.y < -20) n.y = s.H + 20
        if (n.y > s.H + 20) n.y = -20
      }

      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const dx = ns[i].x - ns[j].x
          const dy = ns[i].y - ns[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * (dark ? 0.20 : 0.13)
            cx.beginPath()
            cx.moveTo(ns[i].x, ns[i].y)
            cx.lineTo(ns[j].x, ns[j].y)
            cx.strokeStyle = `rgba(${LINE_RGB},${a.toFixed(3)})`
            cx.lineWidth = 0.75
            cx.stroke()
          }
        }
      }

      for (const n of ns) {
        n.phase += n.freq
        const tw = 0.55 + Math.sin(n.phase) * 0.45
        const op = n.op * tw

        const g = cx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4.5)
        g.addColorStop(0, `rgba(${DOT_RGB},${(op * 0.40).toFixed(3)})`)
        g.addColorStop(1, `rgba(${DOT_RGB},0)`)
        cx.beginPath()
        cx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2)
        cx.fillStyle = g
        cx.fill()

        cx.beginPath()
        cx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        cx.fillStyle = `rgba(${DOT_RGB},${op.toFixed(3)})`
        cx.fill()
      }

      rafRef.current = requestAnimationFrame(frame)
    }

    DOT_RGB = dark ? '34,197,94' : '16,163,74'
    LINE_RGB = dark ? '34,197,94' : '16,163,74'

    window.addEventListener('resize', resize)
    resize()
    frame()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [dark])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zLayer: 0,
        pointerEvents: 'none',
        opacity: dark ? 1 : 0.75,
        transition: 'opacity 0.4s',
        zIndex: 0,
      } as React.CSSProperties}
    />
  )
}

// ─── PRIMITIVE COMPONENTS ──────────────────────────────────────────────────

/** 3D tilt card wrapper */
function TiltCard({
  children, className, style, strength = 10
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  strength?: number
}) {
  const { ref, tilt } = useTilt(strength)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        transition: 'transform 0.18s cubic-bezier(0.23, 1, 0.32, 1)',
        willChange: 'transform',
        // Subtle glare effect
        '--gx': `${tilt.gx}%`,
        '--gy': `${tilt.gy}%`,
      } as React.CSSProperties}
    >
      {/* Glare layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        background: `radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.10) 0%, transparent 60%)`,
        pointerEvents: 'none',
        zIndex: 10,
        transition: 'opacity 0.2s',
      }} />
      {children}
    </div>
  )
}

/** Scroll-reveal wrapper */
function Reveal({
  children, delay = 0, direction = 'up', style
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
  style?: React.CSSProperties
}) {
  const { ref, inView } = useInView()
  const transforms: Record<string, string> = {
    up: 'translateY(40px)',
    left: 'translateX(-40px)',
    right: 'translateX(40px)',
    scale: 'scale(0.92)',
  }
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

// ─── HERO PRODUCT VISUAL ───────────────────────────────────────────────────

/** The floating 3D product UI preview */
function HeroVisual({ dark }: { dark: boolean }) {
  const { ref, tilt } = useTilt(8)

  const surface = dark ? 'rgba(20,20,20,0.75)' : 'rgba(255,255,255,0.75)'
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const textMain = dark ? '#f1f5f9' : '#0f172a'
  const textMuted = dark ? '#64748b' : '#94a3b8'
  const subtle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 520,
      perspective: 1200,
      animation: 'heroFloat 6s ease-in-out infinite',
    }}>
      {/* Shadow glow beneath card */}
      <div style={{
        position: 'absolute',
        bottom: -30,
        left: '10%',
        right: '10%',
        height: 60,
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.30) 0%, transparent 70%)',
        filter: 'blur(16px)',
        borderRadius: '50%',
      }} />

      {/* Main dashboard card */}
      <div
        ref={ref}
        style={{
          background: surface,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${border}`,
          borderRadius: 20,
          padding: 20,
          boxShadow: dark
            ? '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 32px 80px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
          transformStyle: 'preserve-3d',
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
          willChange: 'transform',
        }}
      >
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#22c55e', marginBottom: 2 }}>
              Colombo Branch
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: textMain, letterSpacing: '-0.04em', fontFamily: "'DM Sans', sans-serif" }}>
              Rs. 2.87M
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: 'rgba(34,197,94,0.12)',
            borderRadius: 999, border: '1px solid rgba(34,197,94,0.20)',
          }}>
            <TrendingUp size={12} color="#22c55e" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>+14.2%</span>
          </div>
        </div>

        {/* Mini chart */}
        <div style={{ marginBottom: 16, position: 'relative' }}>
          <svg viewBox="0 0 460 80" style={{ width: '100%', height: 64, display: 'block', overflow: 'visible' }}>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path
              d="M0,60 C30,55 60,40 100,35 C140,30 170,45 210,38 C250,31 280,20 320,18 C360,16 400,25 460,10"
              fill="url(#chartGrad)"
              stroke="none"
            />
            <path
              d="M0,60 C30,55 60,40 100,35 C140,30 170,45 210,38 C250,31 280,20 320,18 C360,16 400,25 460,10"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              filter="url(#glow)"
              style={{ animation: 'drawLine 2s ease forwards' }}
              strokeDasharray="800"
              strokeDashoffset="800"
            />
            {/* Active dot */}
            <circle cx="460" cy="10" r="4" fill="#22c55e" opacity="0.9">
              <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Metric row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14,
        }}>
          {[
            { label: 'Orders', value: '1,420', delta: '+89' },
            { label: 'Avg Value', value: 'Rs. 2.1K', delta: '+12%' },
            { label: 'Branches', value: '5', delta: 'Active' },
          ].map((m) => (
            <div key={m.label} style={{
              padding: '10px 12px',
              background: subtle,
              borderRadius: 10,
              border: `1px solid ${border}`,
            }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: textMuted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                {m.label}
              </p>
              <p style={{ fontSize: 15, fontWeight: 800, color: textMain, fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.02em' }}>
                {m.value}
              </p>
              <p style={{ fontSize: 10, color: '#22c55e', fontWeight: 600, marginTop: 2 }}>{m.delta}</p>
            </div>
          ))}
        </div>

        {/* Branch bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            { name: 'Colombo ', pct: 100, rev: '2.97M' },
            { name: 'Kandy Branch', pct: 62, rev: '1.85M' },
            { name: 'Galle Branch', pct: 48, rev: '1.42M' },
          ].map((b, i) => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: textMuted, width: 76, flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
                {b.name}
              </span>
              <div style={{ flex: 1, height: 4, background: subtle, borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${b.pct}%`,
                  background: `linear-gradient(90deg, #22c55e, #4ade80)`,
                  borderRadius: 99,
                  animation: `barGrow 1.2s ${i * 0.15}s cubic-bezier(0.23,1,0.32,1) both`,
                  transformOrigin: 'left',
                }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: textMain, width: 42, textAlign: 'right', fontFamily: "'DM Sans', sans-serif" }}>
                {b.rev}
              </span>
            </div>
          ))}
        </div>

        {/* Glare overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
          borderRadius: '20px 20px 0 0',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Floating badge card — top right */}
      <div style={{
        position: 'absolute',
        top: -18,
        right: -20,
        padding: '10px 14px',
        background: dark ? 'rgba(15,15,15,0.9)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${border}`,
        borderRadius: 14,
        boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', gap: 9,
        animation: 'floatBadge1 4s ease-in-out infinite',
        willChange: 'transform',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(34,197,94,0.4)',
        }}>
          <Zap size={15} color="#fff" fill="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 10, color: textMuted, fontWeight: 600 }}>New Sale</p>
          <p style={{ fontSize: 13, color: textMain, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>Rs. 45,000</p>
        </div>
      </div>

      {/* Floating badge card — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: -16,
        left: -24,
        padding: '10px 14px',
        background: dark ? 'rgba(15,15,15,0.9)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${border}`,
        borderRadius: 14,
        boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.6)' : '0 12px 40px rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', gap: 9,
        animation: 'floatBadge2 5s 1s ease-in-out infinite',
        willChange: 'transform',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'rgba(34,197,94,0.12)',
          border: '1px solid rgba(34,197,94,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={15} color="#22c55e" />
        </div>
        <div>
          <p style={{ fontSize: 10, color: textMuted, fontWeight: 600 }}>Stock Alert</p>
          <p style={{ fontSize: 13, color: textMain, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>3 Critical</p>
        </div>
      </div>
    </div>
  )
}

// ─── FEATURE CARD ──────────────────────────────────────────────────────────

interface FeatureItem {
  icon: React.ComponentType<{ size?: number; color?: string }>
  title: string
  desc: string
  accent: string
  delay: number
}

function FeatureCard({ feat, dark }: { feat: FeatureItem; dark: boolean }) {
  const { ref, tilt } = useTilt(7)
  const surface = dark ? 'rgba(20,20,20,0.8)' : 'rgba(255,255,255,0.85)'
  const border = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'
  const textMain = dark ? '#f1f5f9' : '#0f172a'
  const textMuted = dark ? '#64748b' : '#94a3b8'

  return (
    <Reveal delay={feat.delay}>
      <div
        ref={ref}
        style={{
          background: surface,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${border}`,
          borderRadius: 18,
          padding: '24px',
          transformStyle: 'preserve-3d',
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.18s cubic-bezier(0.23,1,0.32,1), box-shadow 0.18s ease, border-color 0.18s ease',
          boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)',
          cursor: 'default',
          willChange: 'transform',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = dark
            ? `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${feat.accent}33`
            : `0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px ${feat.accent}40`
          e.currentTarget.style.borderColor = `${feat.accent}50`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)'
          e.currentTarget.style.borderColor = border
        }}
      >
        {/* Accent glow corner */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${feat.accent}25 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${feat.accent}20, ${feat.accent}08)`,
          border: `1px solid ${feat.accent}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          boxShadow: `0 4px 12px ${feat.accent}20`,
        }}>
          <feat.icon size={20} color={feat.accent} />
        </div>

        <h3 style={{
          fontSize: '1rem',
          fontWeight: 800,
          color: textMain,
          letterSpacing: '-0.02em',
          marginBottom: 8,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {feat.title}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: textMuted,
          lineHeight: 1.65,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {feat.desc}
        </p>

        {/* Glare */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${feat.accent}30, transparent)`,
        }} />
      </div>
    </Reveal>
  )
}

// ─── NAV ITEM ──────────────────────────────────────────────────────────────

function NavItem({ label, hasDropdown, color }: { label: string; hasDropdown?: boolean; color: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        color: hov ? '#22c55e' : color,
        transition: 'color 0.15s',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </span>
      {hasDropdown && (
        <ChevronDown
          size={13}
          color={hov ? '#22c55e' : color}
          style={{ transition: 'color 0.15s, transform 0.15s', transform: hov ? 'rotate(-180deg)' : 'rotate(0deg)' }}
        />
      )}
    </div>
  )
}

// ─── MAIN LANDING PAGE ─────────────────────────────────────────────────────

export function LandingPage() {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  const { darkMode: dark, toggleDarkMode: setDark } = useSettingsStore()
  const mouse = useMouse()

  // Detect reduced-motion
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  // Theme tokens mapped to global CSS variables
  const bg = 'var(--bg-base)'
  const textPrimary = 'var(--text-primary)'
  const textSecondary = 'var(--text-secondary)'
  const cardBg = 'var(--bg-surface)'
  const cardBorder = 'var(--border-weak)'
  const navBg = 'var(--bg-surface)'

  // Parallax depth multipliers (disabled on reduced-motion)
  const px = prefersReduced ? 0 : mouse.x
  const py = prefersReduced ? 0 : mouse.y

  const FEATURES: FeatureItem[] = [
    { icon: ShoppingCart, title: 'Smart POS', desc: 'Lightning-fast checkout with LankaQR, PayHere, and cash handling built-in.', accent: '#22c55e', delay: 0 },
    { icon: Package, title: 'Live Inventory', desc: 'Real-time stock tracking across all branches with smart reorder alerts.', accent: '#3b82f6', delay: 80 },
    { icon: Boxes, title: 'Stock Control', desc: 'Batch management, expiry tracking, and supplier ordering in one place.', accent: '#8b5cf6', delay: 160 },
    { icon: Calculator, title: 'Accounting', desc: 'Automated bookkeeping, tax compliance, and financial reporting for LKR.', accent: '#f59e0b', delay: 240 },
    { icon: Users, title: 'HR & Payroll', desc: 'Employee management, shift scheduling, and payroll processing simplified.', accent: '#ec4899', delay: 320 },
    { icon: Globe, title: 'Multi-Branch', desc: 'Manage every location from one dashboard. Real-time sync, always.', accent: '#06b6d4', delay: 400 },
  ]

  return (
    <div className="land" style={{
      minHeight: '100vh',
      background: bg,
      fontFamily: "var(--font-sans)",
      transition: 'background var(--t-base)',
      overflowX: 'hidden',
      position: 'relative',
    }}>
      {/* ── BACKGROUND ANIMATION (Network Canvas) ── */}
      <NetworkCanvas dark={dark} />

      {/* ── HERO RADIAL OVERLAY ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background: `radial-gradient(ellipse 85% 50% at 50% -5%, rgba(34,197,94,${dark ? '0.08' : '0.07'}) 0%, transparent 62%)`,
        transition: 'background 0.35s',
      }} />

      {/* ── NAVIGATION ── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 48px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: navBg,
        borderBottom: `1px solid ${cardBorder}`,
        transition: 'background 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(34,197,94,0.40)',
            }}>
              <ShoppingCart size={17} color="#fff" />
            </div>
            <span style={{
              fontSize: '1.125rem', fontWeight: 800,
              color: textPrimary, letterSpacing: '-0.03em',
              fontFamily: "var(--font-sans)",
            }}>
              Ceylon Mart
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {['Features', 'Pricing', 'About', 'Release Notes', 'Contact'].map(item => (
              <NavItem key={item} label={item} hasDropdown={item === 'Features'} color={textSecondary} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => setDark()}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: `1px solid ${cardBorder}`,
              background: cardBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: textSecondary,
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link to="/auth/login" style={{
            fontSize: '0.875rem', fontWeight: 600,
            color: textSecondary, textDecoration: 'none',
            transition: 'color 0.15s',
          }}>
            Login
          </Link>
          <Link to="/auth/register" style={{
            padding: '9px 20px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: '#fff',
            fontSize: '0.875rem', fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(34,197,94,0.40)',
            transition: 'all 0.2s',
            display: 'inline-block',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        paddingTop: 160,
        paddingBottom: 100,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '160px 48px 100px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
      }}>
        {/* Left: text content */}
        <div>
          {/* Animated badge */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 999,
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              backdropFilter: 'blur(12px)',
              boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
              marginBottom: 28,
              animation: 'fadeSlideUp 0.8s 0.1s cubic-bezier(0.23,1,0.32,1) both',
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 0 3px rgba(34,197,94,0.25)',
              animation: 'pulseDot 2s infinite',
            }} />
            <span style={{
              fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.10em',
              color: textSecondary, textTransform: 'uppercase',
            }}>
              Now Available — 14-Day Free Trial
            </span>
          </div>

          {/* Heading with parallax */}
          <div
            style={{
              animation: 'fadeSlideUp 0.8s 0.2s cubic-bezier(0.23,1,0.32,1) both',
              transform: `translate(${px * -6}px, ${py * -3}px)`,
              transition: prefersReduced ? 'none' : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
              willChange: 'transform',
            }}
          >
            <h1 style={{
              fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              lineHeight: 1.06,
              color: textPrimary,
              marginBottom: 20,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Powerful for Single
              <br />
              Shops &{' '}
              <span style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #16a34a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% auto',
                animation: 'gradientShift 4s linear infinite',
              }}>
                Growing Chains
              </span>
            </h1>
          </div>

          <p style={{
            fontSize: '1.0625rem',
            color: textSecondary,
            lineHeight: 1.7,
            fontWeight: 500,
            maxWidth: 460,
            marginBottom: 36,
            animation: 'fadeSlideUp 0.8s 0.35s cubic-bezier(0.23,1,0.32,1) both',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Streamline your retail operations with integrated POS, Inventory, Accounting, and HR. One platform for every branch, always in sync.
          </p>

          {/* CTA row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            animation: 'fadeSlideUp 0.8s 0.48s cubic-bezier(0.23,1,0.32,1) both',
          }}>
            <Link to="/auth/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12,
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              fontSize: '0.9375rem', fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(34,197,94,0.45)',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
              position: 'relative',
              overflow: 'hidden',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 14px 40px rgba(34,197,94,0.55)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(34,197,94,0.45)'
              }}
            >
              Start Free Trial — 14 Days
              <ArrowRight size={16} />
            </Link>

            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              padding: '14px 24px', borderRadius: 12,
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              backdropFilter: 'blur(12px)',
              color: textPrimary,
              fontSize: '0.9375rem', fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.06)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#22c55e'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = cardBorder
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(34,197,94,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Play size={11} fill="#22c55e" color="#22c55e" style={{ marginLeft: 1 }} />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
            marginTop: 32,
            animation: 'fadeSlideUp 0.8s 0.6s cubic-bezier(0.23,1,0.32,1) both',
          }}>
            {['No Credit Card Required', 'Setup in 5 Minutes', 'Cancel Anytime'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} color="#22c55e" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: textSecondary }}>
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D hero visual with mouse parallax */}
        <div style={{
          animation: 'fadeSlideIn 1s 0.3s cubic-bezier(0.23,1,0.32,1) both',
          transform: `translate(${px * 12}px, ${py * 8}px)`,
          transition: prefersReduced ? 'none' : 'transform 0.8s cubic-bezier(0.23,1,0.32,1)',
          willChange: 'transform',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <HeroVisual dark={dark} />
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <Reveal>
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '0 48px 80px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em',
            color: textSecondary, textTransform: 'uppercase',
            opacity: 0.5, marginBottom: 24,
          }}>
            Trusted by leading retailers across Sri Lanka
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 52, flexWrap: 'wrap' }}>
            {['Keells Super', 'Arpico', 'Cargills', 'Laughs', 'Softlogic'].map(name => (
              <span key={name} style={{
                fontSize: '1.0625rem', fontWeight: 800,
                color: textSecondary, opacity: 0.35,
                letterSpacing: '-0.02em',
                transition: 'opacity 0.2s',
                cursor: 'default',
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.35')}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── DIVIDER ── */}
      <div style={{
        position: 'relative', zIndex: 1, margin: '0 48px 80px',
        height: 1,
        background: `linear-gradient(90deg, transparent, ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}, transparent)`,
      }} />

      {/* ── FEATURES SECTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 48px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px', borderRadius: 999,
              background: 'rgba(34,197,94,0.10)',
              border: '1px solid rgba(34,197,94,0.20)',
              marginBottom: 16,
            }}>
              <Layers size={12} color="#22c55e" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Everything You Need
              </span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: textPrimary,
              marginBottom: 16,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              One platform.
              <span style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}> Every tool.</span>
            </h2>
            <p style={{
              fontSize: '1.0625rem', color: textSecondary, lineHeight: 1.65,
              maxWidth: 500, margin: '0 auto', fontFamily: "'DM Sans', sans-serif",
            }}>
              All modules work together in real-time. What happens at the POS instantly updates inventory, accounting, and your dashboard.
            </p>
          </div>
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {FEATURES.map(f => (
            <FeatureCard key={f.title} feat={f} dark={dark} />
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 48px 120px' }}>
        <Reveal direction="scale">
          <div style={{
            maxWidth: 820,
            margin: '0 auto',
            padding: '64px 64px',
            borderRadius: 28,
            background: cardBg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${cardBorder}`,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: dark ? '0 40px 100px rgba(0,0,0,0.6)' : '0 40px 100px rgba(0,0,0,0.10)',
          }}>
            {/* Inner glow */}
            <div style={{
              position: 'absolute',
              top: -60, left: '50%', transform: 'translateX(-50%)',
              width: 400, height: 200,
              background: 'radial-gradient(ellipse, rgba(34,197,94,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.50), transparent)',
            }} />

            {/* Green orb icon */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 0 12px rgba(34,197,94,0.10), 0 16px 40px rgba(34,197,94,0.40)',
              animation: 'pulse3d 3s ease-in-out infinite',
            }}>
              <BarChart3 size={30} color="#fff" />
            </div>

            <h2 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: 800, letterSpacing: '-0.04em',
              color: textPrimary, marginBottom: 14,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Ready to scale your retail?
            </h2>
            <p style={{
              fontSize: '1.0625rem', color: textSecondary, lineHeight: 1.65,
              maxWidth: 400, margin: '0 auto 36px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Join retailers growing with CloudMartPro. Start your free trial — no card required.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/auth/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '16px 32px', borderRadius: 14,
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff', fontSize: '1rem', fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(34,197,94,0.50)',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(34,197,94,0.60)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.50)' }}
              >
                Start Free — 14 Days <ArrowRight size={17} />
              </Link>
              <Link to="/auth/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '16px 24px', borderRadius: 14,
                border: `1px solid ${cardBorder}`,
                color: textSecondary, fontSize: '1rem', fontWeight: 700,
                textDecoration: 'none', transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Sign in instead
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: `1px solid ${cardBorder}`,
        padding: '28px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShoppingCart size={13} color="#fff" />
          </div>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: textPrimary, opacity: 0.5 }}>
            Ceylon Mart
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: textSecondary, opacity: 0.4, fontWeight: 500 }}>
          © 2026 Ceylon Mart · All rights reserved
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <span key={l} style={{ fontSize: '0.8125rem', color: textSecondary, opacity: 0.5, cursor: 'pointer', fontWeight: 500 }}>
              {l}
            </span>
          ))}
        </div>
      </footer>

    </div>
  )
}

export default LandingPage