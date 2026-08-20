import { useState } from 'react'
import { SalesForm } from '../components/SalesForm'
import { Toast, useToast } from '../components/Toast'

export function SalesPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submittedData, setSubmittedData] = useState(null)
    const { toasts, showToast, removeToast } = useToast()

    async function handleSubmitSale(saleData) {
        try {
            setIsSubmitting(true)
            // TODO: Save to Supabase when backend is ready
            // For now, just validate and display the data
            console.log('Sale data ready for submission:', saleData)
            setSubmittedData(saleData)
            showToast('Sale form validated successfully. Ready for save implementation.', 'success')
        } catch (error) {
            console.error('Error processing sale:', error)
            showToast('Error processing sale', 'error')
        } finally {
            setIsSubmitting(false)
        }
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
                <SalesForm onSubmit={handleSubmitSale} isLoading={isSubmitting} />
            </div>

            {submittedData && (
                <section className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm sm:p-6">
                    <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                        Form Data Validated
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-green-900">
                        <p>
                            <strong>Customer:</strong> {submittedData.customer_id ? `ID: ${submittedData.customer_id}` : 'One-time'} - {submittedData.customer_name}
                        </p>
                        <p>
                            <strong>Items:</strong> {submittedData.items.length} product(s)
                        </p>
                        <p>
                            <strong>Total:</strong> ₹{submittedData.total_amount.toFixed(2)}
                        </p>
                    </div>
                </section>
            )}

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
