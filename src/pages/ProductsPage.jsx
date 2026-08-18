import { useMemo, useState } from 'react'
import { ProductForm } from '../components/ProductForm'
import { ProductList } from '../components/ProductList'

const initialProducts = [
    { id: 1, name: '250ml Water Bottle', description: 'Compact bottled water for retail and distribution.', bottlesPerBox: 30 },
    { id: 2, name: '500ml Water Bottle', description: 'Standard household water bottle pack.', bottlesPerBox: 24 },
    { id: 3, name: '1000ml Water Bottle', description: 'Large format water bottle for bulk usage.', bottlesPerBox: 12 },
]

const createEmptyForm = () => ({
    name: '',
    description: '',
    bottlesPerBox: '',
})

function validateProduct(form, products, editingId) {
    const errors = {}
    const trimmedName = form.name.trim()
    const bottlesPerBox = Number(form.bottlesPerBox)

    if (!trimmedName) {
        errors.name = 'Product name is required.'
    } else if (
        products.some(
            (product) =>
                product.id !== editingId &&
                product.name.trim().toLowerCase() === trimmedName.toLowerCase(),
        )
    ) {
        errors.name = 'Product name must be unique.'
    }

    if (form.bottlesPerBox === '' || !Number.isInteger(bottlesPerBox) || bottlesPerBox <= 0) {
        errors.bottlesPerBox = 'Bottles per box must be a positive integer.'
    }

    return errors
}

export function ProductsPage() {
    const [products, setProducts] = useState(initialProducts)
    const [form, setForm] = useState(createEmptyForm())
    const [errors, setErrors] = useState({})
    const [editingId, setEditingId] = useState(null)

    const isEditing = useMemo(() => editingId !== null, [editingId])

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

    function handleSubmit(event) {
        event.preventDefault()

        const validationErrors = validateProduct(form, products, editingId)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const productData = {
            id: editingId ?? Date.now(),
            name: form.name.trim(),
            description: form.description.trim(),
            bottlesPerBox: Number(form.bottlesPerBox),
        }

        if (editingId) {
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.id === editingId ? productData : product,
                ),
            )
        } else {
            setProducts((currentProducts) => [productData, ...currentProducts])
        }

        resetForm()
    }

    function handleEdit(product) {
        setEditingId(product.id)
        setForm({
            name: product.name,
            description: product.description || '',
            bottlesPerBox: String(product.bottlesPerBox),
        })
        setErrors({})
    }

    function handleDelete(productId) {
        setProducts((currentProducts) =>
            currentProducts.filter((product) => product.id !== productId),
        )

        if (editingId === productId) {
            resetForm()
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
                />

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">Product list</h2>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {products.length} items
                        </span>
                    </div>

                    <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    )
}
