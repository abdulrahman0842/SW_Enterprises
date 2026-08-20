import { calculateBottles, isLowStock } from '../services/inventoryService'

export function InventoryList({ products, loading }) {
  if (loading) {
    return (
      <div className="py-8 text-center text-slate-500">
        Loading inventory...
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
        No products in inventory.
      </div>
    )
  }

  return (
    <>
      {/* Mobile cards view */}
      <div className="space-y-3 md:hidden">
        {products.map((product) => {
          const bottles = calculateBottles(product.stock, product.quantity_per_box)
          const low = isLowStock(product.stock)

          return (
            <article
              key={product.id}
              className={`rounded-2xl border p-4 shadow-sm ${
                low
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {product.name}
                  </h3>
                </div>
                {low && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Low stock
                  </span>
                )}
              </div>

              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Stock:</span>
                  <span className={`font-medium ${low ? 'text-amber-700' : 'text-slate-900'}`}>
                    {product.stock} boxes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Bottles:</span>
                  <span className={`font-medium ${low ? 'text-amber-700' : 'text-slate-900'}`}>
                    {bottles} × {product.quantity_per_box}ml
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Per box:</span>
                  <span className="font-medium text-slate-900">{product.quantity_per_box} units</span>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between">
                  <span className="text-slate-600">Rate:</span>
                  <span className="font-medium text-slate-900">₹{parseFloat(product.rate).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">MRP:</span>
                  <span className="font-medium text-slate-900">₹{parseFloat(product.mrp).toFixed(2)}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Product</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Stock (boxes)</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Per box</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Stock (bottles)</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Rate</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">MRP</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const bottles = calculateBottles(product.stock, product.quantity_per_box)
              const low = isLowStock(product.stock)

              return (
                <tr
                  key={product.id}
                  className={`border-b border-slate-100 hover:bg-slate-50 ${
                    low ? 'bg-amber-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                  <td className={`px-4 py-3 text-right font-medium ${low ? 'text-amber-700' : 'text-slate-900'}`}>
                    {product.stock}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900">{product.quantity_per_box}</td>
                  <td className={`px-4 py-3 text-right font-medium ${low ? 'text-amber-700' : 'text-slate-900'}`}>
                    {bottles}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900">₹{parseFloat(product.rate).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-slate-900">₹{parseFloat(product.mrp).toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    {low ? (
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Low stock
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
