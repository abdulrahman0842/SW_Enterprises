export function ProductForm({
    form,
    errors,
    isEditing,
    onChange,
    onSubmit,
    onCancel,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">

            {/* Form Header */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                        {isEditing ? 'Edit Product' : 'Add Product'}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        {isEditing
                            ? 'Update the product information below.'
                            : 'Enter the details for the new product.'}
                    </p>
                </div>

                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* Product Name */}
            <div className="space-y-1.5">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700"
                >
                    Product Name
                    <span className="ml-1 text-rose-500">*</span>
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={onChange}
                    placeholder="e.g. 250ml Water Bottle"
                    disabled={isSubmitting}
                    autoComplete="off"
                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.name
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                            : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                        }`}
                />

                {errors.name && (
                    <p className="text-xs text-rose-600">
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Quantity + Description */}
            <div className="grid gap-4 sm:grid-cols-[180px_1fr]">

                {/* Quantity */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="quantity_per_box"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Units / Box
                        <span className="ml-1 text-rose-500">*</span>
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
                        disabled={isSubmitting}
                        inputMode="numeric"
                        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${errors.quantity_per_box
                                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                                : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                            }`}
                    />

                    {errors.quantity_per_box && (
                        <p className="text-xs text-rose-600">
                            {errors.quantity_per_box}
                        </p>
                    )}

                    <p className="text-[11px] text-slate-400">
                        Number of units in one box
                    </p>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Description
                        <span className="ml-1 text-xs font-normal text-slate-400">
                            (optional)
                        </span>
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={onChange}
                        rows={3}
                        placeholder="Add product notes or packaging details"
                        disabled={isSubmitting}
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">

                {isEditing && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Saving...
                        </span>
                    ) : isEditing ? (
                        'Save Changes'
                    ) : (
                        'Add Product'
                    )}
                </button>
            </div>
        </form>
    )
}

