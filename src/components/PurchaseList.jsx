export function PurchaseList({ purchases, loading, selectedPurchaseId, onSelectPurchase }) {
    if (loading) {
        return (
            <div className="py-8 text-center text-slate-500">
                Loading purchases...
            </div>
        )
    }

    if (!purchases || purchases.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                No purchases recorded yet.
            </div>
        )
    }

    return (
        <>
            <div className="space-y-3 md:hidden">
                {purchases.map((purchase) => (
                    <article
                        key={purchase.id}
                        className={`rounded-2xl border p-4 shadow-sm ${selectedPurchaseId === purchase.id ? 'border-sky-200 bg-sky-50' : 'border-slate-200 bg-white'}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Purchase #{purchase.id}
                                </p>
                                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                                    {purchase.products?.name || 'Unknown Product'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {new Date(purchase.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Quantity:</span>
                                <span className="font-medium text-slate-900">{purchase.quantity} boxes</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Rate:</span>
                                <span className="font-medium text-slate-900">₹{parseFloat(purchase.rate).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">MRP:</span>
                                <span className="font-medium text-slate-900">₹{parseFloat(purchase.mrp).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between font-semibold">
                                <span className="text-slate-900">Total:</span>
                                <span className="text-sky-700">₹{(purchase.quantity * purchase.rate).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onSelectPurchase?.(purchase.id)}
                            className="mt-4 w-full rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                        >
                            View details
                        </button>
                    </article>
                ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Purchase ID</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Product</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Quantity</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Rate</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">MRP</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Total</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase) => (
                            <tr
                                key={purchase.id}
                                className={selectedPurchaseId === purchase.id ? 'border-b border-slate-100 bg-sky-50' : 'border-b border-slate-100 hover:bg-slate-50'}
                            >
                                <td className="px-4 py-3 text-slate-900 font-semibold">#{purchase.id}</td>
                                <td className="px-4 py-3 text-slate-900">
                                    {new Date(purchase.date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-slate-900">
                                    {purchase.products?.name || 'Unknown Product'}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-900">{purchase.quantity}</td>
                                <td className="px-4 py-3 text-right text-slate-900">
                                    ₹{parseFloat(purchase.rate).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-900">
                                    ₹{parseFloat(purchase.mrp).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-sky-700">
                                    ₹{(purchase.quantity * purchase.rate).toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onSelectPurchase?.(purchase.id)}
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
        </>
    )
}
