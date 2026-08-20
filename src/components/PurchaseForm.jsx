import { useMemo } from 'react'

export function PurchaseForm({
    form,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
    products,
    productsLoading,
}) {
    const selectedProduct = useMemo(
        () => products.find((p) => p.id === Number(form.product_id)),
        [form.product_id, products],
    )

    const total = useMemo(() => {
        const quantity = Number(form.quantity) || 0
        const rate = Number(form.rate) || 0
        return (quantity * rate).toFixed(2)
    }, [form.quantity, form.rate])

    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Record purchase</h2>
            </div>

            <div className="space-y-1">
                <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                    Date
                </label>
                <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={onChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                {errors.date && <p className="text-sm text-rose-600">{errors.date}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="product_id" className="block text-sm font-medium text-slate-700">
                    Product
                </label>
                <select
                    id="product_id"
                    name="product_id"
                    value={form.product_id}
                    onChange={onChange}
                    disabled={productsLoading}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">
                        {productsLoading ? 'Loading products...' : 'Select a product'}
                    </option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>
                {errors.product_id && <p className="text-sm text-rose-600">{errors.product_id}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">
                    Quantity (boxes)
                </label>
                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={form.quantity}
                    onChange={onChange}
                    placeholder="20"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                {errors.quantity && <p className="text-sm text-rose-600">{errors.quantity}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="rate" className="block text-sm font-medium text-slate-700">
                    Rate (₹ per box)
                </label>
                <input
                    id="rate"
                    name="rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.rate}
                    onChange={onChange}
                    placeholder="180"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                {errors.rate && <p className="text-sm text-rose-600">{errors.rate}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="mrp" className="block text-sm font-medium text-slate-700">
                    MRP (₹ per box)
                </label>
                <input
                    id="mrp"
                    name="mrp"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.mrp}
                    onChange={onChange}
                    placeholder="240"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                {errors.mrp && <p className="text-sm text-rose-600">{errors.mrp}</p>}
            </div>

            {selectedProduct && (
                <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Product:</span>
                            <span className="font-medium text-slate-900">{selectedProduct.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Per box:</span>
                            <span className="font-medium text-slate-900">{selectedProduct.quantity_per_box} units</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Current stock:</span>
                            <span className="font-medium text-slate-900">{selectedProduct.stock} boxes</span>
                        </div>
                        <div className="border-t border-sky-200 pt-2 mt-2 flex justify-between">
                            <span className="text-slate-700 font-medium">Total:</span>
                            <span className="text-lg font-bold text-sky-700">₹{total}</span>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting || !form.product_id}
                className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
                {isSubmitting ? 'Saving...' : 'Record purchase'}
            </button>
        </form>
    )
}
