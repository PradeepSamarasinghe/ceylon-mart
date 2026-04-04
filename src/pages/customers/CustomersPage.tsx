import { PageShell } from '@/components/shared/PageShell'
import { Users, Plus, Search } from 'lucide-react'
import { formatLKR } from '@/lib/utils'

const mockCustomers = [
  { name: 'Perera Stores', phone: '077-1234567', whatsapp: '077-1234567', balance: 15000, limit: 50000, svat: true },
  { name: 'Silva Pharmacy', phone: '071-8889990', whatsapp: '071-8889990', balance: 45000, limit: 200000, svat: true },
  { name: 'Fernando & Sons', phone: '076-5551234', whatsapp: '076-5551234', balance: 0, limit: 100000, svat: false },
  { name: 'Kamal Groceries', phone: '075-3334545', whatsapp: '075-3334545', balance: 8500, limit: 25000, svat: false },
  { name: 'Jayawardena Hardware', phone: '072-9998877', whatsapp: null, balance: 22000, limit: 75000, svat: true },
]

export function CustomersPage() {
  return (
    <PageShell
      titleKey="customers.title"
      icon={Users}
      actions={<button className="btn-primary flex items-center gap-2"><Plus size={16} />Add Customer</button>}
    >
      <div className="glass-card-static animate-fade-up delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        <div className="p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 bg-[var(--color-dark-3)] rounded-lg px-3 py-2 max-w-md">
            <Search size={16} className="text-[var(--color-muted)]" />
            <input type="text" placeholder="Search customers..." className="bg-transparent border-none outline-none text-sm text-[var(--color-warm)] placeholder-[var(--color-muted)] w-full" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>WhatsApp</th><th>Balance</th><th>Credit Limit</th><th>SVAT</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {mockCustomers.map((c) => (
                <tr key={c.name}>
                  <td className="font-medium text-[var(--color-warm)]">{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.whatsapp ? '✅ ' + c.whatsapp : '—'}</td>
                  <td className={c.balance > 0 ? 'font-semibold text-[var(--color-warning)]' : ''}>{formatLKR(c.balance)}</td>
                  <td>{formatLKR(c.limit)}</td>
                  <td>{c.svat ? <span className="badge badge-success">Yes</span> : <span className="badge badge-info">No</span>}</td>
                  <td><button className="text-xs text-[var(--color-primary)] hover:underline">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  )
}
