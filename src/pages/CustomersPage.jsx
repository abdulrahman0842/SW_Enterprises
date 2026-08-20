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
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Customers Module
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Manage customers
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Create and maintain your list of regular customers for quick selection when making sales.
                </p>
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="text-lg font-semibold text-slate-900">
                            {editingCustomer ? 'Edit Customer' : 'Add Customer'}
                        </h2>
                        <div className="mt-4">
                            <CustomerForm
                                customer={editingCustomer || null}
                                onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
                                isLoading={isSubmitting}
                            />
                            {editingCustomer && (
                                <button
                                    onClick={handleCloseEdit}
                                    className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* List/Detail Section */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-xl font-semibold text-slate-900">
                                {showDetail && selectedCustomer ? 'Customer Details' : 'Customers'}
                            </h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                {customers.length}
                            </span>
                        </div>

                        {showDetail && selectedCustomer ? (
                            <div className="space-y-4">
                                <div className="rounded-lg bg-slate-50 p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Name
                                            </p>
                                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                                {selectedCustomer.name}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleCloseDetail}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Contact
                                    </p>
                                    <p className="mt-2 text-slate-700">{selectedCustomer.contact}</p>
                                </div>

                                {selectedCustomer.address && (
                                    <div className="rounded-lg border border-slate-200 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Address
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap text-slate-700">
                                            {selectedCustomer.address}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => handleEditClick(selectedCustomer)}
                                        className="flex-1 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                                        className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
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
