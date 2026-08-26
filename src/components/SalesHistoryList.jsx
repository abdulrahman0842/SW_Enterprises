function getPaymentBadgeClass(status) {
    switch (status) {
        case 'Paid':
            return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200'

        case 'Partial':
            return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'

        default:
            return 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200'
    }
}

function formatCurrency(value) {
    return `₹${Number(value || 0).toFixed(2)}`
}

export function SalesHistoryList({
    sales,
    loading,
    error,
    onSelectSale,
    selectedSale,
    productsById,
    onSendInvoice,
}) {
    if (loading) {
        return (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
                <div>
                    <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                    <p className="text-sm text-slate-500">
                        Loading sales history...
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-5 text-center">
                <p className="text-sm font-medium text-rose-700">
                    {error}
                </p>
            </div>
        )
    }

    if (!sales || sales.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                    No sales recorded yet.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    Create your first sale to see it here.
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
                {sales.map((sale) => {
                    const selected = selectedSale?.id === sale.id
                    const balance = Number(sale.balance_amount || 0)

                    return (
                        <article
                            key={sale.id}
                            className={`overflow-hidden rounded-xl border transition ${selected
                                    ? 'border-sky-300 bg-sky-50/30 ring-1 ring-sky-100'
                                    : 'border-slate-200 bg-white'
                                }`}
                        >
                            {/* Header */}
                            <div
                                className={`border-b px-4 py-3 ${selected
                                        ? 'border-sky-100 bg-sky-50/60'
                                        : 'border-slate-200 bg-slate-50/70'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-sky-600">
                                                #{sale.id}
                                            </span>

                                            <span className="text-xs text-slate-300">
                                                |
                                            </span>

                                            <span className="text-xs text-slate-500">
                                                {sale.date}
                                            </span>
                                        </div>

                                        <h3 className="mt-1 truncate text-sm font-semibold text-slate-900">
                                            {sale.customer_name ||
                                                'Walk-in Customer'}
                                        </h3>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-bold ${getPaymentBadgeClass(
                                            sale.payment_status
                                        )
                                            }`}
                                    >
                                        {sale.payment_status}
                                    </span>
                                </div>
                            </div>

                            {/* Financial summary */}
                            <div className="grid grid-cols-2 border-b border-slate-200">
                                <div className="border-r border-b border-slate-200 px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        Total
                                    </p>

                                    <p className="mt-1 text-base font-bold text-slate-900">
                                        {formatCurrency(
                                            sale.total_amount
                                        )}
                                    </p>
                                </div>

                                <div className="border-b border-slate-200 px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                        Products
                                    </p>

                                    <p className="mt-1 text-base font-bold text-slate-900">
                                        {sale.product_count}
                                    </p>
                                </div>

                                <div className="border-r border-slate-200 bg-emerald-50/40 px-4 py-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                        Paid
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-emerald-700">
                                        {formatCurrency(
                                            sale.amount_paid
                                        )}
                                    </p>
                                </div>

                                <div
                                    className={`px-4 py-3 ${balance > 0
                                            ? 'bg-amber-50/50'
                                            : 'bg-slate-50/50'
                                        }`}
                                >
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                        Balance
                                    </p>

                                    <p
                                        className={`mt-1 text-sm font-bold ${balance > 0
                                                ? 'text-amber-700'
                                                : 'text-slate-700'
                                            }`}
                                    >
                                        {formatCurrency(
                                            sale.balance_amount
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Customer contact */}
                            {sale.customer_contact && (
                                <div className="border-b border-slate-200 px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                Contact
                                            </p>

                                            <p className="mt-1 truncate text-sm font-medium text-slate-700">
                                                {sale.customer_contact}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action */}
                            <div className="p-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectSale(sale.id)
                                    }
                                    className={`w-full rounded-lg px-3 py-2.5 text-xs font-semibold transition ${selected
                                            ? 'bg-slate-800 text-white'
                                            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                                        }`}
                                >
                                    {selected
                                        ? 'Viewing items'
                                        : 'View items'}
                                </button>
                            </div>
                        </article>
                    )
                })}
            </div>

            {/* =========================
                DESKTOP VIEW
            ========================== */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Sale
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Date
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Customer
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Products
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Total
                                </th>

                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Paid
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Balance
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 bg-white">
                            {sales.map((sale) => {
                                const selected =
                                    selectedSale?.id === sale.id

                                return (
                                    <tr
                                        key={sale.id}
                                        className={`transition ${selected
                                                ? 'bg-sky-50'
                                                : 'hover:bg-slate-50'
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-semibold text-sky-700">
                                                #{sale.id}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                                            {sale.date}
                                        </td>

                                        <td className="max-w-48 px-4 py-3">
                                            <div className="truncate font-medium text-slate-900">
                                                {sale.customer_name ||
                                                    'Walk-in Customer'}
                                            </div>

                                            {sale.customer_contact && (
                                                <div className="mt-0.5 truncate text-xs text-slate-400">
                                                    {sale.customer_contact}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-slate-600">
                                            {sale.product_count}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-900">
                                            {formatCurrency(
                                                sale.total_amount
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentBadgeClass(
                                                    sale.payment_status
                                                )}`}
                                            >
                                                {sale.payment_status}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-emerald-700">
                                            {formatCurrency(
                                                sale.amount_paid
                                            )}
                                        </td>

                                        <td
                                            className={`whitespace-nowrap px-4 py-3 text-right font-medium ${Number(
                                                sale.balance_amount || 0
                                            ) > 0
                                                    ? 'text-amber-700'
                                                    : 'text-slate-600'
                                                }`}
                                        >
                                            {formatCurrency(
                                                sale.balance_amount
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onSelectSale(sale.id)
                                                }
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${selected
                                                        ? 'bg-sky-700 text-white'
                                                        : 'bg-sky-600 text-white hover:bg-sky-700'
                                                    }`}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =========================
                SELECTED SALE DETAILS
            ========================== */}
            {selectedSale && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    {/* Header */}
                    <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                                        Sale #{selectedSale.id}
                                    </p>

                                    <span className="text-xs text-slate-400">
                                        •
                                    </span>

                                    <span className="text-xs text-slate-500">
                                        {selectedSale.date}
                                    </span>
                                </div>

                                <h3 className="mt-1 text-lg font-bold text-slate-900">
                                    {selectedSale.customer_name ||
                                        'Walk-in Customer'}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentBadgeClass(
                                        selectedSale.payment_status
                                    )}`}
                                >
                                    {selectedSale.payment_status}
                                </span>

                                {onSendInvoice && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSendInvoice(selectedSale)
                                        }
                                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        WhatsApp Invoice
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sale summary */}
                    <div className="grid grid-cols-2 border-b border-slate-100 sm:grid-cols-4">
                        <div className="border-b border-slate-100 px-4 py-3 sm:border-b-0 sm:border-r">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Total
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                                {formatCurrency(
                                    selectedSale.total_amount
                                )}
                            </p>
                        </div>

                        <div className="border-b border-slate-100 px-4 py-3 sm:border-b-0 sm:border-r">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Paid
                            </p>

                            <p className="mt-1 text-sm font-bold text-emerald-700">
                                {formatCurrency(
                                    selectedSale.amount_paid
                                )}
                            </p>
                        </div>

                        <div className="px-4 py-3 sm:border-r">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Balance
                            </p>

                            <p className="mt-1 text-sm font-bold text-amber-700">
                                {formatCurrency(
                                    selectedSale.balance_amount
                                )}
                            </p>
                        </div>

                        <div className="px-4 py-3">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Products
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                                {selectedSale.product_count}
                            </p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="p-4 sm:p-5">
                        <div className="mb-3">
                            <h4 className="text-sm font-semibold text-slate-900">
                                Sale items
                            </h4>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Products included in this sale.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {(selectedSale.items || []).map((item, index) => {
                                const product =
                                    productsById.get(Number(item.product_id)) || {}

                                const productName =
                                    product.name || 'Unknown product'

                                const quantity = Number(item.quantity || 0)
                                const purchaseRate = Number(item.rate || 0)
                                const sellingPrice = Number(item.mrp || 0)

                                const total = sellingPrice * quantity
                                const profit =
                                    (sellingPrice - purchaseRate) * quantity

                                return (
                                    <article
                                        key={`${selectedSale.id}-${item.product_id || index}`}
                                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                                    >
                                        {/* Product header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h5 className="truncate text-sm font-semibold text-slate-900">
                                                    {productName}
                                                </h5>

                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    Product ID: {item.product_id}
                                                </p>
                                            </div>

                                            <p className="shrink-0 text-sm font-bold text-sky-700">
                                                {formatCurrency(total)}
                                            </p>
                                        </div>

                                        {/* Item details */}
                                        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 sm:grid-cols-4">
                                            <Detail
                                                label="Quantity"
                                                value={`${quantity} boxes`}
                                            />

                                            <Detail
                                                label="Purchase Rate"
                                                value={formatCurrency(
                                                    purchaseRate
                                                )}
                                            />

                                            <Detail
                                                label="Selling Price"
                                                value={formatCurrency(
                                                    sellingPrice
                                                )}
                                            />

                                            <Detail
                                                label="Profit"
                                                value={formatCurrency(profit)}
                                            />
                                        </div>
                                    </article>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
                {value}
            </p>
        </div>
    )
}