export function SaleCheckout({
    customers,
    saleDate,
    setSaleDate,
    customerId,
    setCustomerId,
    items,
    paymentStatus,
    setPaymentStatus,
    amountPaid,
    setAmountPaid,
    total,
    balance,
    errors,
    onBack,
    isLoading,
}) {
    function handlePaymentStatusChange(status) {
        setPaymentStatus(status)

        if (status === 'Pending') {
            setAmountPaid('0')
        }

        if (status === 'Paid') {
            setAmountPaid(String(total))
        }
    }

    return (
        <div className="space-y-4">
            {/* Date + Customer */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                        Sale Details
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                        Select date and customer.
                    </p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label
                            htmlFor="saleDate"
                            className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                            Sale Date
                        </label>

                        <input
                            id="saleDate"
                            type="date"
                            value={saleDate}
                            onChange={(e) =>
                                setSaleDate(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                        />

                        {errors.date && (
                            <p className="mt-1 text-xs text-rose-600">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="customer"
                            className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                            Customer
                        </label>

                        <select
                            id="customer"
                            value={customerId}
                            onChange={(e) =>
                                setCustomerId(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                        >
                            <option value="">
                                Select customer...
                            </option>

                            {customers.map((customer) => (
                                <option
                                    key={customer.id}
                                    value={customer.id}
                                >
                                    {customer.name}
                                    {customer.contact
                                        ? ` (${customer.contact})`
                                        : ''}
                                </option>
                            ))}
                        </select>

                        {errors.customer && (
                            <p className="mt-1 text-xs text-rose-600">
                                {errors.customer}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Summary */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">
                        Order Summary
                    </h3>
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={item.product_id}
                            className="flex items-center justify-between gap-3"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-800">
                                    {item.product_name}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {item.quantity} boxes × ₹
                                    {item.rate.toFixed(2)}
                                </p>
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-slate-900">
                                ₹
                                {(
                                    item.quantity *
                                    item.rate
                                ).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                        <span className="text-sm font-semibold text-slate-900">
                            Total
                        </span>

                        <span className="text-lg font-bold text-sky-700">
                            ₹{total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                        Payment
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                        Record payment for this sale.
                    </p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label
                            htmlFor="paymentStatus"
                            className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                            Payment Status
                        </label>

                        <select
                            id="paymentStatus"
                            value={paymentStatus}
                            onChange={(e) =>
                                handlePaymentStatusChange(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                        >
                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Partial">
                                Partial
                            </option>

                            <option value="Paid">
                                Paid
                            </option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="amountPaid"
                            className="mb-1.5 block text-xs font-semibold text-slate-700"
                        >
                            Amount Paid
                        </label>

                        <input
                            id="amountPaid"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amountPaid}
                            disabled={
                                paymentStatus ===
                                'Pending'
                            }
                            onChange={(e) =>
                                setAmountPaid(
                                    e.target.value
                                )
                            }
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                    </div>

                    {errors.payment && (
                        <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-xs text-rose-600">
                            {errors.payment}
                        </p>
                    )}

                    <div className="rounded-xl bg-slate-50 p-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                                Total
                            </span>

                            <span className="font-semibold">
                                ₹{total.toFixed(2)}
                            </span>
                        </div>

                        <div className="mt-2 flex justify-between text-sm">
                            <span className="text-slate-500">
                                Paid
                            </span>

                            <span className="font-semibold">
                                ₹
                                {Number(
                                    amountPaid || 0
                                ).toFixed(2)}
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between border-t border-slate-200 pt-3">
                            <span className="font-semibold">
                                Balance
                            </span>

                            <span className="font-bold text-amber-700">
                                ₹{balance.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white pt-2">
                <div className="grid grid-cols-[auto_1fr] gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isLoading}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        ← Back
                    </button>

                    <button
                        type="submit"
                        disabled={
                            isLoading ||
                            !customerId
                        }
                        className="rounded-xl bg-sky-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {isLoading
                            ? 'Creating Sale...'
                            : `Create Sale • ₹${total.toFixed(
                                2
                            )}`}
                    </button>
                </div>
            </div>
        </div>
    )
}