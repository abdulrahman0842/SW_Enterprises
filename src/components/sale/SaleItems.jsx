import { useState } from 'react'

export function SaleItems({
    products,
    items,
    setItems,
    onContinue,
    errors,
}) {
    const [selectedProductId, setSelectedProductId] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [mrp, setMrp] = useState('')

    const selectedProduct = products.find(
        (product) => product.id === Number(selectedProductId)
    )

    function handleProductChange(value) {
        setSelectedProductId(value)
        setQuantity(1)

        const product = products.find(
            (product) => product.id === Number(value)
        )

        setMrp(product ? String(product.mrp ?? '') : '')
    }

    function handleAddProduct() {
        if (!selectedProduct) return

        const boxes = Number(quantity)
        const salePrice = Number(mrp)
        const purchaseRate = Number(selectedProduct.rate || 0)

        if (!Number.isFinite(salePrice) || salePrice < 0) {
            return
        }

        if (!Number.isInteger(boxes) || boxes < 1) {
            return
        }

        if (boxes > Number(selectedProduct.stock)) {
            return
        }

        const existingItem = items.find(
            (item) => item.product_id === selectedProduct.id
        )

        if (existingItem) {
            setItems((currentItems) =>
                currentItems.map((item) =>
                    item.product_id === selectedProduct.id
                        ? {
                            ...item,
                            quantity: boxes,
                            mrp: salePrice,
                            rate: purchaseRate,
                        }
                        : item
                )
            )
        } else {
            setItems((currentItems) => [
                ...currentItems,
                {
                    product_id: selectedProduct.id,
                    product_name: selectedProduct.name,
                    quantity: boxes,
                    rate: purchaseRate,
                    mrp: salePrice,
                },
            ])
        }

        setSelectedProductId('')
        setQuantity(1)
        setMrp('')
    }

    function handleRemoveProduct(productId) {
        setItems((currentItems) =>
            currentItems.filter(
                (item) => item.product_id !== productId
            )
        )
    }

    function changeQuantity(productId, change) {
        const product = products.find(
            (item) => item.id === productId
        )

        const currentItem = items.find(
            (item) => item.product_id === productId
        )

        if (!product || !currentItem) return

        const newQuantity =
            currentItem.quantity + change

        if (newQuantity < 1) return

        if (newQuantity > Number(product.stock)) return

        setItems((currentItems) =>
            currentItems.map((item) =>
                item.product_id === productId
                    ? {
                        ...item,
                        quantity: newQuantity,
                    }
                    : item
            )
        )
    }

    function handleSelectedQuantityChange(change) {
        if (!selectedProduct) return

        const newQuantity = quantity + change

        if (newQuantity < 1) return

        if (
            newQuantity >
            Number(selectedProduct.stock)
        ) {
            return
        }

        setQuantity(newQuantity)
    }

    function calculateTotal() {
        return items.reduce(
            (total, item) =>
                total + item.quantity * item.mrp,
            0
        )
    }

    return (
        <div className="min-h-full ">
            {/* Product selector */}
            <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900">
                    Add products
                </h3>

                <div>
                    <label
                        htmlFor="product"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Product
                    </label>

                    <select
                        id="product"
                        value={selectedProductId}
                        onChange={(e) =>
                            handleProductChange(
                                e.target.value
                            )
                        }
                        className="h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                        <option value="">
                            Select product
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
                </div>


                {/* Selected product information */}
                {selectedProduct && (
                    <div className="rounded-xl bg-slate-50 p-4">
                        {/* Product header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {selectedProduct.name}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {selectedProduct.stock} boxes available
                                </p>
                            </div>
                        </div>

                        {/* MRP + Quantity */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            {/* MRP */}
                            <div>
                                <label
                                    htmlFor="saleMrp"
                                    className="mb-1.5 block text-xs font-medium text-slate-600"
                                >
                                    MRP / Box
                                </label>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                        ₹
                                    </span>

                                    <input
                                        id="saleMrp"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={mrp}
                                        onChange={(e) =>
                                            setMrp(e.target.value)
                                        }
                                        className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-7 pr-3 text-sm font-medium text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                    />
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                    Boxes
                                </label>

                                <div className="flex h-11 items-center rounded-xl border border-slate-300 bg-white">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSelectedQuantityChange(-1)
                                        }
                                        disabled={quantity <= 1}
                                        className="flex h-full w-10 items-center justify-center text-lg text-slate-600 disabled:text-slate-300"
                                    >
                                        −
                                    </button>

                                    <span className="flex-1 text-center text-sm font-semibold text-slate-900">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSelectedQuantityChange(1)
                                        }
                                        disabled={
                                            quantity >=
                                            Number(selectedProduct.stock)
                                        }
                                        className="flex h-full w-10 items-center justify-center text-lg text-slate-600 disabled:text-slate-300"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sale preview */}
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2.5">
                            <span className="text-xs text-slate-500">
                                Item total
                            </span>

                            <span className="text-sm font-semibold text-slate-900">
                                ₹
                                {(
                                    Number(mrp || 0) * quantity
                                ).toFixed(2)}
                            </span>
                        </div>

                        {/* Add button */}
                        <div className="mt-3 flex justify-end">
                            <button
                                type="button"
                                onClick={handleAddProduct}
                                disabled={
                                    !mrp ||
                                    Number(mrp) < 0 ||
                                    quantity < 1
                                }
                                className="h-10 rounded-lg border border-sky-600 bg-white px-5 text-sm font-semibold text-sky-600 transition active:bg-sky-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                            >
                                + Add Item
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Selected items */}
            {items.length > 0 && (
                <section className="mt-6 rounded-2xl bg-slate-100 p-3">
                    {/* Section header */}
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Sale items
                        </h3>

                        <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs font-medium text-white">
                            {items.length}{' '}
                            {items.length === 1
                                ? 'product'
                                : 'products'}
                        </span>
                    </div>
                    {/* Items list */}
                    <div className="space-y-2.5">
                        {items.map((item) => (
                            <div
                                key={item.product_id}
                                className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
                            >
                                {/* Product information */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {item.product_name}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            ₹{Number(item.rate).toFixed(2)}  P.Rate
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveProduct(
                                                item.product_id
                                            )
                                        }
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-base text-slate-400 transition active:bg-rose-50 active:text-rose-600"
                                        aria-label={`Remove ${item.product_name}`}
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* Quantity + total */}
                                <div className="mt-3 flex items-center justify-between">
                                    {/* Quantity control */}
                                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeQuantity(
                                                    item.product_id,
                                                    -1
                                                )
                                            }
                                            disabled={item.quantity <= 1}
                                            className="flex h-8 w-8 items-center justify-center text-base text-slate-600 disabled:text-slate-300"
                                        >
                                            −
                                        </button>

                                        <span className="w-9 text-center text-xs font-semibold text-slate-900">
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeQuantity(
                                                    item.product_id,
                                                    1
                                                )
                                            }
                                            className="flex h-8 w-8 items-center justify-center text-base text-slate-600"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Item total */}
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400">
                                            Total
                                        </p>

                                        <p className="text-sm font-bold text-slate-900">
                                            ₹
                                            {(
                                                item.quantity *
                                                item.mrp
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {errors.items && (
                <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-600">
                    {errors.items}
                </p>
            )}

            {/* Bottom action */}
            <div className="mt-4 border-t border-slate-300 pt-4">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">
                        Total
                    </span>

                    <span className="text-lg font-bold text-slate-900">
                        ₹{calculateTotal().toFixed(2)}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={onContinue}
                    disabled={items.length === 0}
                    className="h-11 w-full rounded-xl bg-sky-600 text-sm font-semibold text-white transition active:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    Continue to Checkout
                </button>
            </div>
        </div>
    )
}