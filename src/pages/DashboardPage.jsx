import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { fetchProducts } from '../services/productsService'
import { fetchPurchases } from '../services/purchasesService'
import { fetchSalesHistory } from '../services/salesHistoryService'
import { calculateBottles } from '../services/inventoryService'

const currency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
})

export function DashboardPage() {
    const { user, signOut } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [inventory, setInventory] = useState([])
    const [sales, setSales] = useState([])
    const [purchases, setPurchases] = useState([])
    const [lowStock, setLowStock] = useState([])
    const [summary, setSummary] = useState({
        salesToday: 0,
        purchasesToday: 0,
        outstanding: 0,
    })

    async function handleLogout() {
        await signOut()
    }

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true)
                setError('')

                const [salesData, purchasesData, productsData] = await Promise.all([
                    fetchSalesHistory(),
                    fetchPurchases(),
                    fetchProducts(),
                ])

                const today = new Date().toISOString().slice(0, 10)

                const salesToday = salesData
                    .filter((sale) => sale.date === today)
                    .reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0)

                const purchasesToday = purchasesData
                    .filter((purchase) => purchase.date === today)
                    .reduce((sum, purchase) => sum + Number(purchase.quantity || 0) * Number(purchase.rate || 0), 0)

                const outstanding = salesData
                    .filter((sale) => sale.payment_status !== 'Paid')
                    .reduce((sum, sale) => sum + Number(sale.balance_amount || 0), 0)

                const normalizedInventory = productsData
                    .map((product) => ({
                        ...product,
                        stockBoxes: Number(product.stock || 0),
                        stockBottles: calculateBottles(Number(product.stock || 0), Number(product.quantity_per_box || 0)),
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name))

                const lowStockItems = normalizedInventory.filter((product) => product.stockBoxes <= 5)

                setInventory(normalizedInventory)
                setLowStock(lowStockItems)
                setSales(salesData.slice(0, 5))
                setPurchases(purchasesData)
                setSummary({
                    salesToday,
                    purchasesToday,
                    outstanding,
                })
            } catch (err) {
                console.error('Failed to load dashboard data:', err)
                setError('Failed to load dashboard data.')
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [])

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                            Dashboard
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-slate-900">Overview</h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Logout
                    </button>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Today's Sales</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                        {loading ? '...' : currency.format(summary.salesToday)}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Today's Purchases</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                        {loading ? '...' : currency.format(summary.purchasesToday)}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Outstanding Payments</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                        {loading ? '...' : currency.format(summary.outstanding)}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Products</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">
                        {loading ? '...' : inventory.length}
                    </p>
                </div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">Inventory</h2>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {inventory.length} items
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-8 text-center text-slate-500">Loading inventory...</div>
                    ) : inventory.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                            No inventory items available.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {inventory.map((product) => (
                                <div key={product.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-slate-900">{product.name}</p>
                                            <p className="text-xs text-slate-500">{product.quantity_per_box} units / box</p>
                                        </div>
                                        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${product.stockBoxes <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {product.stockBoxes <= 5 ? 'Low stock' : 'Healthy'}
                                        </span>
                                    </div>

                                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Boxes</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{product.stockBoxes}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bottles</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{product.stockBottles}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Rate</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{currency.format(Number(product.rate || 0))}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">MRP</p>
                                            <p className="mt-1 text-sm font-medium text-slate-900">{currency.format(Number(product.mrp || 0))}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-xl font-semibold text-slate-900">Low Stock</h2>
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {lowStock.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-8 text-center text-slate-500">Loading low-stock items...</div>
                    ) : lowStock.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                            No low-stock products.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {lowStock.map((product) => (
                                <div key={product.id} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-semibold text-slate-900">{product.name}</p>
                                        <span className="text-xs font-semibold text-amber-700">{product.stockBoxes} boxes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">Recent Sales</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        Latest 5
                    </span>
                </div>

                {loading ? (
                    <div className="py-8 text-center text-slate-500">Loading recent sales...</div>
                ) : sales.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                        No sales recorded yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sales.map((sale) => (
                            <div key={sale.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900">{sale.customer_name || 'One-time customer'}</p>
                                    <p className="text-sm text-slate-500">{sale.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-700">{currency.format(Number(sale.total_amount || 0))}</span>
                                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${sale.payment_status === 'Paid'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : sale.payment_status === 'Partial'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        {sale.payment_status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
