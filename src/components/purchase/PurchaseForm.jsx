import { useMemo } from 'react'

export function PurchaseForm({
    form,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
    products,
    productsLoading,
    suppliers,
    suppliersLoading
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
    const inputClass = (error) =>
        `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
            : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
        }`
    return (
        <form onSubmit={onSubmit} className="space-y-5">

            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Purchase Details
                </h2>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Enter the details of the purchase below.
                </p>
            </div>

            {/* Date + Product */}
            <div className="grid gap-4 sm:grid-cols-2">

                {/* Date */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="date"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Purchase Date
                        <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={form.date}
                        onChange={onChange}
                        disabled={isSubmitting}
                        className={inputClass(errors.date)}
                    />

                    {errors.date && (
                        <p className="text-xs text-rose-600">
                            {errors.date}
                        </p>
                    )}
                </div>

                {/* Product */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="product_id"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Product
                        <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <select
                        id="product_id"
                        name="product_id"
                        value={form.product_id}
                        onChange={onChange}
                        disabled={
                            productsLoading ||
                            isSubmitting
                        }
                        className={inputClass(errors.product_id)}
                    >
                        <option value="">
                            {productsLoading
                                ? 'Loading products...'
                                : 'Select a product'}
                        </option>

                        {products.map((product) => (
                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.name}
                            </option>
                        ))}
                    </select>

                    {errors.product_id && (
                        <p className="text-xs text-rose-600">
                            {errors.product_id}
                        </p>
                    )}
                </div>
                {/* Supplier */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="product_id"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Supplier
                        <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <select
                        id="supplier_id"
                        name="supplier_id"
                        value={form.supplier_id}
                        onChange={onChange}
                        disabled={
                            suppliersLoading ||
                            isSubmitting
                        }
                        className={inputClass(errors.supplier_id)}
                    >
                        <option value="">
                            {suppliersLoading
                                ? 'Loading supplier...'
                                : 'Select a supplier'}
                        </option>

                        {suppliers.map((supplier) => (
                            <option
                                key={supplier.id}
                                value={supplier.id}
                            >
                                {supplier.name}
                            </option>
                        ))}
                    </select>

                    {errors.supplier_id && (
                        <p className="text-xs text-rose-600">
                            {errors.supplier_id}
                        </p>
                    )}
                </div>
            </div>

            {/* Quantity + Rate + MRP */}
            <div className="grid gap-4 sm:grid-cols-3">

                {/* Quantity */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Quantity
                        <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <div className="relative">
                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            value={form.quantity}
                            onChange={onChange}
                            placeholder="20"
                            disabled={isSubmitting}
                            inputMode="numeric"
                            className={`${inputClass(
                                errors.quantity
                            )} pr-16`}
                        />

                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400">
                            boxes
                        </span>
                    </div>

                    {errors.quantity && (
                        <p className="text-xs text-rose-600">
                            {errors.quantity}
                        </p>
                    )}
                </div>

                {/* Purchase Rate */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="rate"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Purchase Rate
                        <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                            ₹
                        </span>

                        <input
                            id="rate"
                            name="rate"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.rate}
                            onChange={onChange}
                            placeholder="180"
                            disabled={isSubmitting}
                            inputMode="decimal"
                            className={`${inputClass(
                                errors.rate
                            )} pl-7`}
                        />
                    </div>

                    {errors.rate && (
                        <p className="text-xs text-rose-600">
                            {errors.rate}
                        </p>
                    )}
                </div>

                {/* MRP */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="mrp"
                        className="block text-sm font-medium text-slate-700"
                    >
                        MRP
                        <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
                            ₹
                        </span>

                        <input
                            id="mrp"
                            name="mrp"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.mrp}
                            onChange={onChange}
                            placeholder="240"
                            disabled={isSubmitting}
                            inputMode="decimal"
                            className={`${inputClass(
                                errors.mrp
                            )} pl-7`}
                        />
                    </div>

                    {errors.mrp && (
                        <p className="text-xs text-rose-600">
                            {errors.mrp}
                        </p>
                    )}
                </div>
            </div>

            {/* Selected Product */}
            {selectedProduct && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                    {/* Product Header */}
                    <div className="border-b border-slate-200 bg-white px-4 py-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-sky-600">
                            Selected Product
                        </p>

                        <h3 className="mt-0.5 text-sm font-semibold text-slate-900">
                            {selectedProduct.name}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3">

                        <div className="bg-slate-50 p-3">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                Per Box
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {selectedProduct.quantity_per_box}
                                {' '}units
                            </p>
                        </div>

                        <div className="bg-slate-50 p-3">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                Current Stock
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {Number(
                                    selectedProduct.stock || 0
                                )}
                                {' '}boxes
                            </p>
                        </div>

                        <div className="col-span-2 bg-slate-50 p-3 sm:col-span-1">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                Purchase Total
                            </p>

                            <p className="mt-1 text-base font-bold text-sky-700">
                                ₹
                                {Number(
                                    total || 0
                                ).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit */}
            <div className="border-t border-slate-100 pt-4">
                <button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        !form.product_id
                    }
                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Recording Purchase...
                        </span>
                    ) : (
                        'Record Purchase'
                    )}
                </button>
            </div>
        </form>
    )
}