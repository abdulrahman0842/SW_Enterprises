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

            showToast(
                'Failed to load inventory',
                'error'
            )
        } finally {
            setLoading(false)
        }
    }

    const lowStockCount = products.filter(
        (product) => Number(product.stock || 0) <= 5
    ).length

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* Page Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                        Inventory
                    </p>

                    <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                        Stock Levels
                    </h1>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Monitor current product stock
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadInventory}
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                    <svg
                        className={`h-4 w-4 ${
                            loading ? 'animate-spin' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 4v5h5M20 20v-5h-5M5.5 9A7 7 0 0118 6.5L20 9M18.5 15A7 7 0 016 17.5L4 15"
                        />
                    </svg>

                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                {/* Products */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-slate-500">
                        Products
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                        {loading ? '...' : products.length}
                    </p>
                </div>

                {/* Low Stock */}
                <div
                    className={`rounded-xl border p-4 shadow-sm ${
                        lowStockCount > 0
                            ? 'border-amber-200 bg-amber-50'
                            : 'border-slate-200 bg-white'
                    }`}
                >
                    <p
                        className={`text-xs font-medium ${
                            lowStockCount > 0
                                ? 'text-amber-700'
                                : 'text-slate-500'
                        }`}
                    >
                        Low Stock
                    </p>

                    <p
                        className={`mt-1 text-xl font-bold sm:text-2xl ${
                            lowStockCount > 0
                                ? 'text-amber-700'
                                : 'text-slate-900'
                        }`}
                    >
                        {loading ? '...' : lowStockCount}
                    </p>
                </div>

                {/* Status */}
                <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-1">
                    <p className="text-xs font-medium text-slate-500">
                        Inventory Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                        {loading
                            ? 'Checking...'
                            : lowStockCount > 0
                                ? 'Attention required'
                                : 'Stock is healthy'}
                    </p>
                </div>
            </div>

            {/* Inventory List */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Section Header */}
                <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Current Inventory
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Current stock available for each product
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {products.length}{' '}
                        {products.length === 1
                            ? 'product'
                            : 'products'}
                    </span>
                </div>

                <div className="p-3 sm:p-5">
                    <InventoryList
                        products={products}
                        loading={loading}
                    />
                </div>
            </section>

            {/* Toasts */}
            <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col gap-2 sm:right-6">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() =>
                            removeToast(toast.id)
                        }
                    />
                ))}
            </div>
        </div>
    )
}