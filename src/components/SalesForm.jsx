import { useEffect, useImperativeHandle, useState } from 'react'
import { forwardRef } from 'react'
import { fetchCustomers } from '../services/customersService'
import { fetchProducts } from '../services/productsService'

export const SalesForm = forwardRef(function SalesForm({ onSubmit, isLoading = false }, ref) {
    const [customers, setCustomers] = useState([])
    const [products, setProducts] = useState([])
    const [loadingData, setLoadingData] = useState(true)

    // Customer section state
    const [customerType, setCustomerType] = useState('existing') // 'existing' or 'new'
    const [selectedCustomerId, setSelectedCustomerId] = useState(null)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [customerContact, setCustomerContact] = useState('')

    // Items section state
    const [items, setItems] = useState([])
    const [selectedProductId, setSelectedProductId] = useState('')
    const [addItemQuantity, setAddItemQuantity] = useState('1')
    const [addItemRate, setAddItemRate] = useState('')
    const [paymentStatus, setPaymentStatus] = useState('Pending')
    const [amountPaid, setAmountPaid] = useState('0')
    const [errors, setErrors] = useState({})

    // Expose reset method via ref
    useImperativeHandle(ref, () => ({
        resetForm: resetForm,
    }))

    function resetForm() {
        setCustomerType('existing')
        setSelectedCustomerId(null)
        setSelectedCustomer(null)
        setCustomerContact('')
        setItems([])
        setSelectedProductId('')
        setAddItemQuantity('1')
        setAddItemRate('')
        setPaymentStatus('Pending')
        setAmountPaid('0')
        setErrors({})
    }

    // Load customers and products on mount
    useEffect(() => {
        async function loadData() {
            try {
                const [customersData, productsData] = await Promise.all([
                    fetchCustomers(),
                    fetchProducts(),
                ])
                setCustomers(customersData)
                setProducts(productsData)
            } catch (error) {
                console.error('Failed to load data:', error)
            } finally {
                setLoadingData(false)
            }
        }
        loadData()
    }, [])

    // Handle customer type change
    function handleCustomerTypeChange(type) {
        setCustomerType(type)
        setSelectedCustomerId(null)
        setSelectedCustomer(null)
        setCustomerContact('')
        setErrors((prev) => ({ ...prev, customer: '' }))
    }

    // Handle existing customer selection
    function handleSelectCustomer(customerId) {
        const customer = customers.find((c) => c.id === customerId)
        setSelectedCustomerId(customerId)
        setSelectedCustomer(customer)
        setCustomerContact(customer?.contact || '')
        setErrors((prev) => ({ ...prev, customer: '' }))
    }

    // Handle adding a product to items
    function handleAddItem() {
        const newErrors = {}

        if (!selectedProductId) {
            newErrors.product = 'Please select a product'
        }

        const quantity = parseInt(addItemQuantity)
        if (!addItemQuantity || quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0'
        }

        const rate = parseFloat(addItemRate)
        if (!addItemRate || rate < 0) {
            newErrors.rate = 'Rate must be 0 or greater'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors((prev) => ({
                ...prev,
                addItem: newErrors,
            }))
            return
        }

        const product = products.find((p) => p.id === parseInt(selectedProductId))
        if (!product) {
            setErrors((prev) => ({
                ...prev,
                product: 'Product not found',
            }))
            return
        }

        // Check if product already exists in items
        const existingIndex = items.findIndex((item) => item.product_id === product.id)

        if (existingIndex >= 0) {
            // Update existing item
            const updatedItems = [...items]
            updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: parseInt(addItemQuantity),
                rate: parseFloat(addItemRate),
            }
            setItems(updatedItems)
        } else {
            // Add new item
            setItems((prev) => [
                ...prev,
                {
                    product_id: product.id,
                    product_name: product.name,
                    quantity_per_box: product.quantity_per_box,
                    rate: parseFloat(addItemRate),
                    mrp: product.mrp,
                    quantity: parseInt(addItemQuantity),
                },
            ])
        }

        // Reset form
        setSelectedProductId('')
        setAddItemQuantity('1')
        setAddItemRate('')
        setErrors((prev) => {
            const { addItem, ...rest } = prev
            return rest
        })
    }

    // Handle removing an item
    function handleRemoveItem(productId) {
        setItems((prev) => prev.filter((item) => item.product_id !== productId))
    }

    // Handle updating item quantity or rate
    function handleUpdateItem(productId, updates) {
        setItems((prev) =>
            prev.map((item) =>
                item.product_id === productId ? { ...item, ...updates } : item
            )
        )
    }

    // Calculate totals
    function calculateItemTotal(item) {
        return item.quantity * item.rate
    }

    function calculateBottles(item) {
        return item.quantity * item.quantity_per_box
    }

    function calculateGrandTotal() {
        return items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
    }

    function calculateBalance() {
        const total = calculateGrandTotal()
        const paid = Number(amountPaid || 0)

        if (paymentStatus === 'Paid') {
            return 0
        }

        if (paymentStatus === 'Pending') {
            return total
        }

        return Math.max(total - paid, 0)
    }

    function getPaymentStatusClass(status) {
        if (status === 'Paid') {
            return 'bg-emerald-100 text-emerald-700'
        }

        if (status === 'Partial') {
            return 'bg-amber-100 text-amber-700'
        }

        return 'bg-slate-100 text-slate-700'
    }

    // Validate form before submission
    function validateForm() {
        const newErrors = {}

        if (customerType === 'existing') {
            if (!selectedCustomerId) {
                newErrors.customer = 'Please select a customer'
            }
        } else {
            if (!selectedCustomer?.name?.trim()) {
                newErrors.customerName = 'Customer name is required'
            }
            if (!customerContact?.trim()) {
                newErrors.customerContact = 'Customer contact is required'
            }
        }

        if (items.length === 0) {
            newErrors.items = 'Please add at least one product to the sale'
        }

        const total = calculateGrandTotal()
        const paid = Number(amountPaid || 0)

        if (!['Paid', 'Pending', 'Partial'].includes(paymentStatus)) {
            newErrors.paymentStatus = 'Invalid payment status'
        }

        if (paymentStatus === 'Paid') {
            if (paid !== total) {
                newErrors.payment = 'Paid status requires amount paid to equal the total amount.'
            }
        } else if (paymentStatus === 'Pending') {
            if (paid !== 0) {
                newErrors.payment = 'Pending status requires amount paid to be zero.'
            }
        } else if (paymentStatus === 'Partial') {
            if (!(paid > 0 && paid < total)) {
                newErrors.payment = 'Partial status requires amount paid to be greater than zero and less than total.'
            }
        }

        if (Number.isNaN(paid) || paid < 0) {
            newErrors.payment = 'Amount paid must be a valid non-negative number.'
        }

        return newErrors
    }

    function handleSubmit(e) {
        e.preventDefault()

        const newErrors = validateForm()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const total = calculateGrandTotal()
        const paid = Number(amountPaid || 0)

        const saleData = {
            customer_id: customerType === 'existing' ? selectedCustomerId : null,
            customer_name:
                customerType === 'existing' ? selectedCustomer.name : selectedCustomer?.name || '',
            customer_contact: customerContact,
            items: items,
            total_amount: total,
            payment_status: paymentStatus,
            amount_paid: paid,
            balance_amount: calculateBalance(),
        }

        onSubmit(saleData)
    }

    if (loadingData) {
    return (
        <div className="flex min-h-[220px] items-center justify-center">
            <div className="text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-sky-600" />

                <p className="mt-3 text-sm text-slate-500">
                    Loading sale form...
                </p>
            </div>
        </div>
    )
}

return (
    <form
        onSubmit={handleSubmit}
        className="space-y-5"
    >

        {/* =========================
            CUSTOMER
        ========================== */}
        <section className="rounded-xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                        Customer
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                        Select an existing customer or enter a one-time customer
                    </p>
                </div>
            </div>

            <div className="space-y-4 p-4 sm:p-5">

                {/* Customer Type */}
                <div className="grid grid-cols-2 gap-2">

                    <button
                        type="button"
                        onClick={() =>
                            handleCustomerTypeChange(
                                'existing'
                            )
                        }
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                            customerType ===
                            'existing'
                                ? 'border-sky-300 bg-sky-50 text-sky-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        Existing Customer
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            handleCustomerTypeChange(
                                'new'
                            )
                        }
                        className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                            customerType === 'new'
                                ? 'border-sky-300 bg-sky-50 text-sky-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        One-time Customer
                    </button>
                </div>

                {/* Existing Customer */}
                {customerType === 'existing' && (
                    <div className="space-y-3">

                        <div>
                            <label
                                htmlFor="customer"
                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                                Select Customer
                                <span className="ml-1 text-rose-500">
                                    *
                                </span>
                            </label>

                            <select
                                id="customer"
                                value={
                                    selectedCustomerId ||
                                    ''
                                }
                                onChange={(e) =>
                                    handleSelectCustomer(
                                        parseInt(
                                            e.target.value
                                        )
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                            >
                                <option value="">
                                    Choose a customer...
                                </option>

                                {customers.map(
                                    (customer) => (
                                        <option
                                            key={
                                                customer.id
                                            }
                                            value={
                                                customer.id
                                            }
                                        >
                                            {customer.name}
                                            {customer.contact
                                                ? ` (${customer.contact})`
                                                : ''}
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.customer && (
                                <p className="mt-1.5 text-xs text-rose-600">
                                    {errors.customer}
                                </p>
                            )}
                        </div>

                        {selectedCustomer && (
                            <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-3">
                                <div className="grid gap-3 sm:grid-cols-2">

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Customer
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {
                                                selectedCustomer.name
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contactEdit"
                                            className="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
                                        >
                                            Contact
                                        </label>

                                        <input
                                            id="contactEdit"
                                            type="text"
                                            value={
                                                customerContact
                                            }
                                            onChange={(e) =>
                                                setCustomerContact(
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                                        />
                                    </div>
                                </div>

                                {selectedCustomer.address && (
                                    <div className="mt-3 border-t border-sky-100 pt-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                            Address
                                        </p>

                                        <p className="mt-1 text-xs text-slate-600">
                                            {
                                                selectedCustomer.address
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* One-time Customer */}
                {customerType === 'new' && (
                    <div className="grid gap-3 sm:grid-cols-2">

                        <div>
                            <label
                                htmlFor="newCustomerName"
                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                                Customer Name
                                <span className="ml-1 text-rose-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="newCustomerName"
                                type="text"
                                value={
                                    selectedCustomer?.name ||
                                    ''
                                }
                                onChange={(e) =>
                                    setSelectedCustomer(
                                        (prev) => ({
                                            ...prev,
                                            name: e.target
                                                .value,
                                        })
                                    )
                                }
                                placeholder="Customer name"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                            />

                            {errors.customerName && (
                                <p className="mt-1.5 text-xs text-rose-600">
                                    {
                                        errors.customerName
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="newCustomerContact"
                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                                Contact
                                <span className="ml-1 text-rose-500">
                                    *
                                </span>
                            </label>

                            <input
                                id="newCustomerContact"
                                type="text"
                                value={
                                    customerContact
                                }
                                onChange={(e) =>
                                    setCustomerContact(
                                        e.target.value
                                    )
                                }
                                placeholder="Phone or contact"
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                            />

                            {errors.customerContact && (
                                <p className="mt-1.5 text-xs text-rose-600">
                                    {
                                        errors.customerContact
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>

        {/* =========================
            PRODUCTS
        ========================== */}
        <section className="rounded-xl border border-slate-200 bg-white">

            <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                            Products
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Add products to this sale
                        </p>
                    </div>

                    {items.length > 0 && (
                        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-700">
                            {items.length}{' '}
                            {items.length === 1
                                ? 'item'
                                : 'items'}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 sm:p-5">

                {/* Add Product */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">

                    <div className="grid gap-3 lg:grid-cols-[1.5fr_0.7fr_0.8fr_auto]">

                        <div>
                            <label
                                htmlFor="product"
                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                                Product
                            </label>

                            <select
                                id="product"
                                value={
                                    selectedProductId
                                }
                                onChange={(e) => {
                                    setSelectedProductId(
                                        e.target.value
                                    )

                                    if (
                                        e.target.value
                                    ) {
                                        const product =
                                            products.find(
                                                (p) =>
                                                    p.id ===
                                                    parseInt(
                                                        e.target
                                                            .value
                                                    )
                                            )

                                        if (product) {
                                            setAddItemRate(
                                                product.rate.toString()
                                            )
                                        }
                                    }

                                    setErrors(
                                        (prev) => {
                                            const {
                                                addItem:
                                                    _,
                                                ...rest
                                            } = prev

                                            return rest
                                        }
                                    )
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            >
                                <option value="">
                                    Choose product...
                                </option>

                                {products.map(
                                    (product) => {
                                        const isAdded =
                                            items.some(
                                                (item) =>
                                                    item.product_id ===
                                                    product.id
                                            )

                                        return (
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
                                                {isAdded
                                                    ? ' (added)'
                                                    : ''}
                                            </option>
                                        )
                                    }
                                )}
                            </select>

                            {errors.addItem
                                ?.product && (
                                <p className="mt-1 text-xs text-rose-600">
                                    {
                                        errors
                                            .addItem
                                            .product
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="quantity"
                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                                Boxes
                            </label>

                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                value={
                                    addItemQuantity
                                }
                                onChange={(e) =>
                                    setAddItemQuantity(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="rate"
                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                                Rate (₹)
                            </label>

                            <input
                                id="rate"
                                type="number"
                                step="0.01"
                                min="0"
                                value={addItemRate}
                                onChange={(e) =>
                                    setAddItemRate(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={
                                    handleAddItem
                                }
                                className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 lg:w-auto"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* Product Info */}
                    {selectedProductId && (
                        <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50 px-3 py-2.5">
                            {(() => {
                                const product =
                                    products.find(
                                        (p) =>
                                            p.id ===
                                            parseInt(
                                                selectedProductId
                                            )
                                    )

                                if (!product) {
                                    return null
                                }

                                return (
                                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
                                        <span>
                                            <span className="text-slate-500">
                                                Stock:
                                            </span>{' '}
                                            <strong>
                                                {
                                                    product.stock
                                                }{' '}
                                                boxes
                                            </strong>
                                        </span>

                                        <span>
                                            <span className="text-slate-500">
                                                Per box:
                                            </span>{' '}
                                            <strong>
                                                {
                                                    product.quantity_per_box
                                                }
                                            </strong>
                                        </span>

                                        <span>
                                            <span className="text-slate-500">
                                                MRP:
                                            </span>{' '}
                                            <strong>
                                                ₹
                                                {Number(
                                                    product.mrp ||
                                                    0
                                                ).toFixed(
                                                    2
                                                )}
                                            </strong>
                                        </span>
                                    </div>
                                )
                            })()}
                        </div>
                    )}
                </div>

                {/* Items */}
                {items.length > 0 && (
                    <div className="mt-4 space-y-2.5">

                        {items.map((item) => (
                            <div
                                key={
                                    item.product_id
                                }
                                className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4"
                            >
                                <div className="flex items-start justify-between gap-3">

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {
                                                item.product_name
                                            }
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {
                                                item.quantity
                                            }{' '}
                                            boxes ×{' '}
                                            {
                                                item.quantity_per_box
                                            }{' '}
                                            units
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveItem(
                                                item.product_id
                                            )
                                        }
                                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                        title="Remove product"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                                            Quantity
                                        </p>

                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                item.quantity
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                handleUpdateItem(
                                                    item.product_id,
                                                    {
                                                        quantity:
                                                            parseInt(
                                                                e
                                                                    .target
                                                                    .value
                                                            ) ||
                                                            1,
                                                    }
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                                            Units
                                        </p>

                                        <div className="mt-1 rounded-lg bg-slate-50 px-2.5 py-2 text-center text-sm font-medium text-slate-700">
                                            {calculateBottles(
                                                item
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                                            Rate
                                        </p>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={
                                                item.rate
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                handleUpdateItem(
                                                    item.product_id,
                                                    {
                                                        rate:
                                                            parseFloat(
                                                                e
                                                                    .target
                                                                    .value
                                                            ) ||
                                                            0,
                                                    }
                                                )
                                            }
                                            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm outline-none focus:border-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase text-slate-400">
                                            Total
                                        </p>

                                        <div className="mt-1 rounded-lg bg-sky-50 px-2.5 py-2 text-center text-sm font-bold text-sky-700">
                                            ₹
                                            {calculateItemTotal(
                                                item
                                            ).toFixed(
                                                2
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {errors.items && (
                    <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
                        {errors.items}
                    </div>
                )}
            </div>
        </section>

        {/* =========================
            PAYMENT SUMMARY
        ========================== */}
        {items.length > 0 && (
            <section className="rounded-xl border border-slate-200 bg-white">

                <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                                Payment
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Payment status and amount
                            </p>
                        </div>

                        <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPaymentStatusClass(
                                paymentStatus
                            )}`}
                        >
                            {paymentStatus}
                        </span>
                    </div>
                </div>

                <div className="space-y-4 p-4 sm:p-5">

                    <div className="grid gap-3 sm:grid-cols-2">

                        <div>
                            <label
                                htmlFor="paymentStatus"
                                className="mb-1.5 block text-xs font-semibold text-slate-700"
                            >
                                Payment Status
                            </label>

                            <select
                                id="paymentStatus"
                                value={
                                    paymentStatus
                                }
                                onChange={(e) =>
                                    setPaymentStatus(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
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
                                Amount Paid (₹)
                            </label>

                            <input
                                id="amountPaid"
                                type="number"
                                min="0"
                                step="0.01"
                                value={
                                    amountPaid
                                }
                                onChange={(e) =>
                                    setAmountPaid(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
                            />
                        </div>
                    </div>

                    {errors.payment && (
                        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
                            {errors.payment}
                        </p>
                    )}

                    <div className="rounded-xl bg-slate-50 p-3.5">
                        <div className="space-y-2 text-sm">

                            <div className="flex justify-between gap-3 text-slate-600">
                                <span>
                                    Subtotal
                                </span>

                                <span className="font-medium text-slate-900">
                                    ₹
                                    {calculateGrandTotal().toFixed(
                                        2
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between gap-3 text-slate-600">
                                <span>
                                    Amount Paid
                                </span>

                                <span className="font-medium text-slate-900">
                                    ₹
                                    {Number(
                                        amountPaid ||
                                            0
                                    ).toFixed(
                                        2
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between gap-3 text-slate-600">
                                <span>
                                    Balance
                                </span>

                                <span className="font-medium text-amber-700">
                                    ₹
                                    {calculateBalance().toFixed(
                                        2
                                    )}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3">
                                <span className="font-semibold text-slate-900">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-sky-700">
                                    ₹
                                    {calculateGrandTotal().toFixed(
                                        2
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )}

        {/* =========================
            SUBMIT
        ========================== */}
        <button
            type="submit"
            disabled={
                isLoading ||
                items.length === 0
            }
            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
            {isLoading
                ? 'Processing Sale...'
                : `Create Sale${
                      items.length > 0
                          ? ` • ₹${calculateGrandTotal().toFixed(2)}`
                          : ''
                  }`}
        </button>
    </form>
)
})
