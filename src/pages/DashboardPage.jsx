import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productsService'
import { fetchPurchases } from '../services/purchasesService'
import { fetchSalesHistory } from '../services/salesHistoryService'
import { calculateBottles } from '../services/inventoryService'

const currency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
})

function getDateString(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year} -${month} -${day} `
}

function getStartOfWeek(date) {
    const result = new Date(date)
    const day = result.getDay()

    // Monday = start of week
    const diff = day === 0 ? -6 : 1 - day

    result.setDate(result.getDate() + diff)
    result.setHours(0, 0, 0, 0)

    return result
}

function getStartOfMonth(date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
        0,
        0,
        0,
        0
    )
}

function getSaleDate(sale) {
    return new Date(`${sale.date} T00:00:00`)
}

export function DashboardPage() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [inventory, setInventory] = useState([])
    const [sales, setSales] = useState([])
    const [lowStock, setLowStock] = useState([])

    const [summary, setSummary] = useState({
        salesToday: 0,
        profitToday: 0,

        salesWeek: 0,
        profitWeek: 0,

        salesMonth: 0,
        profitMonth: 0,
    })

    useEffect(() => {
        async function loadDashboardData() {
            try {
                setLoading(true)
                setError('')

                const [
                    salesData,
                    purchasesData,
                    productsData,
                ] = await Promise.all([
                    fetchSalesHistory(),
                    fetchPurchases(),
                    fetchProducts(),
                ])

                const now = new Date()

                const todayString = getDateString(now)

                const startOfWeek = getStartOfWeek(now)
                const startOfMonth = getStartOfMonth(now)

                /*
                 * SALES
                 */

                const salesTodayData = salesData.filter(
                    (sale) => sale.date === todayString
                )

                const salesWeekData = salesData.filter((sale) => {
                    const saleDate = getSaleDate(sale)

                    return (
                        saleDate >= startOfWeek &&
                        saleDate <= now
                    )
                })

                const salesMonthData = salesData.filter((sale) => {
                    const saleDate = getSaleDate(sale)

                    return (
                        saleDate >= startOfMonth &&
                        saleDate <= now
                    )
                })

                const salesToday = salesTodayData.reduce(
                    (sum, sale) =>
                        sum + Number(sale.total_amount || 0),
                    0
                )

                const salesWeek = salesWeekData.reduce(
                    (sum, sale) =>
                        sum + Number(sale.total_amount || 0),
                    0
                )

                const salesMonth = salesMonthData.reduce(
                    (sum, sale) =>
                        sum + Number(sale.total_amount || 0),
                    0
                )

                /*
                 * OUTSTANDING
                 */

                const outstanding = salesData
                    .filter(
                        (sale) =>
                            sale.payment_status !== 'Paid'
                    )
                    .reduce(
                        (sum, sale) =>
                            sum +
                            Number(
                                sale.balance_amount || 0
                            ),
                        0
                    )

                /*
                 * PROFIT
                 *
                 * Expected sale item:
                 *
                 * {
                 *     quantity,
                 *     rate,
                 *     cost_rate
                 * }
                 *
                 * Profit:
                 *
                 * (selling rate - cost rate) × quantity
                 */

                const calculateProfit = (saleList) => {
                    return saleList.reduce(
                        (totalProfit, sale) => {
                            if (!Array.isArray(sale.items)) {
                                return totalProfit
                            }

                            const saleProfit =
                                sale.items.reduce(
                                    (profit, item) => {
                                        const quantity =
                                            Number(
                                                item.quantity || 0
                                            )

                                        const sellingRate =
                                            Number(
                                                item.rate || 0
                                            )

                                        const costRate =
                                            Number(
                                                item.cost_rate ??
                                                item.purchase_rate ??
                                                0
                                            )

                                        return (
                                            profit +
                                            (
                                                sellingRate -
                                                costRate
                                            ) *
                                            quantity
                                        )
                                    },
                                    0
                                )

                            return (
                                totalProfit +
                                saleProfit
                            )
                        },
                        0
                    )
                }

                const profitToday =
                    calculateProfit(salesTodayData)

                const profitWeek =
                    calculateProfit(salesWeekData)

                const profitMonth =
                    calculateProfit(salesMonthData)

                /*
                 * INVENTORY
                 */

                const normalizedInventory = productsData
                    .map((product) => ({
                        ...product,

                        stockBoxes: Number(
                            product.stock || 0
                        ),

                        stockBottles: calculateBottles(
                            Number(product.stock || 0),
                            Number(
                                product.quantity_per_box || 0
                            )
                        ),
                    }))
                    .sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )

                const lowStockItems =
                    normalizedInventory.filter(
                        (product) =>
                            product.stockBoxes <= 5
                    )

                /*
                 * UPDATE STATE
                 */

                setInventory(normalizedInventory)

                setLowStock(lowStockItems)

                setSales(
                    [...salesData]
                        .sort(
                            (a, b) =>
                                new Date(b.date) -
                                new Date(a.date)
                        )
                        .slice(0, 5)
                )

                setSummary({
                    salesToday,
                    profitToday,

                    salesWeek,
                    profitWeek,

                    salesMonth,
                    profitMonth,

                    outstanding,
                })
            } catch (err) {
                console.error(
                    'Failed to load dashboard data:',
                    err
                )

                setError(
                    'Failed to load dashboard data.'
                )
            } finally {
                setLoading(false)
            }
        }

        loadDashboardData()
    }, [])
    return (
        <div className="space-y-4 sm:space-y-6">

            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                    Dashboard Overview
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Sales, profit and inventory summary
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 sm:rounded-2xl sm:p-4">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">

                {/* Today's Sales */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-slate-500">
                        Today's Sales
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                        {loading
                            ? '...'
                            : currency.format(summary.salesToday)}
                    </p>
                </div>

                {/* Today's Profit */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="text-xs font-medium text-emerald-700">
                        Today's Profit
                    </p>

                    <p className="mt-2 text-lg font-bold text-emerald-700 sm:text-xl">
                        {loading
                            ? '...'
                            : currency.format(summary.profitToday)}
                    </p>
                </div>

                {/* This Week's Sales */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-slate-500">
                        This Week's Sales
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                        {loading
                            ? '...'
                            : currency.format(summary.salesWeek)}
                    </p>
                </div>

                {/* This Week's Profit */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="text-xs font-medium text-emerald-700">
                        This Week's Profit
                    </p>

                    <p className="mt-2 text-lg font-bold text-emerald-700 sm:text-xl">
                        {loading
                            ? '...'
                            : currency.format(summary.profitWeek)}
                    </p>
                </div>

                {/* This Month's Sales */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-medium text-slate-500">
                        This Month's Sales
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-900 sm:text-xl">
                        {loading
                            ? '...'
                            : currency.format(summary.salesMonth)}
                    </p>
                </div>

                {/* This Month's Profit */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="text-xs font-medium text-emerald-700">
                        This Month's Profit
                    </p>

                    <p className="mt-2 text-lg font-bold text-emerald-700 sm:text-xl">
                        {loading
                            ? '...'
                            : currency.format(summary.profitMonth)}
                    </p>
                </div>

            </section>
            {/* Inventory + Low Stock */}
            <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:gap-6">

                {/* Inventory */}
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                            Inventory
                        </h2>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:text-xs">
                            {inventory.length} items
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-8 text-center text-sm text-slate-500">
                            Loading inventory...
                        </div>
                    ) : inventory.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                            No inventory items available.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {inventory.map((product) => (
                                <div
                                    key={product.id}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">
                                                {product.name}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {product.quantity_per_box}{' '}
                                                units / box
                                            </p>
                                        </div>

                                        <span
                                            className={`shrink - 0 rounded - full px - 2 py - 1 text - [10px] font - semibold sm: text - [11px] ${product.stockBoxes <= 5
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                                } `}
                                        >
                                            {product.stockBoxes <= 5
                                                ? 'Low stock'
                                                : 'Healthy'}
                                        </span>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                Boxes
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-900">
                                                {product.stockBoxes}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                Bottles
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-900">
                                                {product.stockBottles}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                Rate
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-900">
                                                {currency.format(
                                                    Number(
                                                        product.rate || 0
                                                    )
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                MRP
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-900">
                                                {currency.format(
                                                    Number(
                                                        product.mrp || 0
                                                    )
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Low Stock */}
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                            Low Stock
                        </h2>

                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700 sm:text-xs">
                            {lowStock.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-8 text-center text-sm text-slate-500">
                            Loading low-stock items...
                        </div>
                    ) : lowStock.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                            No low-stock products.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {lowStock.map((product) => (
                                <div
                                    key={product.id}
                                    className="rounded-xl border border-amber-200 bg-amber-50 p-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="min-w-0 truncate font-semibold text-slate-900">
                                            {product.name}
                                        </p>

                                        <span className="shrink-0 text-xs font-semibold text-amber-700">
                                            {product.stockBoxes} boxes
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Recent Sales */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                        Recent Sales
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 sm:text-xs">
                        Latest 5
                    </span>
                </div>

                {loading ? (
                    <div className="py-8 text-center text-sm text-slate-500">
                        Loading recent sales...
                    </div>
                ) : sales.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
                        No sales recorded yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sales.map((sale) => (
                            <div
                                key={sale.id}
                                className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-slate-900">
                                        {sale.customer_name ||
                                            'One-time customer'}
                                    </p>

                                    <p className="text-xs text-slate-500 sm:text-sm">
                                        {sale.date}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    <span className="text-sm font-medium text-slate-700">
                                        {currency.format(
                                            Number(
                                                sale.total_amount || 0
                                            )
                                        )}
                                    </span>

                                    <span
                                        className={`rounded - full px - 2 py - 1 text - [10px] font - semibold sm: text - [11px] ${sale.payment_status ===
                                            'Paid'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : sale.payment_status ===
                                                'Partial'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-slate-100 text-slate-700'
                                            } `}
                                    >
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