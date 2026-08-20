export function ProductList({ products, onEdit, onDelete, deleting }) {
    if (products.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                No products added yet.
            </div>
        )
    }

    return (
        <>
            {/* Mobile cards view */}
            <div className="space-y-3 md:hidden">
                {products.map((product) => (
                    <article
                        key={product.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                            {product.description && (
                                <p className="mt-1 text-sm text-slate-600">{product.description}</p>
                            )}
                        </div>

                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Per box:</span>
                                <span className="font-medium text-slate-900">{product.quantity_per_box}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Stock:</span>
                                <span className="font-medium text-slate-900">{product.stock} boxes</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Rate:</span>
                                <span className="font-medium text-slate-900">₹{parseFloat(product.rate).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">MRP:</span>
                                <span className="font-medium text-slate-900">₹{parseFloat(product.mrp).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(product)}
                                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(product.id)}
                                disabled={deleting === product.id}
                                className="flex-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting === product.id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Per Box</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Stock</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">Rate</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-900">MRP</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-b border-slate-100 hover:bg-slate-50"
                            >
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium text-slate-900">{product.name}</p>
                                        {product.description && (
                                            <p className="text-xs text-slate-600">{product.description}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-900">{product.quantity_per_box}</td>
                                <td className="px-4 py-3 text-slate-900">{product.stock} boxes</td>
                                <td className="px-4 py-3 text-slate-900">₹{parseFloat(product.rate).toFixed(2)}</td>
                                <td className="px-4 py-3 text-slate-900">₹{parseFloat(product.mrp).toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(product)}
                                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(product.id)}
                                            disabled={deleting === product.id}
                                            className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {deleting === product.id ? 'Deleting...' : 'Delete'}
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
