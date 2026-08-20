import { useEffect, useMemo, useState } from 'react'
import { ProductForm } from '../components/product/ProductForm'
import { ProductList } from '../components/product/ProductList'
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
    const [showForm, setShowForm] = useState(false)
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

    function handleEditProduct(product) {
        handleEdit(product)
        setShowForm(true)
    }
    function handleAddProduct() {
        resetForm()
        setShowForm(true)
    }
    function handleCancelForm() {
        resetForm()
        setShowForm(false)
    }
    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600"> Products </p>
                    <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl"> Products </h1>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm"> Manage your products and inventory details </p>
                </div>
                <button type="button" onClick={handleAddProduct} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto" >
                    <span className="text-lg leading-none">+</span> Add Product </button>
            </div>
            {/* Product Form */}
            {showForm && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 sm:text-lg"> {isEditing ? 'Edit Product' : 'Add Product'} </h2>
                            <p className="mt-0.5 text-xs text-slate-500"> {isEditing ? 'Update product information' : 'Enter the product details below'} </p>
                        </div>
                        <button type="button" onClick={handleCancelForm} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close form" > ✕ </button>
                    </div>
                    <div className="p-4 sm:p-5">
                        <ProductForm form={form} errors={errors} isEditing={isEditing} onChange={handleChange} onSubmit={handleSubmit} onCancel={handleCancelForm} isSubmitting={submitting} />
                    </div>
                </section>)}
            {/* Product List */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* List Header */}
                <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg"> Product List </h2>
                        <p className="mt-0.5 text-xs text-slate-500"> All products in your catalog </p> </div>
                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {products.length}{' '} {products.length === 1 ? 'product' : 'products'} </span>
                </div>
                {/* List Content */}
                <div className="p-3 sm:p-5">
                    {loading ? (<div className="flex min-h-40 items-center justify-center"> <div className="text-center">
                        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
                        <p className="mt-3 text-sm text-slate-500"> Loading products... </p>
                    </div>
                    </div>) : products.length === 0 ? (<div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm"> 📦 </div>
                        <h3 className="mt-3 text-sm font-semibold text-slate-900"> No products yet </h3>
                                             // eslint-disable-next-line no-undef
                        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 sm:text-sm"> Add your first product to start managing your inventory. </p>
                        <button type="button" onClick={handleAddProduct} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:text-sm" > Add Product </button>
                    </div>) : (<ProductList products={products} onEdit={handleEditProduct} onDelete={handleDelete} deleting={deleting} />)}
                </div>
            </section>
            {/* Toasts */}
            <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:right-6">
                {toasts.map((toast) => (<Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />))}
            </div>
        </div>)
}