export function PurchaseList({
    purchases,
    loading,
    selectedPurchaseId,
    onSelectPurchase,
}) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                    Loading purchases...
                </div>
            </div>
        )
    }

    if (!purchases || purchases.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">
                    No purchases found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    Record your first purchase to see it here.
                </p>
            </div>
        )
    }

    const formatCurrency = (value) =>
        `₹${Number(value || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })

    const getTotal = (purchase) =>
        Number(purchase.quantity || 0) *
        Number(purchase.rate || 0)

    return (
        <>
            {/* ================= MOBILE ================= */}
            <div className="space-y-2.5 md:hidden">
                {purchases.map((purchase) => {
                    const isSelected =
                        selectedPurchaseId === purchase.id

                    return (
                        <article
                            key={purchase.id}
                            className={`overflow-hidden rounded-xl border transition ${isSelected
                                    ? 'border-sky-300 bg-sky-50/60'
                                    : 'border-slate-200 bg-white'
                                }`}
                        >

                            <div className="p-2 mb-0">{purchase.suppliers.name}</div>
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3 px-4 py-3">

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                            #{purchase.id}
                                        </span>

                                        {isSelected && (
                                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                                                Selected
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">
                                        {purchase.products?.name ||
                                            'Unknown Product'}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {formatDate(purchase.date)}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        Total
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-sky-700">
                                        {formatCurrency(
                                            getTotal(purchase)
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/70">
                                <div className="px-3 py-2.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        Qty
                                    </p>

                                    <p className="mt-0.5 text-xs font-semibold text-slate-900">
                                        {purchase.quantity} boxes
                                    </p>
                                </div>

                                <div className="border-l border-slate-100 px-3 py-2.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        Rate
                                    </p>

                                    <p className="mt-0.5 text-xs font-semibold text-slate-900">
                                        {formatCurrency(
                                            purchase.rate
                                        )}
                                    </p>
                                </div>

                                <div className="border-l border-slate-100 px-3 py-2.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        MRP
                                    </p>

                                    <p className="mt-0.5 text-xs font-semibold text-slate-900">
                                        {formatCurrency(
                                            purchase.mrp
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="border-t border-slate-100 p-2.5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectPurchase?.(
                                            purchase.id
                                        )
                                    }
                                    className={`w-full rounded-lg px-3 py-2 text-xs font-semibold transition ${isSelected
                                            ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                                            : 'bg-slate-900 text-white hover:bg-slate-800'
                                        }`}
                                >
                                    {isSelected
                                        ? 'Selected'
                                        : 'View Details'}
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>

            {/* ================= DESKTOP ================= */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[800px] text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                ID
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                Date
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">
                                Product
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                Quantity
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                Rate
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                MRP
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                Total
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {purchases.map((purchase) => {
                            const isSelected =
                                selectedPurchaseId ===
                                purchase.id

                            return (
                                <tr
                                    key={purchase.id}
                                    className={`border-b border-slate-100 transition ${isSelected
                                            ? 'bg-sky-50'
                                            : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <td className="px-4 py-3 font-semibold text-slate-700">
                                        #{purchase.id}
                                    </td>

                                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                        {formatDate(
                                            purchase.date
                                        )}
                                    </td>

                                    <td className="max-w-[220px] px-4 py-3">
                                        <p className="truncate font-medium text-slate-900">
                                            {purchase.products
                                                ?.name ||
                                                'Unknown Product'}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3 text-right text-slate-700">
                                        {purchase.quantity}
                                    </td>

                                    <td className="px-4 py-3 text-right text-slate-700">
                                        {formatCurrency(
                                            purchase.rate
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right text-slate-700">
                                        {formatCurrency(
                                            purchase.mrp
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right font-semibold text-sky-700">
                                        {formatCurrency(
                                            getTotal(purchase)
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSelectPurchase?.(
                                                    purchase.id
                                                )
                                            }
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isSelected
                                                    ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
                                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                                }`}
                                        >
                                            {isSelected
                                                ? 'Selected'
                                                : 'View'}
                                        </button>
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