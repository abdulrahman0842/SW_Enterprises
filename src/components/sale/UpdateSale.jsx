import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { getSaleById, updateSale } from '../../services/salesService'
import { fetchCustomers } from '../../services/customersService'
import { fetchProducts } from '../../services/productsService'

export default function UpdateSale() {
    const { saleId } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])

    const [sale, setSale] = useState(null)

    const [formData, setFormData] = useState({
        date: '',
        customer_id: '',
        items: [],
        total_amount: 0,
        payment_status: 'Pending',
        amount_paid: 0,
        balance_amount: 0,
    })

    // --------------------------------
    // Load sale + customers + products
    // --------------------------------

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                setError('')

                const [
                    saleData,
                    customersData,
                    productsData,
                ] = await Promise.all([
                    getSaleById(saleId),
                    fetchCustomers(),
                    fetchProducts(),
                ])

                if (!saleData) {
                    throw new Error('Sale not found.')
                }
                console.log("Update", saleData)
                setSale(saleData)
                setCustomers(customersData || [])
                setProducts(productsData || [])

                setFormData({
                    date: saleData.date || '',
                    customer_id: saleData.customer_id || '',
                    items: (saleData.items || []).map(item => ({
                        product_id: Number(item.product_id),
                        quantity: Number(item.quantity || 0),
                        rate: Number(item.rate || 0),
                        mrp: Number(item.mrp || 0),
                    })),
                    total_amount: Number(
                        saleData.total_amount || 0
                    ),
                    payment_status:
                        saleData.payment_status || 'Pending',
                    amount_paid: Number(
                        saleData.amount_paid || 0
                    ),
                    balance_amount: Number(
                        saleData.balance_amount || 0
                    ),
                })
            } catch (err) {
                console.error(
                    'Failed to load sale:',
                    err
                )

                setError(
                    err.message ||
                    'Failed to load sale.'
                )
            } finally {
                setLoading(false)
            }
        }

        if (saleId) {
            loadData()
        }
    }, [saleId])

    // --------------------------------
    // Product lookup
    // --------------------------------

    function getProduct(productId) {
        return products.find(
            product =>
                Number(product.id) ===
                Number(productId)
        )
    }

    // --------------------------------
    // Calculate total
    // --------------------------------

    const total = useMemo(() => {
        return formData.items.reduce(
            (sum, item) =>
                sum +
                Number(item.quantity || 0) *
                Number(item.mrp || 0),
            0
        )
    }, [formData.items])

    // --------------------------------
    // Calculate balance
    // --------------------------------

    const balance = useMemo(() => {
        const paid = Number(
            formData.amount_paid || 0
        )

        if (formData.payment_status === 'Paid') {
            return 0
        }

        if (
            formData.payment_status ===
            'Pending'
        ) {
            return total
        }

        return Math.max(total - paid, 0)
    }, [
        total,
        formData.amount_paid,
        formData.payment_status,
    ])

    // --------------------------------
    // Form changes
    // --------------------------------

    function handleChange(e) {
        const {
            name,
            value,
        } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    // --------------------------------
    // Payment status
    // --------------------------------

    function handlePaymentStatusChange(status) {
        setFormData(prev => {
            let amountPaid = prev.amount_paid

            if (status === 'Pending') {
                amountPaid = 0
            }

            if (status === 'Paid') {
                amountPaid = total
            }

            return {
                ...prev,
                payment_status: status,
                amount_paid: amountPaid,
            }
        })
    }

    // --------------------------------
    // Quantity
    // --------------------------------

    function updateQuantity(productId, change) {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (
                    Number(item.product_id) !==
                    Number(productId)
                ) {
                    return item
                }

                const newQuantity =
                    Number(item.quantity) +
                    change

                if (newQuantity < 1) {
                    return item
                }

                return {
                    ...item,
                    quantity: newQuantity,
                }
            }),
        }))
    }

    function handleQuantityChange(
        productId,
        value
    ) {
        const quantity = Number(value)

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return
        }

        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item =>
                Number(item.product_id) ===
                    Number(productId)
                    ? {
                        ...item,
                        quantity,
                    }
                    : item
            ),
        }))
    }

    // --------------------------------
    // MRP
    // --------------------------------

    function handleMrpChange(
        productId,
        value
    ) {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item =>
                Number(item.product_id) ===
                    Number(productId)
                    ? {
                        ...item,
                        mrp: value,
                    }
                    : item
            ),
        }))
    }

    // --------------------------------
    // Remove item
    // --------------------------------

    function removeItem(productId) {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(
                item =>
                    Number(item.product_id) !==
                    Number(productId)
            ),
        }))
    }

    // --------------------------------
    // Add product
    // --------------------------------

    function addProduct(productId) {
        if (!productId) return

        const product = getProduct(productId)

        if (!product) return

        const exists =
            formData.items.some(
                item =>
                    Number(item.product_id) ===
                    Number(product.id)
            )

        if (exists) {
            updateQuantity(product.id, 1)
            return
        }

        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    product_id: Number(product.id),
                    quantity: 1,
                    rate: Number(
                        product.rate || 0
                    ),
                    mrp: Number(
                        product.mrp || 0
                    ),
                },
            ],
        }))
    }

    // --------------------------------
    // Validation
    // --------------------------------

    function validateForm() {
        if (!formData.date) {
            setError('Sale date is required.')
            return false
        }

        if (!formData.customer_id) {
            setError('Please select a customer.')
            return false
        }

        if (!formData.items.length) {
            setError(
                'Sale must contain at least one item.'
            )
            return false
        }

        const paid = Number(
            formData.amount_paid || 0
        )

        if (
            Number.isNaN(paid) ||
            paid < 0
        ) {
            setError(
                'Amount paid must be a valid amount.'
            )
            return false
        }

        if (paid > total) {
            setError(
                'Amount paid cannot be greater than total.'
            )
            return false
        }

        if (
            formData.payment_status ===
            'Paid' &&
            paid !== total
        ) {
            setError(
                'For Paid status, amount paid must equal the total.'
            )
            return false
        }

        if (
            formData.payment_status ===
            'Pending' &&
            paid !== 0
        ) {
            setError(
                'For Pending status, amount paid must be 0.'
            )
            return false
        }

        if (
            formData.payment_status ===
            'Partial' &&
            !(
                paid > 0 &&
                paid < total
            )
        ) {
            setError(
                'For Partial payment, amount paid must be greater than 0 and less than total.'
            )
            return false
        }

        for (const item of formData.items) {
            if (
                Number(item.quantity) < 1
            ) {
                setError(
                    'Item quantity must be at least 1.'
                )
                return false
            }

            if (
                Number(item.mrp) <= 0
            ) {
                setError(
                    'Item MRP must be greater than 0.'
                )
                return false
            }
        }

        return true
    }

    // --------------------------------
    // Submit
    // --------------------------------

    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setSaving(true)
            setError('')

            const paid = Number(
                formData.amount_paid || 0
            )

            const saleData = {
                date: formData.date,
                customer_id: Number(
                    formData.customer_id
                ),
                items: formData.items.map(
                    item => ({
                        product_id:
                            Number(
                                item.product_id
                            ),
                        quantity:
                            Number(
                                item.quantity
                            ),
                        rate:
                            Number(
                                item.rate || 0
                            ),
                        mrp:
                            Number(
                                item.mrp
                            ),
                    })
                ),
                total_amount: total,
                payment_status:
                    formData.payment_status,
                amount_paid: paid,
                balance_amount: balance,
            }

            console.log(
                'Updating sale:',
                saleData
            )

            await updateSale(
                saleId,
                saleData
            )

            // Go back to sales page after successful update
            navigate('/sales')
        } catch (err) {
            console.error(
                'Failed to update sale:',
                err
            )

            setError(
                err.message ||
                'Failed to update sale.'
            )
        } finally {
            setSaving(false)
        }
    }

    // --------------------------------
    // Loading
    // --------------------------------

    if (loading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-slate-500">
                    Loading sale...
                </p>
            </div>
        )
    }

    // --------------------------------
    // Error / not found
    // --------------------------------

    if (!sale) {
        return (
            <div className="mx-auto w-full max-w-5xl">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm text-rose-700">
                        {error ||
                            'Sale not found.'}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                '/sales'
                            )
                        }
                        className="mt-3 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                        Back
                    </button>
                </div>
            </div>
        )
    }

    // --------------------------------
    // UI
    // --------------------------------

    return (
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4">

            {/* Header */}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="text-lg font-semibold text-slate-900">
                        Update Sale
                    </h1>

                    <p className="mt-0.5 text-xs text-slate-500">
                        Sale #{sale.id}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/sales')}
                    disabled={saving}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 sm:w-auto"
                >
                    Back
                </button>
            </div>

            {/* Error */}

            {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
                    <p className="text-xs text-rose-700">
                        {error}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    {/* Sale Information */}

                    <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Sale Information
                        </h2>
                    </div>

                    <div className="grid gap-4 p-4 sm:grid-cols-2">
                        {/* Date */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                                Sale Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>

                        {/* Customer */}
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                                Customer
                            </label>

                            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                                <p className="truncate text-sm font-medium text-slate-800">
                                    {sale?.customer_name || 'Unknown customer'}
                                </p>

                                {sale?.customer_contact && (
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {sale.customer_contact}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items */}

                    <div className="border-t border-slate-200">

                        <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-slate-900">
                                    Sale Items
                                </h2>

                                <span className="text-xs text-slate-500">
                                    {formData.items.length}{' '}
                                    items
                                </span>
                            </div>
                        </div>

                        <div className="p-4">

                            {/* Add product */}

                            <div className="mb-4">
                                <select
                                    defaultValue=""
                                    onChange={e => {
                                        addProduct(
                                            e.target.value
                                        )
                                        e.target.value =
                                            ''
                                    }}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                >
                                    <option value="">
                                        + Add product
                                    </option>

                                    {products.map(
                                        product => (
                                            <option
                                                key={
                                                    product.id
                                                }
                                                value={
                                                    product.id
                                                }
                                            >
                                                {
                                                    product.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Items */}

                            {formData.items.length > 0 ? (
                                <>
                                    {/* ================= MOBILE ================= */}
                                    <div className="space-y-3 md:hidden">
                                        {formData.items.map(item => {
                                            const product = getProduct(item.product_id)

                                            const itemTotal =
                                                Number(item.quantity) *
                                                Number(item.mrp)

                                            return (
                                                <div
                                                    key={item.product_id}
                                                    className="rounded-lg border border-slate-200 bg-white p-3"
                                                >
                                                    {/* Product */}
                                                    <div className="mb-3 flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium text-slate-800">
                                                                {product?.name ||
                                                                    `Product #${item.product_id}`}
                                                            </p>

                                                            {product && (
                                                                <p className="mt-0.5 text-xs text-slate-400">
                                                                    {product.stock} boxes available
                                                                </p>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(item.product_id)
                                                            }
                                                            className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    {/* Rate + MRP */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="mb-1 text-[11px] font-medium text-slate-500">
                                                                Rate
                                                            </p>

                                                            <div className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                                                ₹{Number(item.rate || 0).toFixed(2)}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="mb-1 text-[11px] font-medium text-slate-500">
                                                                MRP / Box
                                                            </p>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={item.mrp}
                                                                onChange={e =>
                                                                    handleMrpChange(
                                                                        item.product_id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full rounded-md border border-slate-200 px-2 py-2 text-sm outline-none focus:border-sky-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[11px] font-medium text-slate-500">
                                                                Quantity
                                                            </p>

                                                            <div className="mt-1 flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.product_id,
                                                                            -1
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                >
                                                                    −
                                                                </button>

                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={e =>
                                                                        handleQuantityChange(
                                                                            item.product_id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="h-8 w-16 rounded-md border border-slate-200 px-2 text-center text-sm outline-none focus:border-sky-400"
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.product_id,
                                                                            1
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Total */}
                                                        <div className="text-right">
                                                            <p className="text-[11px] text-slate-500">
                                                                Total
                                                            </p>

                                                            <p className="mt-1 text-base font-semibold text-slate-900">
                                                                ₹{itemTotal.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* ================= DESKTOP ================= */}
                                    <div className="hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50">
                                                <tr className="border-b border-slate-200">
                                                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500">
                                                        Product
                                                    </th>

                                                    <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500">
                                                        Rate
                                                    </th>

                                                    <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-500">
                                                        Quantity
                                                    </th>

                                                    <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500">
                                                        MRP / Box
                                                    </th>

                                                    <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500">
                                                        Total
                                                    </th>

                                                    <th />
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {formData.items.map(item => {
                                                    const product = getProduct(item.product_id)

                                                    const itemTotal =
                                                        Number(item.quantity) *
                                                        Number(item.mrp)

                                                    return (
                                                        <tr
                                                            key={item.product_id}
                                                            className="border-b border-slate-100 last:border-0"
                                                        >
                                                            <td className="px-4 py-3">
                                                                <p className="font-medium text-slate-800">
                                                                    {product?.name ||
                                                                        `Product #${item.product_id}`}
                                                                </p>

                                                                {product && (
                                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                                        {product.stock} boxes available
                                                                    </p>
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-3 text-right text-slate-500">
                                                                ₹{Number(item.rate || 0).toFixed(2)}
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item.product_id,
                                                                                -1
                                                                            )
                                                                        }
                                                                        className="h-7 w-7 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                    >
                                                                        −
                                                                    </button>

                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        value={item.quantity}
                                                                        onChange={e =>
                                                                            handleQuantityChange(
                                                                                item.product_id,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="w-16 rounded border border-slate-200 px-2 py-1 text-center text-sm outline-none focus:border-sky-400"
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item.product_id,
                                                                                1
                                                                            )
                                                                        }
                                                                        className="h-7 w-7 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </td>

                                                            <td className="px-4 py-3">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={item.mrp}
                                                                    onChange={e =>
                                                                        handleMrpChange(
                                                                            item.product_id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="ml-auto block w-24 rounded border border-slate-200 px-2 py-1.5 text-right text-sm outline-none focus:border-sky-400"
                                                                />
                                                            </td>

                                                            <td className="px-4 py-3 text-right font-medium text-slate-800">
                                                                ₹{itemTotal.toFixed(2)}
                                                            </td>

                                                            <td className="px-4 py-3 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeItem(item.product_id)
                                                                    }
                                                                    className="rounded px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                                    No items in this sale.
                                </div>
                            )}

                            {/* Total */}

                            <div className="mt-4 flex justify-end">
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">
                                        Total
                                    </p>

                                    <p className="text-xl font-semibold text-slate-900">
                                        ₹
                                        {total.toFixed(
                                            2
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}

                    <div className="border-t border-slate-200">

                        <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Payment
                            </h2>
                        </div>

                        <div className="grid gap-4 p-4 sm:grid-cols-3">

                            {/* Total */}

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Total
                                </label>

                                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                                    ₹
                                    {total.toFixed(
                                        2
                                    )}
                                </div>
                            </div>

                            {/* Status */}

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Payment Status
                                </label>

                                <select
                                    value={
                                        formData.payment_status
                                    }
                                    onChange={e =>
                                        handlePaymentStatusChange(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                >
                                    <option value="Paid">
                                        Paid
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Partial">
                                        Partial
                                    </option>
                                </select>
                            </div>

                            {/* Amount paid */}

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Amount Paid
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        formData.amount_paid
                                    }
                                    disabled={
                                        formData.payment_status ===
                                        'Pending'
                                    }
                                    onChange={e =>
                                        setFormData(
                                            prev => ({
                                                ...prev,
                                                amount_paid:
                                                    e
                                                        .target
                                                        .value,
                                            })
                                        )
                                    }
                                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-50 disabled:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Payment summary */}

                        <div className="grid grid-cols-3 gap-3 px-4 pb-4">

                            <div className="rounded-lg bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">
                                    Total
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    ₹
                                    {total.toFixed(
                                        2
                                    )}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">
                                    Paid
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    ₹
                                    {Number(
                                        formData.amount_paid ||
                                        0
                                    ).toFixed(
                                        2
                                    )}
                                </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">
                                    Balance
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    ₹
                                    {balance.toFixed(
                                        2
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}

                    <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    '/sales'
                                )
                            }
                            disabled={saving}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-md bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? 'Updating...'
                                : 'Update Sale'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}









// import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// // import { updateSale } from '../services/sales'
// import { getSaleById } from '../../services/salesService'

// export default function UpdateSale() {
//     const [loading, setLoading] = useState(true)
//     const [saving, setSaving] = useState(false)
//     const [error, setError] = useState('')

//     const [sale, setSale] = useState(null)

//     const [formData, setFormData] = useState({
//         date: '',
//         customer_id: '',
//         items: [],
//         total_amount: 0,
//         payment_status: 'Pending',
//         amount_paid: 0,
//         balance_amount: 0,
//     })
//     const { saleId } = useParams()

//     // --------------------------------
//     // Load sale
//     // --------------------------------

//     useEffect(() => {
//         async function loadSale() {
//             try {
//                 setLoading(true)
//                 setError('')

//                 const data = await getSaleById(saleId)

//                 if (!data) {
//                     throw new Error('Sale not found.')
//                 }

//                 setSale(data)

//                 setFormData({
//                     date: data.date || '',
//                     customer_id: data.customer_id || '',
//                     items: data.items || [],
//                     total_amount: Number(
//                         data.total_amount || 0
//                     ),
//                     payment_status:
//                         data.payment_status || 'Pending',
//                     amount_paid: Number(
//                         data.amount_paid || 0
//                     ),
//                     balance_amount: Number(
//                         data.balance_amount || 0
//                     ),
//                 })
//             } catch (err) {
//                 console.error(
//                     'Failed to load sale:',
//                     err
//                 )

//                 setError(
//                     err.message ||
//                     'Failed to load sale.'
//                 )
//             } finally {
//                 setLoading(false)
//             }
//         }
//         loadSale()
//     }, [saleId])

//     function onBack() { }
//     function onUpdated() { }

//     // --------------------------------
//     // Form changes
//     // --------------------------------

//     function handleChange(e) {
//         const { name, value } = e.target

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }))
//     }

//     // --------------------------------
//     // Submit
//     // --------------------------------

//     async function handleSubmit(e) {
//         e.preventDefault()

//         try {
//             setSaving(true)
//             setError('')

//             const updatedSale =
//                 await updateSale(
//                     saleId,
//                     formData
//                 )

//             onUpdated?.(updatedSale)

//         } catch (err) {
//             console.error(
//                 'Failed to update sale:',
//                 err
//             )

//             setError(
//                 err.message ||
//                 'Failed to update sale.'
//             )
//         } finally {
//             setSaving(false)
//         }
//     }

//     // --------------------------------
//     // Loading
//     // --------------------------------

//     if (loading) {
//         return (
//             <div className="flex min-h-[300px] items-center justify-center">
//                 <p className="text-sm text-slate-500">
//                     Loading sale... {saleId}
//                 </p>
//             </div>
//         )
//     }

//     // --------------------------------
//     // Error
//     // --------------------------------

//     if (!sale) {
//         return (
//             <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
//                 <p className="text-sm text-rose-700">
//                     {error || 'Sale not found.'}
//                 </p>

//                 <button
//                     type="button"
//                     onClick={onBack}
//                     className="mt-3 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
//                 >
//                     Back
//                 </button>
//             </div>
//         )
//     }

//     return (
//         <div className="mx-auto w-full max-w-5xl">
//             {/* Header */}

//             <div className="mb-4 flex items-center justify-between">
//                 <div>
//                     <h1 className="text-lg font-semibold text-slate-900">
//                         Edit Sale
//                     </h1>

//                     <p className="mt-0.5 text-xs text-slate-500">
//                         Sale #{sale.id}
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     onClick={onBack}
//                     disabled={saving}
//                     className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
//                 >
//                     Back
//                 </button>
//             </div>

//             {/* Error */}

//             {error && (
//                 <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
//                     <p className="text-xs text-rose-700">
//                         {error}
//                     </p>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit}>
//                 <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

//                     {/* Sale information */}

//                     <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
//                         <h2 className="text-sm font-semibold text-slate-900">
//                             Sale Information
//                         </h2>
//                     </div>

//                     <div className="grid gap-4 p-4 sm:grid-cols-2">

//                         {/* Date */}

//                         <div>
//                             <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 Sale Date
//                             </label>

//                             <input
//                                 type="date"
//                                 name="date"
//                                 value={formData.date}
//                                 onChange={handleChange}
//                                 className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//                             />
//                         </div>

//                         {/* Customer */}

//                         <div>
//                             <label className="mb-1 block text-xs font-medium text-slate-600">
//                                 Customer
//                             </label>

//                             {/* Replace with your existing customer selector */}

//                             <select
//                                 name="customer_id"
//                                 value={
//                                     formData.customer_id
//                                 }
//                                 onChange={handleChange}
//                                 className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//                             >
//                                 <option value="">
//                                     Select customer
//                                 </option>

//                                 {/* customer options */}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Items */}

//                     <div className="border-t border-slate-200">

//                         <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
//                             <h2 className="text-sm font-semibold text-slate-900">
//                                 Sale Items
//                             </h2>
//                         </div>

//                         <div className="p-4">
//                             {/*
//                                 Put your existing
//                                 SaleItemTable / AddItemForm
//                                 here.
//                             */}

//                             <p className="text-sm text-slate-400">
//                                 Sale items will appear here.
//                             </p>
//                         </div>
//                     </div>

//                     {/* Payment */}

//                     <div className="border-t border-slate-200">

//                         <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3">
//                             <h2 className="text-sm font-semibold text-slate-900">
//                                 Payment
//                             </h2>
//                         </div>

//                         <div className="grid gap-4 p-4 sm:grid-cols-3">

//                             <div>
//                                 <label className="mb-1 block text-xs font-medium text-slate-600">
//                                     Total
//                                 </label>

//                                 <input
//                                     type="number"
//                                     value={
//                                         formData.total_amount
//                                     }
//                                     readOnly
//                                     className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="mb-1 block text-xs font-medium text-slate-600">
//                                     Payment Status
//                                 </label>

//                                 <select
//                                     name="payment_status"
//                                     value={
//                                         formData.payment_status
//                                     }
//                                     onChange={
//                                         handleChange
//                                     }
//                                     className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//                                 >
//                                     <option value="Paid">
//                                         Paid
//                                     </option>

//                                     <option value="Pending">
//                                         Pending
//                                     </option>

//                                     <option value="Partial">
//                                         Partial
//                                     </option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="mb-1 block text-xs font-medium text-slate-600">
//                                     Amount Paid
//                                 </label>

//                                 <input
//                                     type="number"
//                                     name="amount_paid"
//                                     value={
//                                         formData.amount_paid
//                                     }
//                                     onChange={
//                                         handleChange
//                                     }
//                                     min="0"
//                                     step="0.01"
//                                     className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Footer */}

//                     <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/50 px-4 py-3">

//                         <button
//                             type="button"
//                             onClick={onBack}
//                             disabled={saving}
//                             className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
//                         >
//                             Cancel
//                         </button>

//                         <button
//                             type="submit"
//                             disabled={saving}
//                             className="rounded-md bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
//                         >
//                             {saving
//                                 ? 'Updating...'
//                                 : 'Update Sale'}
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     )
// }