import { useEffect, useState } from 'react'
import { InventoryList } from '../components/InventoryList'
import { Toast, useToast } from '../components/Toast'
import { fetchInventory } from '../services/inventoryService'

export function InventoryPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const { toasts, showToast, removeToast } = useToast()

    useEffect(() => {
        loadInventory()
    }, [])

    async function loadInventory() {
        try {
            setLoading(true)
            const data = await fetchInventory()
            setProducts(data)
        } catch (error) {
            console.error('Failed to load inventory:', error)
            showToast('Failed to load inventory', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Inventory Module
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Current inventory
                </h1>
            </section>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">Stock levels</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {products.length} products
                    </span>
                </div>

                <InventoryList products={products} loading={loading} />
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
