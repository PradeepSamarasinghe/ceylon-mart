import { PageShell } from '@/components/shared/PageShell'
import { Package, Plus, Search, Filter } from 'lucide-react'
import { formatLKR } from '@/lib/utils'

const mockProducts = [
  { name: 'Maldive Fish (500g)', sku: 'MF-500', category: 'Grocery', price: 850, stock: 45, vat: 0, status: 'active' },
  { name: 'Ceylon Tea Premium (100g)', sku: 'CT-100P', category: 'Beverages', price: 420, stock: 120, vat: 0, status: 'active' },
  { name: 'Coconut Oil (1L)', sku: 'CO-1L', category: 'Grocery', price: 680, stock: 3, vat: 0, status: 'low' },
  { name: 'Paracetamol 500mg x20', sku: 'PC-500', category: 'Pharmacy', price: 95, stock: 200, vat: 0, status: 'active' },
  { name: 'Rice - Nadu (5kg)', sku: 'RN-5KG', category: 'Grocery', price: 1250, stock: 85, vat: 0, status: 'active' },
  { name: 'Sugar (1kg)', sku: 'SG-1KG', category: 'Grocery', price: 210, stock: 0, vat: 0, status: 'out' },
  { name: 'Dhal (500g)', sku: 'DH-500', category: 'Grocery', price: 320, stock: 60, vat: 0, status: 'active' },
  { name: 'Milk Powder Anchor (400g)', sku: 'MPA-400', category: 'Dairy', price: 890, stock: 25, vat: 0, status: 'active' },
]

export function ProductsPage() {
  return (
    <PageShell
      titleKey="nav.products"
      icon={Package}
      actions={
        <button className="btn-primary flex items-center gap-2">
          <Plus size={16} />
          Add Product
        </button>
      }
    >
      <div className="glass-card-static animate-fade-up delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[var(--color-dark-3)] rounded-lg px-3 py-2">
            <Search size={16} className="text-[var(--color-muted)]" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent border-none outline-none text-sm text-[var(--color-warm)] placeholder-[var(--color-muted)] w-full"
            />
          </div>
          <button className="btn-ghost flex items-center gap-2">
            <Filter size={16} />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr key={product.sku}>
                  <td className="font-medium text-[var(--color-warm)]">{product.name}</td>
                  <td className="font-mono text-xs">{product.sku}</td>
                  <td>{product.category}</td>
                  <td className="font-semibold">{formatLKR(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${
                      product.status === 'active' ? 'badge-success' :
                      product.status === 'low' ? 'badge-warning' :
                      'badge-danger'
                    } capitalize`}>
                      {product.status === 'out' ? 'Out of Stock' : product.status === 'low' ? 'Low Stock' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className="text-xs text-[var(--color-primary)] hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--color-border)] flex items-center justify-between text-sm text-[var(--color-muted)]">
          <span>Showing 1-8 of 8 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md bg-[rgba(232,160,69,0.1)] text-[var(--color-primary)] font-medium">1</button>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
