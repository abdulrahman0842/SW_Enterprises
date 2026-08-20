export function PurchaseList({ purchases, loading }) {
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
            {/* Mobile cards view */}
            <div className="space-y-3 md:hidden">
                {purchases.map((purchase) => (
                    <article
                        key={purchase.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
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
                    </article>
                ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Product</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Quantity</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Rate</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">MRP</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-900">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((purchase) => (
                            <tr
                                key={purchase.id}
                                className="border-b border-slate-100 hover:bg-slate-50"
                            >
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
