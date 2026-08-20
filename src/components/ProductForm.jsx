export function ProductForm({ form, errors, isEditing, onChange, onSubmit, onCancel, isSubmitting }) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">
                    {isEditing ? 'Edit Product' : 'Add Product'}
                </h2>
                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                )}
            </div>

            <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Product name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="250ml Water Bottle"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                {errors.name && <p className="text-sm text-rose-600">{errors.name}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    rows="4"
                    placeholder="Add product notes or packaging details"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="quantity_per_box" className="block text-sm font-medium text-slate-700">
                    Quantity per box
                </label>
                <input
                    id="quantity_per_box"
                    name="quantity_per_box"
                    type="number"
                    min="1"
                    step="1"
                    value={form.quantity_per_box}
                    onChange={onChange}
                    placeholder="30"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                />
                {errors.quantity_per_box && (
                    <p className="text-sm text-rose-600">{errors.quantity_per_box}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
            >
                {isSubmitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add product'}
            </button>
        </form>
    )
}
