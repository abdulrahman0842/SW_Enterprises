import { useEffect, useState } from 'react'
import { PurchaseForm } from '../components/PurchaseForm'
import { PurchaseList } from '../components/PurchaseList'
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

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Purchases Module
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Record purchases
                </h1>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
                <PurchaseForm
                    form={form}
                    errors={errors}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    isSubmitting={submitting}
                    products={products}
                    productsLoading={productsLoading}
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">Purchase history</h2>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {purchases.length} items
                        </span>
                    </div>

                    <PurchaseList purchases={purchases} loading={purchasesLoading} />
                </div>
            </div>

            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    )
}
