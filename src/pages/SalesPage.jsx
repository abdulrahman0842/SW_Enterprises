import { useEffect, useRef, useState } from 'react'
import { SalesForm } from '../components/SalesForm'
import { SalesHistoryList } from '../components/SalesHistoryList'
import { Toast, useToast } from '../components/Toast'
import { createSale } from '../services/salesService'
import { fetchSalesHistory, normalizeSalesWithCounts } from '../services/salesHistoryService'
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
    const { toasts, showToast, removeToast } = useToast()

    useEffect(() => {
        loadSalesHistory()
    }, [])

    async function loadSalesHistory() {
        try {
            setLoadingSales(true)
            setSalesError('')

            const [salesData, productsData] = await Promise.all([
                fetchSalesHistory(),
                fetchProducts(),
            ])

            const productsMap = new Map(productsData.map((product) => [product.id, product]))
            setProductsById(productsMap)
            setSales(normalizeSalesWithCounts(salesData))

            if (salesData.length > 0 && !selectedSaleId) {
                setSelectedSaleId(salesData[0].id)
            }
        } catch (error) {
            console.error('Failed to load sales history:', error)
            setSalesError('Failed to load sales history.')
            showToast('Failed to load sales history', 'error')
        } finally {
            setLoadingSales(false)
        }
    }

    async function handleSubmitSale(saleData) {
        try {
            setIsSubmitting(true)
            const result = await createSale(saleData)
            setLastSavedSale(result)
            setSelectedSaleId(result.id)

            showToast(
                `Sale #${result.id} created successfully! Stock updated.`,
                'success'
            )

            if (formRef.current?.resetForm) {
                formRef.current.resetForm()
            }

            await loadSalesHistory()
        } catch (error) {
            console.error('Error creating sale:', error)
            showToast(error.message || 'Failed to create sale', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const selectedSale = sales.find((sale) => sale.id === selectedSaleId) || null

    function handleSendInvoice(sale) {
        openWhatsappInvoice(sale, productsById)
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Sales Module
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Create sale
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Add products to sales, manage customer details, and track order totals.
                </p>
            </section>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SalesForm ref={formRef} onSubmit={handleSubmitSale} isLoading={isSubmitting} />

                {lastSavedSale && (
                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={() => handleSendInvoice(lastSavedSale)}
                            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-700"
                        >
                            Send Invoice on WhatsApp
                        </button>
                    </div>
                )}
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                            Sales History
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-slate-900">Recent sales</h2>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {sales.length} sales
                    </span>
                </div>

                <SalesHistoryList
                    sales={sales}
                    loading={loadingSales}
                    error={salesError}
                    onSelectSale={setSelectedSaleId}
                    selectedSale={selectedSale}
                    productsById={productsById}
                    onSendInvoice={handleSendInvoice}
                />
            </section>

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
