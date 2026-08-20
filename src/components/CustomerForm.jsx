import { useState } from 'react'

export function CustomerForm({ customer = null, onSubmit, isLoading = false }) {
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        contact: customer?.contact || '',
        address: customer?.address || '',
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
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
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
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Customer name"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-slate-700">
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
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Phone, email, or other contact"
                />
                {errors.contact && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
                )}
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                    Address
                </label>
                <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={3}
                    maxLength={500}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Street address, city, postal code, etc. (optional)"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:text-slate-500"
            >
                {isLoading ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
            </button>
        </form>
    )
}
