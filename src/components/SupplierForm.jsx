import { useState } from 'react'

export function SupplierForm({ supplier = null, onSubmit, isLoading = false }) {
    const [formData, setFormData] = useState({
        name: supplier?.name || '',
        contact: supplier?.contact || '',
    })
    const [errors, setErrors] = useState({})

    function validateForm() {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.contact.trim()) {
            newErrors.contact = 'Contact is required'
        }

        return newErrors
    }

    function handleSubmit(e) {
        e.preventDefault()

        const newErrors = validateForm()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        onSubmit(formData)
    }

    function handleChange(e) {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                    Name <span className="text-red-500">*</span>
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    maxLength={255}
                    placeholder="Supplier name"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />

                {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.name}
                    </p>
                )}
            </div>

            {/* Contact */}
            <div>
                <label
                    htmlFor="contact"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                    Contact <span className="text-red-500">*</span>
                </label>

                <input
                    id="contact"
                    name="contact"
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    disabled={isLoading}
                    maxLength={255}
                    placeholder="Phone number"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />

                {errors.contact && (
                    <p className="mt-1 text-xs text-red-600">
                        {errors.contact}
                    </p>
                )}
            </div>

            {/* Address */}
            {/* <div>
                <label
                    htmlFor="address"
                    className="mb-1.5 block text-xs font-medium text-slate-600"
                >
                    Address
                    <span className="ml-1 text-[11px] text-slate-400">
                        Optional
                    </span>
                </label>

                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={3}
                    maxLength={500}
                    placeholder="Customer address"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                />
            </div> */}

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 active:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {isLoading
                    ? 'Saving...'
                    : supplier
                        ? 'Update Supplier'
                        : 'Add Supplier'}
            </button>
        </form>
    )
}
