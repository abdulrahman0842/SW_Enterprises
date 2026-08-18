export function ProductList({ products, onEdit, onDelete }) {
    if (products.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                No products added yet.
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {products.map((product) => (
                <article
                    key={product.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
                            {product.description && (
                                <p className="mt-1 text-sm text-slate-600">{product.description}</p>
                            )}
                        </div>

                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                            {product.bottlesPerBox} / box
                        </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={() => onEdit(product)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(product.id)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
                        >
                            Delete
                        </button>
                    </div>
                </article>
            ))}
        </div>
    )
}
