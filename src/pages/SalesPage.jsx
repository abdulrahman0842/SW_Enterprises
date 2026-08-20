import { useRef, useState } from 'react'
import { SalesForm } from '../components/SalesForm'
import { Toast, useToast } from '../components/Toast'
import { createSale } from '../services/salesService'

export function SalesPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const formRef = useRef(null)
    const { toasts, showToast, removeToast } = useToast()

    async function handleSubmitSale(saleData) {
        try {
            setIsSubmitting(true)
            const result = await createSale(saleData)
            
            showToast(
                `Sale #${result.id} created successfully! Stock updated.`,
                'success'
            )
            
            // Reset form by calling reset method on ref
            if (formRef.current?.resetForm) {
                formRef.current.resetForm()
            }
        } catch (error) {
            console.error('Error creating sale:', error)
            showToast(error.message || 'Failed to create sale', 'error')
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
                <SalesForm ref={formRef} onSubmit={handleSubmitSale} isLoading={isSubmitting} />
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
