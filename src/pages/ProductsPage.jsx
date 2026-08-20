import { useEffect, useMemo, useState } from 'react'
import { ProductForm } from '../components/ProductForm'
import { ProductList } from '../components/ProductList'
import { Toast, useToast } from '../components/Toast'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../services/productsService'

const createEmptyForm = () => ({
    name: '',
    description: '',
    quantity_per_box: '',
})

function validateProduct(form, products, editingId) {
    const errors = {}
    const trimmedName = form.name.trim()
    const quantityPerBox = Number(form.quantity_per_box)

    if (!trimmedName) {
        errors.name = 'Product name is required.'
    } else {
        const isDuplicate = products.some(
            (product) =>
                product.id !== editingId &&
                product.name.trim().toLowerCase() === trimmedName.toLowerCase(),
        )
        if (isDuplicate) {
            errors.name = 'Product name must be unique.'
        }
    }

    if (form.quantity_per_box === '' || !Number.isInteger(quantityPerBox) || quantityPerBox <= 0) {
        errors.quantity_per_box = 'Quantity per box must be a positive integer.'
    }

    return errors
}

export function ProductsPage() {
    const [products, setProducts] = useState([])
    const [form, setForm] = useState(createEmptyForm())
    const [errors, setErrors] = useState({})
    const [editingId, setEditingId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const { toasts, showToast, removeToast } = useToast()

    const isEditing = useMemo(() => editingId !== null, [editingId])

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoading(true)
                const data = await fetchProducts()
                setProducts(data)
            } catch (error) {
                console.error('Failed to load products:', error)
                showToast('Failed to load products', 'error')
            } finally {
                setLoading(false)
            }
        }
        loadProducts()
    }, [])



    function resetForm() {
        setForm(createEmptyForm())
        setErrors({})
        setEditingId(null)
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

        const validationErrors = validateProduct(form, products, editingId)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setSubmitting(true)

        try {
            if (isEditing) {
                const updated = await updateProduct(
                    editingId,
                    form.name,
                    form.description,
                    form.quantity_per_box,
                )
                setProducts((currentProducts) =>
                    currentProducts.map((product) =>
                        product.id === editingId ? updated : product,
                    ),
                )
                showToast('Product updated successfully', 'success')
            } else {
                const created = await createProduct(
                    form.name,
                    form.description,
                    form.quantity_per_box,
                )
                setProducts((currentProducts) => [created, ...currentProducts])
                showToast('Product created successfully', 'success')
            }

            resetForm()
        } catch (error) {
            console.error('Failed to save product:', error)
            showToast(error?.message || 'Failed to save product', 'error')
        } finally {
            setSubmitting(false)
        }
    }

    function handleEdit(product) {
        setEditingId(product.id)
        setForm({
            name: product.name,
            description: product.description || '',
            quantity_per_box: String(product.quantity_per_box),
        })
        setErrors({})
    }

    async function handleDelete(productId) {
        setDeleting(productId)

        try {
            await deleteProduct(productId)
            setProducts((currentProducts) =>
                currentProducts.filter((product) => product.id !== productId),
            )
            showToast('Product deleted successfully', 'success')

            if (editingId === productId) {
                resetForm()
            }
        } catch (error) {
            console.error('Failed to delete product:', error)
            showToast(error?.message || 'Failed to delete product', 'error')
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Product Module
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Manage products
                </h1>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
                <ProductForm
                    form={form}
                    errors={errors}
                    isEditing={isEditing}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    isSubmitting={submitting}
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">Product list</h2>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {products.length} items
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-8 text-center text-slate-500">Loading products...</div>
                    ) : (
                        <ProductList
                            products={products}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            deleting={deleting}
                        />
                    )}
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
