import { useEffect, useState } from 'react'
import { CustomerForm } from '../components/CustomerForm'
import { CustomerList } from '../components/CustomerList'
import { Toast, useToast } from '../components/Toast'
import {
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../services/customersService'

export function CustomersPage() {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [showDetail, setShowDetail] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toasts, showToast, removeToast } = useToast()

    useEffect(() => {
        loadCustomers()
    }, [])

    async function loadCustomers() {
        try {
            setLoading(true)
            const data = await fetchCustomers()
            setCustomers(data)
        } catch (error) {
            console.error('Failed to load customers:', error)
            showToast('Failed to load customers', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleAddCustomer(formData) {
        try {
            setIsSubmitting(true)
            const newCustomer = await createCustomer(formData)
            setCustomers((prev) => [...prev, newCustomer].sort((a, b) => a.name.localeCompare(b.name)))
            showToast('Customer added successfully', 'success')
        } catch (error) {
            console.error('Failed to add customer:', error)
            showToast('Failed to add customer', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleUpdateCustomer(formData) {
        try {
            setIsSubmitting(true)
            const updated = await updateCustomer(editingCustomer.id, formData)
            setCustomers((prev) =>
                prev
                    .map((c) => (c.id === editingCustomer.id ? updated : c))
                    .sort((a, b) => a.name.localeCompare(b.name))
            )
            setEditingCustomer(null)
            showToast('Customer updated successfully', 'success')
        } catch (error) {
            console.error('Failed to update customer:', error)
            showToast('Failed to update customer', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteCustomer(id) {
        if (!window.confirm('Are you sure you want to delete this customer?')) {
            return
        }

        try {
            await deleteCustomer(id)
            setCustomers((prev) => prev.filter((c) => c.id !== id))
            setShowDetail(false)
            setSelectedCustomer(null)
            showToast('Customer deleted successfully', 'success')
        } catch (error) {
            console.error('Failed to delete customer:', error)
            showToast('Failed to delete customer', 'error')
        }
    }

    function handleSelectDetail(id) {
        const customer = customers.find((c) => c.id === id)
        setSelectedCustomer(customer)
        setShowDetail(true)
    }

    function handleEditClick(customer) {
        setEditingCustomer(customer)
        setShowDetail(false)
    }

    function handleCloseDetail() {
        setShowDetail(false)
        setSelectedCustomer(null)
    }

    function handleCloseEdit() {
        setEditingCustomer(null)
    }

    return (
      <div className="space-y-4">
    {/* Page Header */}
    <div className="flex items-center justify-between gap-3">
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                Customers
            </p>

            <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                Manage Customers
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Add and manage your customers.
            </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {customers.length}
        </span>
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
        {/* Customer Form */}
        <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-sm font-semibold text-slate-900">
                        {editingCustomer
                            ? 'Edit Customer'
                            : 'Add Customer'}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                        {editingCustomer
                            ? 'Update customer details'
                            : 'Enter customer details'}
                    </p>
                </div>

                <div className="pt-4">
                    <CustomerForm
                        customer={editingCustomer || null}
                        onSubmit={
                            editingCustomer
                                ? handleUpdateCustomer
                                : handleAddCustomer
                        }
                        isLoading={isSubmitting}
                    />

                    {editingCustomer && (
                        <button
                            type="button"
                            onClick={handleCloseEdit}
                            disabled={isSubmitting}
                            className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Customer List / Details */}
        <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* List Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                            {showDetail && selectedCustomer
                                ? 'Customer Details'
                                : 'Customers'}
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {showDetail && selectedCustomer
                                ? 'View customer information'
                                : 'Select a customer to view details'}
                        </p>
                    </div>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {customers.length}
                    </span>
                </div>

                <div className="p-4 sm:p-5">
                    {showDetail && selectedCustomer ? (
                        <div className="space-y-3">
                            {/* Customer Name */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                            Customer
                                        </p>

                                        <p className="mt-1 truncate text-base font-semibold text-slate-900">
                                            {selectedCustomer.name}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCloseDetail}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-600"
                                        aria-label="Close customer details"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="border-t border-slate-100 pt-3">
                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                    Contact
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-700">
                                    {selectedCustomer.contact || '—'}
                                </p>
                            </div>

                            {/* Address */}
                            {selectedCustomer.address && (
                                <div className="border-t border-slate-100 pt-3">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        Address
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                        {selectedCustomer.address}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleEditClick(
                                            selectedCustomer
                                        )
                                    }
                                    className="h-11 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 active:bg-sky-800"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteCustomer(
                                            selectedCustomer.id
                                        )
                                    }
                                    className="h-11 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:bg-red-100"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <CustomerList
                            customers={customers}
                            loading={loading}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteCustomer}
                            onSelectDetail={handleSelectDetail}
                        />
                    )}
                </div>
            </div>
        </div>
    </div>

    {/* Toasts */}
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
