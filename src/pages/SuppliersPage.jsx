import { useEffect, useState } from 'react'
import { SupplierForm } from '../components/Supplier/SupplierForm'
import { SupplierList } from '../components/Supplier/SupplierList'
import { Toast, useToast } from '../components/Toast'
import {
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from '../services/supplierService'

export function SuppliersPage() {
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [editingSupplier, setEditingSupplier] = useState(null)
    const [showDetail, setShowDetail] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toasts, showToast, removeToast } = useToast()



    async function loadSuppliers() {
        try {
            setLoading(true)
            const data = await fetchSuppliers()
            setSuppliers(data)
        } catch (error) {
            console.error('Failed to load suppliers:', error)
            showToast('Failed to load suppliers', 'error')
        } finally {
            setLoading(false)
        }
    }

    async function handleAddSupplier(formData) {
        try {
            setIsSubmitting(true)

            const newSupplier = await createSupplier(formData)

            setSuppliers((prev) =>
                [...prev, newSupplier].sort((a, b) =>
                    a.name.localeCompare(b.name)
                )
            )

            showToast('Supplier added successfully', 'success')
        } catch (error) {
            console.error('Failed to add supplier:', error)
            showToast('Failed to add supplier', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleUpdateSupplier(formData) {
        try {
            setIsSubmitting(true)

            const updated = await updateSupplier(
                editingSupplier.id,
                formData
            )

            setSuppliers((prev) =>
                prev
                    .map((supplier) =>
                        supplier.id === editingSupplier.id
                            ? updated
                            : supplier
                    )
                    .sort((a, b) =>
                        a.name.localeCompare(b.name)
                    )
            )

            setEditingSupplier(null)

            showToast('Supplier updated successfully', 'success')
        } catch (error) {
            console.error('Failed to update supplier:', error)
            showToast('Failed to update supplier', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteSupplier(id) {
        if (
            !window.confirm(
                'Are you sure you want to delete this supplier?'
            )
        ) {
            return
        }

        try {
            await deleteSupplier(id)

            setSuppliers((prev) =>
                prev.filter((supplier) => supplier.id !== id)
            )

            setShowDetail(false)
            setSelectedSupplier(null)

            showToast('Supplier deleted successfully', 'success')
        } catch (error) {
            console.error('Failed to delete supplier:', error)
            showToast('Failed to delete supplier', 'error')
        }
    }

    function handleSelectDetail(id) {
        const supplier = suppliers.find(
            (supplier) => supplier.id === id
        )

        setSelectedSupplier(supplier)
        setShowDetail(true)
    }

    function handleEditClick(supplier) {
        setEditingSupplier(supplier)
        setShowDetail(false)
    }

    function handleCloseDetail() {
        setShowDetail(false)
        setSelectedSupplier(null)
    }

    function handleCloseEdit() {
        setEditingSupplier(null)
    }
    useEffect(() => {
        loadSuppliers()
    }, [])
    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">
                        Suppliers
                    </p>

                    <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                        Manage Suppliers
                    </h1>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Add and manage your suppliers.
                    </p>
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                    {suppliers.length}
                </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {/* Supplier Form */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="border-b border-slate-100 pb-3">
                            <h2 className="text-sm font-semibold text-slate-900">
                                {editingSupplier
                                    ? 'Edit Supplier'
                                    : 'Add Supplier'}
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                {editingSupplier
                                    ? 'Update supplier details'
                                    : 'Enter supplier details'}
                            </p>
                        </div>

                        <div className="pt-4">
                            <SupplierForm
                                supplier={editingSupplier || null}
                                onSubmit={
                                    editingSupplier
                                        ? handleUpdateSupplier
                                        : handleAddSupplier
                                }
                                isLoading={isSubmitting}
                            />

                            {editingSupplier && (
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

                {/* Supplier List / Details */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* List Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 sm:px-5">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">
                                    {showDetail && selectedSupplier
                                        ? 'Supplier Details'
                                        : 'Suppliers'}
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {showDetail && selectedSupplier
                                        ? 'View supplier information'
                                        : 'Select a supplier to view details'}
                                </p>
                            </div>

                            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                {suppliers.length}
                            </span>
                        </div>

                        <div className="p-4 sm:p-5">
                            {showDetail && selectedSupplier ? (
                                <div className="space-y-3">
                                    {/* Supplier Name */}
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                    Supplier
                                                </p>

                                                <p className="mt-1 truncate text-base font-semibold text-slate-900">
                                                    {selectedSupplier.name}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleCloseDetail}
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-600"
                                                aria-label="Close supplier details"
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
                                            {selectedSupplier.contact || '—'}
                                        </p>
                                    </div>



                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditClick(
                                                    selectedSupplier
                                                )
                                            }
                                            className="h-11 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 active:bg-sky-800"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteSupplier(
                                                    selectedSupplier.id
                                                )
                                            }
                                            className="h-11 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 active:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <SupplierList
                                    suppliers={suppliers}
                                    loading={loading}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteSupplier}
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

