function formatCurrency(value) {
    const amount = Number(value || 0)

    return `₹${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

function getStockStatus(stock) {
    const value = Number(stock || 0)

    if (value <= 0) {
        return {
            label: 'Out of stock',
            className: 'bg-rose-50 text-rose-700 ring-rose-200',
        }
    }

    if (value <= 5) {
        return {
            label: 'Low stock',
            className: 'bg-amber-50 text-amber-700 ring-amber-200',
        }
    }

    return {
        label: 'In stock',
        className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    }
}

export function ProductList({
    products,
    onEdit,
    onDelete,
    deleting,
}) {
    if (products.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                    📦
                </div>

                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                    No products found
                </h3>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Add a product to start managing your inventory.
                </p>
            </div>
        )
    }

    return (
        <>
            {/* =========================
                MOBILE VIEW
            ========================== */}
            <div className="space-y-3 md:hidden">
                {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    const isDeleting = deleting === product.id

                    return (
                        <article
                            key={product.id}
                            className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                        >
                            {/* Product Header */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-slate-900">
                                        {product.name}
                                    </h3>

                                    {product.description && (
                                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                            {product.description}
                                        </p>
                                    )}
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ${stockStatus.className}`}
                                >
                                    {stockStatus.label}
                                </span>
                            </div>

                            {/* Product Information */}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <div className="rounded-lg bg-slate-50 p-2.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        Per Box
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {product.quantity_per_box}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-2.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        Stock
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {Number(product.stock || 0)} boxes
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-2.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        Rate
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatCurrency(product.rate)}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-2.5">
                                    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                        MRP
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatCurrency(product.mrp)}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                                <button
                                    type="button"
                                    onClick={() => onEdit(product)}
                                    disabled={isDeleting}
                                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onDelete(product.id)}
                                    disabled={isDeleting}
                                    className="flex-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600" />
                                            Deleting
                                        </span>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>

            {/* =========================
                DESKTOP VIEW
            ========================== */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/70">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Product
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Per Box
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Stock
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Rate
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                MRP
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => {
                            const stockStatus = getStockStatus(product.stock)
                            const isDeleting =
                                deleting === product.id

                            return (
                                <tr
                                    key={product.id}
                                    className="transition hover:bg-slate-50/70"
                                >
                                    {/* Product */}
                                    <td className="px-4 py-3">
                                        <div className="max-w-[260px]">
                                            <p className="truncate font-medium text-slate-900">
                                                {product.name}
                                            </p>

                                            {product.description && (
                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                    {product.description}
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Per Box */}
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-slate-700">
                                            {product.quantity_per_box}
                                        </span>
                                    </td>

                                    {/* Stock */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700">
                                                {Number(
                                                    product.stock || 0
                                                )}{' '}
                                                boxes
                                            </span>

                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${stockStatus.className}`}
                                            >
                                                {stockStatus.label}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Rate */}
                                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                                        {formatCurrency(product.rate)}
                                    </td>

                                    {/* MRP */}
                                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                        {formatCurrency(product.mrp)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(product)
                                                }
                                                disabled={isDeleting}
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(product.id)
                                                }
                                                disabled={isDeleting}
                                                className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isDeleting
                                                    ? 'Deleting...'
                                                    : 'Delete'}
                                            </button>
                                        </div>
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