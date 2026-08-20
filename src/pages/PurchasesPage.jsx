import { useEffect, useState } from 'react'
import { PurchaseForm } from '../components/purchase/PurchaseForm'
import { PurchaseList } from '../components/purchase/PurchaseList'
import { Toast, useToast } from '../components/Toast'
import { fetchProducts, fetchPurchases, createPurchase } from '../services/purchasesService'

const createEmptyForm = () => ({
    date: new Date().toISOString().split('T')[0],
    product_id: '',
    quantity: '',
    rate: '',
    mrp: '',
})

function validatePurchase(form) {
    const errors = {}

    if (!form.date) {
        errors.date = 'Date is required.'
    }

    if (!form.product_id) {
        errors.product_id = 'Product is required.'
    }

    const quantity = Number(form.quantity)
    if (!form.quantity || !Number.isInteger(quantity) || quantity <= 0) {
        errors.quantity = 'Quantity must be a positive integer.'
    }

    const rate = Number(form.rate)
    if (form.rate === '' || rate < 0 || isNaN(rate)) {
        errors.rate = 'Rate must be >= 0.'
    }

    const mrp = Number(form.mrp)
    if (form.mrp === '' || mrp < 0 || isNaN(mrp)) {
        errors.mrp = 'MRP must be >= 0.'
    }

    return errors
}

export function PurchasesPage() {
    const [products, setProducts] = useState([])
    const [purchases, setPurchases] = useState([])
    const [selectedPurchaseId, setSelectedPurchaseId] = useState(null)
    const [form, setForm] = useState(createEmptyForm())
    const [errors, setErrors] = useState({})
    const [productsLoading, setProductsLoading] = useState(true)
    const [purchasesLoading, setPurchasesLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const { toasts, showToast, removeToast } = useToast()

    useEffect(() => {
        loadProducts()
        loadPurchases()
    }, [])

    async function loadProducts() {
        try {
            setProductsLoading(true)
            const data = await fetchProducts()
            setProducts(data)
        } catch (error) {
            console.error('Failed to load products:', error)
            showToast('Failed to load products', 'error')
        } finally {
            setProductsLoading(false)
        }
    }

    async function loadPurchases() {
        try {
            setPurchasesLoading(true)
            const data = await fetchPurchases()
            setPurchases(data)

            if (data.length > 0 && !selectedPurchaseId) {
                setSelectedPurchaseId(data[0].id)
            }
        } catch (error) {
            console.error('Failed to load purchases:', error)
            showToast('Failed to load purchases', 'error')
        } finally {
            setPurchasesLoading(false)
        }
    }

    function handleChange(event) {
        const { name, value } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }))

        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: '',
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const validationErrors = validatePurchase(form)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setSubmitting(true)

        try {
            await createPurchase(
                form.date,
                form.product_id,
                form.quantity,
                form.rate,
                form.mrp,
            )

            showToast('Purchase recorded successfully', 'success')
            setForm(createEmptyForm())
            setErrors({})
            await loadPurchases()
            await loadProducts()
        } catch (error) {
            console.error('Failed to record purchase:', error)
            showToast(error?.message || 'Failed to record purchase', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    const selectedPurchase = purchases.find((purchase) => purchase.id === selectedPurchaseId) || null
const [showForm, setShowForm] = useState(false)
    return (
        <div className="space-y-4 sm:space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                        Purchases
                    </p>

                    <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                        Purchase History
                    </h1>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Record purchases and track your purchase history
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setShowForm((prev) => !prev)
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto"
                >
                    <span className="text-lg leading-none">
                        {showForm ? '×' : '+'}
                    </span>

                    {showForm ? 'Close Form' : 'Record Purchase'}
                </button>
            </div>

            {/* Purchase Form */}
            {showForm && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Record Purchase
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Add a new purchase to your inventory
                        </p>
                    </div>

                    <div className="p-4 sm:p-5">
                        <PurchaseForm
                            form={form}
                            errors={errors}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            isSubmitting={submitting}
                            products={products}
                            productsLoading={productsLoading}
                        />
                    </div>
                </section>
            )}

            {/* Purchase History */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Section Header */}
                <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Purchase History
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            View and inspect previous purchases
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {purchases.length}{' '}
                        {purchases.length === 1
                            ? 'purchase'
                            : 'purchases'}
                    </span>
                </div>

                {/* Purchase List */}
                <div className="p-3 sm:p-5">
                    <PurchaseList
                        purchases={purchases}
                        loading={purchasesLoading}
                        selectedPurchaseId={selectedPurchaseId}
                        onSelectPurchase={setSelectedPurchaseId}
                    />
                </div>

                {/* Selected Purchase */}
                {selectedPurchase && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-5">

                        {/* Details Header */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-600 sm:text-xs">
                                    Purchase #{selectedPurchase.id}
                                </p>

                                <h3 className="mt-1 truncate text-base font-semibold text-slate-900 sm:text-lg">
                                    {selectedPurchase.products?.name ||
                                        'Unknown Product'}
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedPurchaseId(null)
                                }
                                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700"
                                aria-label="Close purchase details"
                            >
                                ×
                            </button>
                        </div>

                        {/* Details Grid */}
                        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">

                            {/* Date */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    Date
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {new Date(
                                        selectedPurchase.date
                                    ).toLocaleDateString('en-IN')}
                                </p>
                            </div>

                            {/* Quantity */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    Quantity
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {Number(
                                        selectedPurchase.quantity || 0
                                    )}{' '}
                                    boxes
                                </p>
                            </div>

                            {/* Purchase Rate */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    Purchase Rate
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    ₹
                                    {Number(
                                        selectedPurchase.rate || 0
                                    ).toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>

                            {/* MRP */}
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                    MRP
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    ₹
                                    {Number(
                                        selectedPurchase.mrp || 0
                                    ).toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="mt-3 flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
                            <div>
                                <p className="text-xs font-medium text-sky-700">
                                    Total Purchase Amount
                                </p>

                                <p className="mt-0.5 text-[11px] text-sky-600">
                                    Quantity × Purchase Rate
                                </p>
                            </div>

                            <p className="text-lg font-bold text-sky-700">
                                ₹
                                {(
                                    Number(
                                        selectedPurchase.quantity || 0
                                    ) *
                                    Number(
                                        selectedPurchase.rate || 0
                                    )
                                ).toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Toasts */}
            <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:right-6">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    )
}
