export function CustomerList({ customers, loading, onEdit, onDelete, onSelectDetail }) {
    if (loading) {
        return (
            <div className="py-8 text-center text-slate-500">
                Loading customers...
            </div>
        )
    }

    if (!customers || customers.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                No customers yet. Add your first customer to get started.
            </div>
        )
    }

    return (
        <>
            {/* Mobile cards view */}
            <div className="space-y-3 md:hidden">
                {customers.map((customer) => (
                    <article
                        key={customer.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <h3
                                    onClick={() => onSelectDetail(customer.id)}
                                    className="text-lg font-semibold text-sky-600 cursor-pointer hover:underline"
                                >
                                    {customer.name}
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">{customer.contact}</p>
                                {customer.address && (
                                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                        {customer.address}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(customer)}
                                    className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                                    title="Edit"
                                >
                                    <span className="text-sm font-semibold">✎</span>
                                </button>
                                <button
                                    onClick={() => onDelete(customer.id)}
                                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                    title="Delete"
                                >
                                    <span className="text-sm font-semibold">✕</span>
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Contact
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Address
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => onSelectDetail(customer.id)}
                                        className="text-sky-600 hover:underline font-semibold"
                                    >
                                        {customer.name}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-slate-700">{customer.contact}</td>
                                <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                                    {customer.address || '—'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(customer.id)}
                                            className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100"
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
        </>
    )
}
