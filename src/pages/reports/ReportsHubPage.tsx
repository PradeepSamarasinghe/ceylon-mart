import { useTranslation } from 'react-i18next'
import { PageShell } from '@/components/shared/PageShell'
import {
  FileBarChart,
  FileSpreadsheet,
  FileText,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export function ReportsHubPage() {
  const { t } = useTranslation()

  const reportCards = [
    {
      title: t('reports.vat_report'),
      description: 'Output & Input VAT summary with IRD-compliant export',
      icon: FileSpreadsheet,
      path: '/reports/vat',
      color: '#E8A045',
      tag: 'IRD Compliant',
    },
    {
      title: t('reports.svat_report'),
      description: 'SVAT credit allocation and tracking',
      icon: FileText,
      path: '/reports/svat',
      color: '#3498DB',
      tag: 'IRD Compliant',
    },
    {
      title: t('reports.wht_report'),
      description: 'Withholding tax schedule and deductions',
      icon: FileText,
      path: '/reports/wht',
      color: '#E74C3C',
      tag: 'IRD Compliant',
    },
    {
      title: t('reports.epf_etf_report'),
      description: 'EPF C2 form and ETF contribution reports',
      icon: FileSpreadsheet,
      path: '/reports/epf-etf',
      color: '#2ECC71',
      tag: 'Labour Act',
    },
    {
      title: t('reports.sales_analytics'),
      description: 'Sales performance, trends, and branch comparison analytics',
      icon: BarChart3,
      path: '/reports/sales-analytics',
      color: '#9B59B6',
      tag: 'Analytics',
    },
  ]

  return (
    <PageShell titleKey="reports.report_hub" icon={FileBarChart}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((report, index) => (
          <Link
            key={report.path}
            to={report.path}
            className="glass-card p-6 group animate-fade-up block"
            style={{ animationDelay: `${(index + 1) * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: `${report.color}15` }}
              >
                <report.icon size={24} style={{ color: report.color }} />
              </div>
              <ArrowUpRight
                size={18}
                className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors"
              />
            </div>
            <h3 className="text-base font-semibold text-[var(--color-warm)] mb-1.5">
              {report.title}
            </h3>
            <p className="text-sm text-[var(--color-muted)] mb-3 line-clamp-2">
              {report.description}
            </p>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${report.color}15`,
                color: report.color,
              }}
            >
              {report.tag}
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
