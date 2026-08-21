import { useEffect, useState } from 'react'
import { fetchProducts } from '../services/productsService'
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

    return `${year}-${month}-${day}`
}

function getStartOfWeek(date) {
    const result = new Date(date)
    const day = result.getDay()

    const diff = day === 0 ? -6 : 1 - day

    result.setDate(result.getDate() + diff)
    result.setHours(0, 0, 0, 0)

    return result
}

function getStartOfMonth(date) {
    const result = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    )

    result.setHours(0, 0, 0, 0)

    return result
}

function getSaleDate(sale) {
    return new Date(`${sale.date}T00:00:00`)
}

function calculateProfit(sales) {
    return sales.reduce((totalProfit, sale) => {
        if (!Array.isArray(sale.items)) {
            return totalProfit
        }

        return (
            totalProfit +
            sale.items.reduce((profit, item) => {
                const quantity =
                    Number(item.quantity || 0)

                const sellingRate =
                    Number(item.rate || 0)

                const costRate =
                    Number(
                        item.cost_rate ??
                        item.purchase_rate ??
                        0
                    )

                return (
                    profit +
                    (sellingRate - costRate) *
                    quantity
                )
            }, 0)
        )
    }, 0)
}

function getSalesTotal(sales) {
    return sales.reduce(
        (sum, sale) =>
            sum + Number(sale.total_amount || 0),
        0
    )
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
        outstanding: 0,
    })

    useEffect(() => {
        loadDashboardData()
    }, [])

    async function loadDashboardData() {
        try {
            setLoading(true)
            setError('')

            const [
                salesData,
                productsData,
            ] = await Promise.all([
                fetchSalesHistory(),
                fetchProducts(),
            ])

            const now = new Date()
            const todayString = getDateString(now)

            const startOfWeek =
                getStartOfWeek(now)

            const startOfMonth =
                getStartOfMonth(now)

            /*
             * SALES
             */

            const salesTodayData =
                salesData.filter(
                    (sale) =>
                        sale.date === todayString
                )

            const salesWeekData =
                salesData.filter((sale) => {
                    const date = getSaleDate(sale)

                    return (
                        date >= startOfWeek &&
                        date <= now
                    )
                })

            const salesMonthData =
                salesData.filter((sale) => {
                    const date = getSaleDate(sale)

                    return (
                        date >= startOfMonth &&
                        date <= now
                    )
                })

            const salesToday =
                getSalesTotal(
                    salesTodayData
                )

            const salesWeek =
                getSalesTotal(
                    salesWeekData
                )

            const salesMonth =
                getSalesTotal(
                    salesMonthData
                )

            /*
             * PROFIT
             */

            const profitToday =
                calculateProfit(
                    salesTodayData
                )

            const profitWeek =
                calculateProfit(
                    salesWeekData
                )

            const profitMonth =
                calculateProfit(
                    salesMonthData
                )

            /*
             * OUTSTANDING
             */

            const outstanding =
                salesData
                    .filter(
                        (sale) =>
                            sale.payment_status !==
                            'Paid'
                    )
                    .reduce(
                        (sum, sale) =>
                            sum +
                            Number(
                                sale.balance_amount ||
                                0
                            ),
                        0
                    )

            /*
             * INVENTORY
             */

            const normalizedInventory =
                productsData
                    .map((product) => ({
                        ...product,

                        stockBoxes: Number(
                            product.stock || 0
                        ),

                        stockBottles:
                            calculateBottles(
                                Number(
                                    product.stock || 0
                                ),
                                Number(
                                    product.quantity_per_box ||
                                    0
                                )
                            ),
                    }))
                    .sort((a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                    )

            const lowStockItems =
                normalizedInventory.filter(
                    (product) =>
                        product.stockBoxes <= 5
                )

            setInventory(
                normalizedInventory
            )

            setLowStock(
                lowStockItems
            )

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

    return (
        <div className="space-y-4 sm:space-y-5">

            {/* Compact page heading */}
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                    Dashboard
                </p>

                <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                    Overview
                </h1>

                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Sales, profit and inventory overview
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {/* Summary */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

                {/* Today's Sales */}
                <SummaryCard
                    label="Today's Sales"
                    value={summary.salesToday}
                    loading={loading}
                />

                {/* Today's Profit */}
                <SummaryCard
                    label="Today's Profit"
                    value={summary.profitToday}
                    loading={loading}
                    positive
                />

                {/* This Week */}
                <SummaryCard
                    label="This Week"
                    value={summary.salesWeek}
                    loading={loading}
                />

                {/* This Month */}
                <SummaryCard
                    label="This Month"
                    value={summary.salesMonth}
                    loading={loading}
                />

                {/* Outstanding */}
                <SummaryCard
                    label="Outstanding"
                    value={summary.outstanding}
                    loading={loading}
                    warning
                />
            </section>

            {/* Profit Period Summary */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <ProfitCard
                    label="Profit Today"
                    value={summary.profitToday}
                    loading={loading}
                />

                <ProfitCard
                    label="Profit This Week"
                    value={summary.profitWeek}
                    loading={loading}
                />

                <ProfitCard
                    label="Profit This Month"
                    value={summary.profitMonth}
                    loading={loading}
                />

            </section>

            {/* Inventory + Low Stock */}
            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">

                {/* Inventory */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Inventory
                            </h2>

                            <p className="text-xs text-slate-500">
                                Current stock levels
                            </p>
                        </div>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {inventory.length}
                        </span>
                    </div>

                    <div className="p-3 sm:p-4">
                        {loading ? (
                            <LoadingState text="Loading inventory..." />
                        ) : inventory.length === 0 ? (
                            <EmptyState text="No inventory items available." />
                        ) : (
                            <div className="space-y-2.5">
                                {inventory.map(
                                    (product) => {
                                        const low =
                                            product.stockBoxes <= 5

                                        return (
                                            <div
                                                key={product.id}
                                                className={`rounded-xl border p-3 ${
                                                    low
                                                        ? 'border-amber-200 bg-amber-50'
                                                        : 'border-slate-200 bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold text-slate-900">
                                                            {product.name}
                                                        </p>

                                                        <p className="mt-0.5 text-[11px] text-slate-500">
                                                            {product.quantity_per_box}{' '}
                                                            units / box
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                                                            low
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-emerald-100 text-emerald-700'
                                                        }`}
                                                    >
                                                        {low
                                                            ? 'Low'
                                                            : 'Healthy'}
                                                    </span>
                                                </div>

                                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                    <MiniStat
                                                        label="Boxes"
                                                        value={
                                                            product.stockBoxes
                                                        }
                                                    />

                                                    <MiniStat
                                                        label="Units"
                                                        value={
                                                            product.stockBottles
                                                        }
                                                    />

                                                    <MiniStat
                                                        label="Rate"
                                                        value={currency.format(
                                                            Number(
                                                                product.rate ||
                                                                0
                                                            )
                                                        )}
                                                    />

                                                    <MiniStat
                                                        label="MRP"
                                                        value={currency.format(
                                                            Number(
                                                                product.mrp ||
                                                                0
                                                            )
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* Low Stock */}
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Low Stock
                            </h2>

                            <p className="text-xs text-slate-500">
                                Products needing attention
                            </p>
                        </div>

                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {lowStock.length}
                        </span>
                    </div>

                    <div className="p-3 sm:p-4">
                        {loading ? (
                            <LoadingState text="Checking stock..." />
                        ) : lowStock.length === 0 ? (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                                <p className="text-sm font-semibold text-emerald-700">
                                    All stock levels are healthy
                                </p>

                                <p className="mt-1 text-xs text-emerald-600">
                                    No products are currently low.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {lowStock.map(
                                    (product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3"
                                        >
                                            <p className="min-w-0 truncate text-sm font-medium text-slate-900">
                                                {product.name}
                                            </p>

                                            <span className="shrink-0 text-xs font-bold text-amber-700">
                                                {product.stockBoxes}{' '}
                                                boxes
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Recent Sales */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Recent Sales
                        </h2>

                        <p className="text-xs text-slate-500">
                            Latest transactions
                        </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        Latest 5
                    </span>
                </div>

                <div className="p-3 sm:p-4">
                    {loading ? (
                        <LoadingState text="Loading recent sales..." />
                    ) : sales.length === 0 ? (
                        <EmptyState text="No sales recorded yet." />
                    ) : (
                        <div className="space-y-2">
                            {sales.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {sale.customer_name ||
                                                'One-time customer'}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Sale #{sale.id} •{' '}
                                            {sale.date}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                                        <span className="text-sm font-semibold text-slate-900">
                                            {currency.format(
                                                Number(
                                                    sale.total_amount ||
                                                    0
                                                )
                                            )}
                                        </span>

                                        <span
                                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                                sale.payment_status ===
                                                'Paid'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : sale.payment_status ===
                                                        'Partial'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : 'bg-slate-200 text-slate-700'
                                            }`}
                                        >
                                            {sale.payment_status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

/* =========================
   SMALL UI COMPONENTS
========================= */

function SummaryCard({
    label,
    value,
    loading,
    positive = false,
    warning = false,
}) {
    return (
        <div
            className={`rounded-xl border p-3 shadow-sm sm:p-4 ${
                positive
                    ? 'border-emerald-200 bg-emerald-50'
                    : warning
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-slate-200 bg-white'
            }`}
        >
            <p
                className={`text-[11px] font-medium ${
                    positive
                        ? 'text-emerald-700'
                        : warning
                          ? 'text-amber-700'
                          : 'text-slate-500'
                }`}
            >
                {label}
            </p>

            <p
                className={`mt-1.5 break-words text-base font-bold sm:text-xl ${
                    positive
                        ? 'text-emerald-700'
                        : warning
                          ? 'text-amber-700'
                          : 'text-slate-900'
                }`}
            >
                {loading
                    ? '...'
                    : currency.format(value)}
            </p>
        </div>
    )
}

function ProfitCard({
    label,
    value,
    loading,
}) {
    return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 shadow-sm sm:p-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-emerald-700">
                    {label}
                </p>

                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                    PROFIT
                </span>
            </div>

            <p className="mt-2 text-lg font-bold text-emerald-700 sm:text-xl">
                {loading
                    ? '...'
                    : currency.format(value)}
            </p>
        </div>
    )
}

function MiniStat({ label, value }) {
    return (
        <div className="rounded-lg bg-white px-2.5 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-0.5 truncate text-xs font-semibold text-slate-800">
                {value}
            </p>
        </div>
    )
}

function LoadingState({ text }) {
    return (
        <div className="py-8 text-center text-xs text-slate-500">
            {text}
        </div>
    )
}

function EmptyState({ text }) {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-xs text-slate-500">
            {text}
        </div>
    )
}