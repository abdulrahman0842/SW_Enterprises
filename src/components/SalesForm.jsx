import { useEffect, useState } from 'react'
import { fetchCustomers } from '../services/customersService'
import { fetchProducts } from '../services/productsService'

export function SalesForm({ onSubmit, isLoading = false }) {
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
    const [errors, setErrors] = useState({})

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

        return newErrors
    }

    function handleSubmit(e) {
        e.preventDefault()

        const newErrors = validateForm()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        const saleData = {
            customer_id: customerType === 'existing' ? selectedCustomerId : null,
            customer_name:
                customerType === 'existing' ? selectedCustomer.name : selectedCustomer?.name || '',
            customer_contact: customerContact,
            items: items,
            total_amount: calculateGrandTotal(),
        }

        onSubmit(saleData)
    }

    if (loadingData) {
        return <div className="py-8 text-center text-slate-500">Loading form data...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Section */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900">Customer Details</h2>

                {/* Customer Type Selection */}
                <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="customerType"
                            value="existing"
                            checked={customerType === 'existing'}
                            onChange={() => handleCustomerTypeChange('existing')}
                            className="h-4 w-4"
                        />
                        <span className="text-sm font-medium text-slate-700">
                            Select existing customer
                        </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="radio"
                            name="customerType"
                            value="new"
                            checked={customerType === 'new'}
                            onChange={() => handleCustomerTypeChange('new')}
                            className="h-4 w-4"
                        />
                        <span className="text-sm font-medium text-slate-700">
                            One-time customer
                        </span>
                    </label>
                </div>

                {/* Existing Customer Selection */}
                {customerType === 'existing' && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="customer" className="block text-sm font-medium text-slate-700">
                                Select Customer <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="customer"
                                value={selectedCustomerId || ''}
                                onChange={(e) => handleSelectCustomer(parseInt(e.target.value))}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                            >
                                <option value="">Choose a customer...</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name} ({customer.contact})
                                    </option>
                                ))}
                            </select>
                            {errors.customer && (
                                <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
                            )}
                        </div>

                        {selectedCustomer && (
                            <div className="space-y-3 rounded-lg bg-white p-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Name
                                    </p>
                                    <p className="mt-1 font-medium text-slate-900">
                                        {selectedCustomer.name}
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="contactEdit" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Contact
                                    </label>
                                    <input
                                        id="contactEdit"
                                        type="text"
                                        value={customerContact}
                                        onChange={(e) => setCustomerContact(e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                    />
                                </div>

                                {selectedCustomer.address && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Address
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {selectedCustomer.address}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* One-time Customer Input */}
                {customerType === 'new' && (
                    <div className="mt-4 space-y-3">
                        <div>
                            <label htmlFor="newCustomerName" className="block text-sm font-medium text-slate-700">
                                Customer Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="newCustomerName"
                                type="text"
                                value={selectedCustomer?.name || ''}
                                onChange={(e) =>
                                    setSelectedCustomer((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                placeholder="Customer name"
                            />
                            {errors.customerName && (
                                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="newCustomerContact" className="block text-sm font-medium text-slate-700">
                                Customer Contact <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="newCustomerContact"
                                type="text"
                                value={customerContact}
                                onChange={(e) => setCustomerContact(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                placeholder="Phone, email, or other contact"
                            />
                            {errors.customerContact && (
                                <p className="mt-1 text-sm text-red-600">{errors.customerContact}</p>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Products Items Section */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900">Add Products</h2>

                {/* Add Item Form */}
                <div className="mt-4 space-y-3 rounded-lg bg-white p-4">
                    <div>
                        <label htmlFor="product" className="block text-sm font-medium text-slate-700">
                            Product <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="product"
                            value={selectedProductId}
                            onChange={(e) => {
                                setSelectedProductId(e.target.value)
                                if (e.target.value) {
                                    const product = products.find(
                                        (p) => p.id === parseInt(e.target.value)
                                    )
                                    if (product) {
                                        setAddItemRate(product.rate.toString())
                                    }
                                }
                                setErrors((prev) => {
                                    const { addItem: _, ...rest } = prev
                                    return rest
                                })
                            }}
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                            <option value="">Choose a product...</option>
                            {products.map((product) => {
                                const isAdded = items.some((item) => item.product_id === product.id)
                                return (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                        {isAdded ? ' (already added)' : ''}
                                    </option>
                                )
                            })}
                        </select>
                        {errors.addItem?.product && (
                            <p className="mt-1 text-sm text-red-600">{errors.addItem.product}</p>
                        )}
                    </div>

                    {selectedProductId && (
                        <div className="rounded-lg bg-sky-50 p-3">
                            {(() => {
                                const product = products.find(
                                    (p) => p.id === parseInt(selectedProductId)
                                )
                                return (
                                    <>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            Product Info
                                        </p>
                                        <div className="mt-2 grid gap-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Qty/Box:</span>
                                                <span className="font-medium text-slate-900">
                                                    {product.quantity_per_box}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">Stock:</span>
                                                <span className="font-medium text-slate-900">
                                                    {product.stock} boxes / {product.stock * product.quantity_per_box} units
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-600">MRP:</span>
                                                <span className="font-medium text-slate-900">
                                                    ₹{product.mrp.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">
                                Quantity (boxes) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                value={addItemQuantity}
                                onChange={(e) => {
                                    setAddItemQuantity(e.target.value)
                                    setErrors((prev) => {
                                        const { addItem: _, ...rest } = prev
                                        return rest
                                    })
                                }}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                placeholder="1"
                            />
                            {errors.addItem?.quantity && (
                                <p className="mt-1 text-sm text-red-600">{errors.addItem.quantity}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="rate" className="block text-sm font-medium text-slate-700">
                                Selling Rate (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="rate"
                                type="number"
                                step="0.01"
                                min="0"
                                value={addItemRate}
                                onChange={(e) => {
                                    setAddItemRate(e.target.value)
                                    setErrors((prev) => {
                                        const { addItem: _, ...rest } = prev
                                        return rest
                                    })
                                }}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                placeholder="0.00"
                            />
                            {errors.addItem?.rate && (
                                <p className="mt-1 text-sm text-red-600">{errors.addItem.rate}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                    >
                        + Add Product
                    </button>
                </div>

                {/* Items List */}
                {items.length > 0 && (
                    <div className="mt-4 space-y-3">
                        <p className="text-sm font-semibold text-slate-700">
                            {items.length} product{items.length !== 1 ? 's' : ''} added
                        </p>
                        {items.map((item) => (
                            <div key={item.product_id} className="rounded-lg border border-slate-300 bg-white p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-900">{item.product_name}</h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {item.quantity} boxes × {item.quantity_per_box} units/box ={' '}
                                            {calculateBottles(item)} units
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.product_id)}
                                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                        title="Remove"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-200 pt-3 sm:grid-cols-5">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Qty
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleUpdateItem(item.product_id, {
                                                    quantity: parseInt(e.target.value) || 1,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Bottles
                                        </label>
                                        <div className="mt-1.5 rounded-lg bg-slate-100 px-2 py-1.5 text-center text-sm font-medium text-slate-900">
                                            {calculateBottles(item)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Rate (₹)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={item.rate}
                                            onChange={(e) =>
                                                handleUpdateItem(item.product_id, {
                                                    rate: parseFloat(e.target.value) || 0,
                                                })
                                            }
                                            className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            MRP (₹)
                                        </label>
                                        <div className="mt-1.5 rounded-lg bg-slate-100 px-2 py-1.5 text-center text-xs font-medium text-slate-900">
                                            {item.mrp.toFixed(2)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Total (₹)
                                        </label>
                                        <div className="mt-1.5 rounded-lg bg-sky-100 px-2 py-1.5 text-center text-sm font-bold text-sky-900">
                                            {calculateItemTotal(item).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {errors.items && (
                    <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {errors.items}
                    </div>
                )}
            </section>

            {/* Order Summary */}
            {items.length > 0 && (
                <section className="rounded-2xl border-2 border-sky-300 bg-sky-50 p-4 sm:p-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-slate-700">
                            <span>Subtotal:</span>
                            <span className="font-medium">₹{calculateGrandTotal().toFixed(2)}</span>
                        </div>
                        <div className="border-t border-sky-200 pt-3">
                            <div className="flex justify-between">
                                <span className="text-lg font-bold text-slate-900">Total Amount:</span>
                                <span className="text-2xl font-bold text-sky-600">
                                    ₹{calculateGrandTotal().toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-sky-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:text-slate-500"
            >
                {isLoading ? 'Processing...' : 'Create Sale'}
            </button>
        </form>
    )
}
