function getPaymentBadgeClass(status) {
    if (status === 'Paid') {
        return 'bg-emerald-100 text-emerald-700'
    }

    if (status === 'Partial') {
        return 'bg-amber-100 text-amber-700'
    }

    return 'bg-slate-100 text-slate-700'
}

export function SalesHistoryList({ sales, loading, error, onSelectSale, selectedSale, productsById }) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                Loading sales history...
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
                {error}
            </div>
        )
    }

    if (!sales || sales.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                No sales recorded yet.
            </div>
        )
    }

    return (
        <>
            <div className="space-y-3 md:hidden">
                {sales.map((sale) => (
                    <article
                        key={sale.id}
                        className={`rounded-2xl border p-4 shadow-sm ${selectedSale?.id === sale.id
                            ? 'border-sky-200 bg-sky-50'
                            : 'border-slate-200 bg-white'
                            }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Sale #{sale.id}
                                </p>
                                <p className="mt-1 text-lg font-semibold text-slate-900">
                                    {sale.customer_name}
                                </p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentBadgeClass(sale.payment_status)}`}>
                                {sale.payment_status}
                            </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p className="text-slate-500">Date</p>
                                <p className="font-medium text-slate-900">{sale.date}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Products</p>
                                <p className="font-medium text-slate-900">{sale.product_count}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Total</p>
                                <p className="font-medium text-slate-900">₹{Number(sale.total_amount || 0).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Paid</p>
                                <p className="font-medium text-slate-900">₹{Number(sale.amount_paid || 0).toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
                            <p><span className="font-medium text-slate-700">Contact:</span> {sale.customer_contact}</p>
                            <p className="mt-1"><span className="font-medium text-slate-700">Balance:</span> ₹{Number(sale.balance_amount || 0).toFixed(2)}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => onSelectSale(sale.id)}
                            className="mt-4 w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                        >
                            View items
                        </button>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Sale ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Products</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Paid</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Balance</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sales.map((sale) => (
                            <tr key={sale.id} className={selectedSale?.id === sale.id ? 'bg-sky-50' : 'bg-white hover:bg-slate-50'}>
                                <td className="px-4 py-3 text-sm font-semibold text-slate-900">#{sale.id}</td>
                                <td className="px-4 py-3 text-sm text-slate-700">{sale.date}</td>
                                <td className="px-4 py-3 text-sm text-slate-700">{sale.customer_name}</td>
                                <td className="px-4 py-3 text-sm text-slate-700">{sale.customer_contact}</td>
                                <td className="px-4 py-3 text-sm text-slate-700">{sale.product_count}</td>
                                <td className="px-4 py-3 text-sm text-slate-700">₹{Number(sale.total_amount || 0).toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getPaymentBadgeClass(sale.payment_status)}`}>
                                        {sale.payment_status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-700">₹{Number(sale.amount_paid || 0).toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-slate-700">₹{Number(sale.balance_amount || 0).toFixed(2)}</td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onSelectSale(sale.id)}
                                        className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedSale && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                                Sale #{selectedSale.id}
                            </p>
                            <h3 className="mt-1 text-xl font-semibold text-slate-900">Items</h3>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentBadgeClass(selectedSale.payment_status)}`}>
                            {selectedSale.payment_status}
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {(selectedSale.items || []).map((item, index) => {
                            const product = productsById.get(Number(item.product_id)) || {}
                            const productName = product.name || 'Unknown product'
                            const bottles = Number(item.quantity || 0) * Number(product.quantity_per_box || 0)
                            const total = Number(item.rate || 0) * Number(item.quantity || 0)

                            return (
                                <div key={`${selectedSale.id}-${item.product_id || index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-slate-900">{productName}</p>
                                            <p className="text-xs text-slate-500">Product ID: {item.product_id}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-sky-700">₹{total.toFixed(2)}</span>
                                    </div>

                                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Qty</p>
                                            <p className="mt-1 text-sm text-slate-700">{item.quantity} boxes</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bottles</p>
                                            <p className="mt-1 text-sm text-slate-700">{bottles}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Rate</p>
                                            <p className="mt-1 text-sm text-slate-700">₹{Number(item.rate || 0).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">MRP</p>
                                            <p className="mt-1 text-sm text-slate-700">₹{Number(item.mrp || 0).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Qty/Box</p>
                                            <p className="mt-1 text-sm text-slate-700">{product.quantity_per_box || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total</p>
                                            <p className="mt-1 text-sm text-slate-700">₹{total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}
