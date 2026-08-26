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
    const selectedCustomer = customers.find(
        (customer) => String(customer.id) === String(customerId)
    )
    return (
        <div className="space-y-4">
            {/* Date + Customer */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4" >
                <div className="grid grid-cols-2 gap-3">
                    {/* Sale Date */}
                    <div>
                        <label
                            htmlFor="saleDate"
                            className="mb-1.5 block text-xs font-medium text-slate-600"
                        >
                            Sale date
                        </label>

                        <input
                            id="saleDate"
                            type="date"
                            value={saleDate}
                            onChange={(e) =>
                                setSaleDate(e.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        />

                        {errors.date && (
                            <p className="mt-1 text-xs text-rose-600">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    {/* Customer */}
                    <div>
                        <label
                            htmlFor="customer"
                            className="mb-1.5 block text-xs font-medium text-slate-600"
                        >
                            Customer
                        </label>

                        <select
                            id="customer"
                            value={customerId}
                            onChange={(e) =>
                                setCustomerId(e.target.value)
                            }
                            className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                        >
                            <option value="">
                                Select customer
                            </option>

                            {customers.map((customer) => (
                                <option
                                    key={customer.id}
                                    value={customer.id}
                                >
                                    {customer.name}
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

                {/* Selected Customer */}
                {selectedCustomer && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                        <div className="min-w-0">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                Customer
                            </p>

                            <p className="truncate text-sm font-semibold text-slate-900">
                                {selectedCustomer.name}
                            </p>
                        </div>

                        {selectedCustomer.contact && (
                            <span className="ml-3 shrink-0 text-xs text-slate-500">
                                {selectedCustomer.contact}
                            </span>
                        )}
                    </div>
                )}
            </section>

            {/* Summary */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
                                    {item.mrp.toFixed(2)}
                                </p>
                            </div>

                            <span className="shrink-0 text-sm font-semibold text-slate-900">
                                ₹
                                {(
                                    item.quantity *
                                    item.mrp
                                ).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-4 border-t border-slate-200 pt-3">
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
            <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <h3 className="mb-4 text-sm font-semibold text-slate-900">
                    Payment
                </h3>

                <div className="space-y-4">
                    {/* Payment Status */}
                    <div>
                        <label
                            htmlFor="paymentStatus"
                            className="mb-1.5 block text-xs font-medium text-slate-600"
                        >
                            Payment status
                        </label>

                        <select
                            id="paymentStatus"
                            value={paymentStatus}
                            onChange={(e) =>
                                handlePaymentStatusChange(
                                    e.target.value
                                )
                            }
                            className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
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

                    {/* Amount Paid */}
                    {paymentStatus !== 'Pending' && (
                        <div>
                            <label
                                htmlFor="amountPaid"
                                className="mb-1.5 block text-xs font-medium text-slate-600"
                            >
                                Amount paid
                            </label>

                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                    ₹
                                </span>

                                <input
                                    id="amountPaid"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amountPaid}
                                    onChange={(e) =>
                                        setAmountPaid(
                                            e.target.value
                                        )
                                    }
                                    className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 pl-8 pr-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                                />
                            </div>
                        </div>
                    )}

                    {/* Payment Error */}
                    {errors.payment && (
                        <div className="rounded-lg bg-rose-50 px-3 py-2.5 text-xs text-rose-600">
                            {errors.payment}
                        </div>
                    )}

                    {/* Summary */}
                    <div className="border-t border-slate-200 pt-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Total
                                </span>

                                <span className="font-medium text-slate-900">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">
                                    Paid
                                </span>

                                <span className="font-medium text-slate-900">
                                    ₹
                                    {Number(
                                        amountPaid || 0
                                    ).toFixed(2)}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-sm font-semibold text-slate-900">
                                    Balance
                                </span>

                                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-sm font-bold text-amber-700">
                                    ₹{balance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="sticky bottom-0 -mx-4 mt-5 border-t border-slate-300 bg-white/95 px-4 pb-1 pt-3 backdrop-blur">
                <div className="grid grid-cols-[auto_1fr] gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isLoading}
                        className="h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition active:bg-slate-100 disabled:opacity-50"
                    >
                        ← Back
                    </button>

                    <button
                        type="submit"
                        disabled={
                            isLoading ||
                            !customerId
                        }
                        className="h-11 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition active:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {isLoading
                            ? 'Creating Sale...'
                            : `Create Sale • ₹${total.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    )
}