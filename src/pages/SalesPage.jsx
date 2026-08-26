import { useEffect, useRef, useState } from 'react'
import { SalesForm } from '../components/sale/SalesForm'
import { SalesHistoryList } from '../components/SalesHistoryList'
import { Toast, useToast } from '../components/Toast'
import { createSale } from '../services/salesService'
import {
    fetchSalesHistory,
    normalizeSalesWithCounts,
} from '../services/salesHistoryService'
import { fetchProducts } from '../services/productsService'
import { openWhatsappInvoice } from '../utils/whatsapp'

export function SalesPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [sales, setSales] = useState([])
    const [selectedSaleId, setSelectedSaleId] = useState(null)
    const [loadingSales, setLoadingSales] = useState(true)
    const [salesError, setSalesError] = useState('')
    const [productsById, setProductsById] = useState(new Map())
    const [lastSavedSale, setLastSavedSale] = useState(null)

    const formRef = useRef(null)

    const {
        toasts,
        showToast,
        removeToast,
    } = useToast()

    useEffect(() => {
        loadSalesHistory()
    }, [])

    async function loadSalesHistory() {
        try {
            setLoadingSales(true)
            setSalesError('')

            const [
                salesData,
                productsData,
            ] = await Promise.all([
                fetchSalesHistory(),
                fetchProducts(),
            ])

            const productsMap = new Map(
                productsData.map((product) => [
                    product.id,
                    product,
                ])
            )

            setProductsById(productsMap)

            const normalizedSales =
                normalizeSalesWithCounts(salesData)

            setSales(normalizedSales)

            if (
                salesData.length > 0 &&
                !selectedSaleId
            ) {
                setSelectedSaleId(salesData[0].id)
            }
        } catch (error) {
            console.error(
                'Failed to load sales history:',
                error
            )

            setSalesError(
                'Failed to load sales history.'
            )

            showToast(
                'Failed to load sales history',
                'error'
            )
        } finally {
            setLoadingSales(false)
        }
    }

    async function handleSubmitSale(saleData) {
        try {
            setIsSubmitting(true)

            const result = await createSale(saleData)
            console.log("result",result)
            setLastSavedSale(result)
            setSelectedSaleId(result.id)

            showToast(
                `Sale #${result.sale_id} created successfully. Stock updated.`,
                'success'
            )

            if (formRef.current?.resetForm) {
                formRef.current.resetForm()
            }

            await loadSalesHistory()
        } catch (error) {
            console.error(
                'Error creating sale:',
                error
            )

            showToast(
                error.message ||
                'Failed to create sale',
                'error'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedSale =
        sales.find(
            (sale) =>
                sale.id === selectedSaleId
        ) || null

    function handleSendInvoice(sale) {
        openWhatsappInvoice(
            sale,
            productsById
        )
    }

    return (
        <div className="space-y-4 sm:space-y-6">

            {/* =========================
                PAGE HEADER
            ========================== */}
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                        Sales
                    </p>

                    <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                        Create Sale
                    </h1>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Create sales and manage customer orders
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadSalesHistory}
                    disabled={loadingSales}
                    title="Refresh sales"
                    aria-label="Refresh sales"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-sky-600 active:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <svg
                        className={`h-4 w-4 ${loadingSales ? 'animate-spin' : ''
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
                </button>
            </div>

            {/* =========================
                SALE FORM
            ========================== */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                            +
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                                New Sale
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Create a new sale
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-5">
                    <SalesForm
                        ref={formRef}
                        onSubmit={handleSubmitSale}
                        isLoading={isSubmitting}
                    />

                    {/* Invoice action */}
                    {lastSavedSale && (
                        <div className="mt-4 border-t border-slate-100 pt-4">
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-800">
                                            Sale #
                                            {lastSavedSale.id}{' '}
                                            created
                                        </p>

                                        <p className="mt-0.5 text-xs text-emerald-700">
                                            Stock has been updated successfully.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSendInvoice(
                                                lastSavedSale
                                            )
                                        }
                                        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
                                    >
                                        Send WhatsApp Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* =========================
                SALES HISTORY
            ========================== */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3.5 sm:px-5">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Recent Sales
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            View previous sales and invoices
                        </p>
                    </div>

                    <span className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {sales.length}{' '}
                        {sales.length === 1 ? 'sale' : 'sales'}
                    </span>
                </div>

                {/* Sales List */}
                <div className="p-2.5 sm:p-4">
                    <SalesHistoryList
                        sales={sales}
                        loading={loadingSales}
                        error={salesError}
                        onSelectSale={setSelectedSaleId}
                        selectedSale={selectedSale}
                        productsById={productsById}
                        onSendInvoice={handleSendInvoice}
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