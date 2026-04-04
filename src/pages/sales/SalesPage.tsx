import { PageShell } from '@/components/shared/PageShell'
import { Receipt, Search, Filter, Plus } from 'lucide-react'
import { formatLKR } from '@/lib/utils'

const mockSales = [
  { id: 'INV-2024-0847', date: '2024-12-15', customer: 'Perera Stores', cashier: 'Nimal', total: 12500, method: 'Cash', status: 'Paid' },
  { id: 'INV-2024-0846', date: '2024-12-15', customer: 'Walk-in', cashier: 'Kumari', total: 3200, method: 'LankaQR', status: 'Paid' },
  { id: 'INV-2024-0845', date: '2024-12-15', customer: 'Silva Pharmacy', cashier: 'Nimal', total: 45000, method: 'Credit', status: 'Credit' },
  { id: 'INV-2024-0844', date: '2024-12-14', customer: 'Walk-in', cashier: 'Kumari', total: 1800, method: 'Cash', status: 'Paid' },
  { id: 'INV-2024-0843', date: '2024-12-14', customer: 'Fernando & Sons', cashier: 'Nimal', total: 28500, method: 'PayHere', status: 'Paid' },
  { id: 'INV-2024-0842', date: '2024-12-14', customer: 'Jayawardena', cashier: 'Kumari', total: 8750, method: 'Cash', status: 'Paid' },
]

export function SalesPage() {
  return (
    <PageShell titleKey="sales.title" icon={Receipt}>
      <div className="glass-card-static animate-fade-up delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[var(--color-dark-3)] rounded-lg px-3 py-2">
            <Search size={16} className="text-[var(--color-muted)]" />
            <input type="text" placeholder="Search invoices..." className="bg-transparent border-none outline-none text-sm text-[var(--color-warm)] placeholder-[var(--color-muted)] w-full" />
          </div>
          <button className="btn-ghost flex items-center gap-2"><Filter size={16} />Filter</button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Cashier</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="font-mono text-xs text-[var(--color-primary)]">{sale.id}</td>
                  <td className="text-sm">{sale.date}</td>
                  <td>{sale.customer}</td>
                  <td>{sale.cashier}</td>
                  <td className="font-semibold">{formatLKR(sale.total)}</td>
                  <td><span className="badge badge-primary">{sale.method}</span></td>
                  <td><span className={`badge ${sale.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>{sale.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between text-sm text-[var(--color-muted)]">
          <span>Showing 1-6 of 6 results</span>
        </div>
      </div>
    </PageShell>
  )
}
