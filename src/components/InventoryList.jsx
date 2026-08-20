import {
    calculateBottles,
    isLowStock,
} from '../services/inventoryService'

export function InventoryList({ products, loading }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="text-sm text-slate-500">
                    Loading inventory...
                </div>
            </div>
        )
    }

    if (!products || products.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                    No products in inventory
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    Add products and record purchases to see stock here.
                </p>
            </div>
        )
    }

    const formatCurrency = (value) =>
        `₹${Number(value || 0).toFixed(2)}`

    return (
        <>
            {/* =========================
                MOBILE
            ========================== */}
            <div className="space-y-3 md:hidden">
                {products.map((product) => {
                    const stock = Number(product.stock || 0)
                    const perBox = Number(
                        product.quantity_per_box || 0
                    )

                    const bottles = calculateBottles(
                        stock,
                        perBox
                    )

                    const low = isLowStock(stock)

                    return (
                        <article
                            key={product.id}
                            className={`overflow-hidden rounded-xl border shadow-sm ${
                                low
                                    ? 'border-amber-200 bg-amber-50/50'
                                    : 'border-slate-200 bg-white'
                            }`}
                        >
                            {/* Product header */}
                            <div className="flex items-start justify-between gap-3 p-4">
                                <div className="min-w-0">
                                    <h3 className="truncate text-base font-semibold text-slate-900">
                                        {product.name}
                                    </h3>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {perBox} units per box
                                    </p>
                                </div>

                                {low ? (
                                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                                        Low stock
                                    </span>
                                ) : (
                                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                        In stock
                                    </span>
                                )}
                            </div>

                            {/* Stock highlight */}
                            <div
                                className={`mx-4 rounded-xl border p-3 ${
                                    low
                                        ? 'border-amber-200 bg-amber-50'
                                        : 'border-slate-100 bg-slate-50'
                                }`}
                            >
                                <div className="flex items-end justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                            Available stock
                                        </p>

                                        <p
                                            className={`mt-1 text-2xl font-bold ${
                                                low
                                                    ? 'text-amber-700'
                                                    : 'text-slate-900'
                                            }`}
                                        >
                                            {stock}
                                            <span className="ml-1 text-sm font-medium">
                                                boxes
                                            </span>
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-500">
                                            Total units
                                        </p>

                                        <p
                                            className={`mt-1 text-base font-semibold ${
                                                low
                                                    ? 'text-amber-700'
                                                    : 'text-slate-700'
                                            }`}
                                        >
                                            {bottles}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-3 p-4">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        Rate
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatCurrency(product.rate)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        MRP
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatCurrency(product.mrp)}
                                    </p>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>

            {/* =========================
                DESKTOP TABLE
            ========================== */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Product
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Stock
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Per Box
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Total Units
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Rate
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                MRP
                            </th>

                            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => {
                            const stock = Number(
                                product.stock || 0
                            )

                            const perBox = Number(
                                product.quantity_per_box || 0
                            )

                            const bottles = calculateBottles(
                                stock,
                                perBox
                            )

                            const low = isLowStock(stock)

                            return (
                                <tr
                                    key={product.id}
                                    className={`border-b border-slate-100 transition ${
                                        low
                                            ? 'bg-amber-50/60 hover:bg-amber-50'
                                            : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">
                                            {product.name}
                                        </div>
                                    </td>

                                    <td
                                        className={`px-4 py-3 text-right font-semibold ${
                                            low
                                                ? 'text-amber-700'
                                                : 'text-slate-900'
                                        }`}
                                    >
                                        {stock}
                                    </td>

                                    <td className="px-4 py-3 text-right text-slate-700">
                                        {perBox}
                                    </td>

                                    <td
                                        className={`px-4 py-3 text-right font-medium ${
                                            low
                                                ? 'text-amber-700'
                                                : 'text-slate-700'
                                        }`}
                                    >
                                        {bottles}
                                    </td>

                                    <td className="px-4 py-3 text-right text-slate-700">
                                        {formatCurrency(product.rate)}
                                    </td>

                                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                                        {formatCurrency(product.mrp)}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {low ? (
                                            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                                                Low stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                                                In stock
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