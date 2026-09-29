export function SupplierList({
    suppliers,
    loading,
    onEdit,
    onDelete,
    onSelectDetail,
}) {
    if (loading) {
        return (
            <div className="py-8 text-center text-slate-500">
                Loading suppliers...
            </div>
        )
    }

    if (!suppliers || suppliers.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                No suppliers yet. Add your first supplier to get started.
            </div>
        )
    }

    return (
        <>
            {/* Mobile cards view */}
            <div className="space-y-2.5 md:hidden">
                {suppliers.map((supplier) => (
                    <article
                        key={supplier.id}
                        className="rounded-xl border border-slate-200 bg-white p-2.5"
                    >
                        <div className="flex items-center gap-2.5">
                            {/* Supplier Info */}
                            <button
                                type="button"
                                onClick={() =>
                                    onSelectDetail(supplier.id)
                                }
                                className="min-w-0 flex-1 rounded-lg bg-slate-50 px-3 py-2.5 text-left transition active:bg-slate-100"
                            >
                                <h3 className="truncate text-sm font-semibold text-slate-900">
                                    {supplier.name}
                                </h3>

                                <p className="mt-1 text-xs font-medium text-slate-600">
                                    {supplier.contact || 'No contact'}
                                </p>

                               
                            </button>

                            {/* Actions */}
                            <div className="flex shrink-0 flex-col gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => onEdit(supplier)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100"
                                    aria-label={`Edit ${supplier.name}`}
                                >
                                    <span className="text-sm">✎</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete(supplier.id)
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 active:bg-red-100"
                                    aria-label={`Delete ${supplier.name}`}
                                >
                                    <span className="text-sm">×</span>
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 md:block">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Name
                                </th>

                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Contact
                                </th>

                               

                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {suppliers.map((supplier) => (
                                <tr
                                    key={supplier.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSelectDetail(
                                                    supplier.id
                                                )
                                            }
                                            className="text-sm font-semibold text-slate-900 hover:text-sky-600"
                                        >
                                            {supplier.name}
                                        </button>
                                    </td>

                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {supplier.contact || '—'}
                                    </td>

                                

                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(supplier)
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(
                                                        supplier.id
                                                    )
                                                }
                                                className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}