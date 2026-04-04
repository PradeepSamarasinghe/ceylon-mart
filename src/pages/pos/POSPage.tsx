import { PageShell } from '@/components/shared/PageShell'
import { ShoppingCart } from 'lucide-react'

export function POSPage() {
  return (
    <PageShell
      titleKey="pos.title"
      icon={ShoppingCart}
    >
      {/* POS Screen - Full implementation in Phase 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
        {/* Products Grid Placeholder */}
        <div className="glass-card-static p-6 min-h-[600px] animate-fade-up delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Search by name, SKU, or barcode..."
              className="input-field text-lg py-3"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Grocery', 'Beverages', 'Dairy', 'Household', 'Personal Care', 'Snacks'].map((cat, i) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  i === 0
                    ? 'gradient-saffron text-[var(--color-dark)]'
                    : 'bg-[var(--color-dark-3)] text-[var(--color-muted)] hover:text-[var(--color-warm)] hover:bg-[var(--color-dark-4)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="bg-[var(--color-dark-3)] rounded-xl p-3 cursor-pointer hover:border hover:border-[var(--color-border-hover)] hover:translate-y-[-2px] transition-all border border-transparent"
              >
                <div className="aspect-square rounded-lg bg-[var(--color-dark-4)] mb-3 flex items-center justify-center">
                  <span className="text-3xl">📦</span>
                </div>
                <p className="text-sm font-medium text-[var(--color-warm)] truncate">
                  Product {i + 1}
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5">SKU-{String(1000 + i)}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm font-bold text-[var(--color-primary)]">
                    Rs. {((i + 1) * 250 + 100).toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    i % 5 === 0 ? 'bg-[rgba(231,76,60,0.15)] text-[var(--color-danger)]' : 'bg-[rgba(46,204,113,0.15)] text-[var(--color-success)]'
                  }`}>
                    {i % 5 === 0 ? '2' : `${(i + 1) * 15}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Panel Placeholder */}
        <div className="glass-card-static p-6 min-h-[600px] flex flex-col animate-fade-up delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <h3 className="text-lg font-semibold mb-4 font-[family-name:var(--font-display)]">
            🛒 Cart
          </h3>

          {/* Empty cart state */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-[rgba(232,160,69,0.06)] flex items-center justify-center mb-4">
              <ShoppingCart size={36} className="text-[var(--color-muted)]" />
            </div>
            <p className="text-sm text-[var(--color-muted)]">Cart is empty</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Search or click products to add them
            </p>
          </div>

          {/* Checkout Footer */}
          <div className="border-t border-[var(--color-border)] pt-4 mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span className="font-medium">Rs. 0.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted)]">VAT</span>
              <span className="font-medium">Rs. 0.00</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-[var(--color-primary)]">Rs. 0.00</span>
            </div>
            <button className="btn-primary w-full py-3 text-base mt-2">
              💳 Checkout — Rs. 0.00
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
