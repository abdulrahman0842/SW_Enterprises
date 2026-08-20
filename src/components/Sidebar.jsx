import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/purchases', label: 'Purchases' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/sales', label: 'Sales' },
    { to: '/customers', label: 'Customers' },
]

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile menu button - shown on small screens */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg md:hidden"
                aria-label="Toggle navigation"
            >
                <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-slate-900 text-slate-50 shadow-lg transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="border-b border-slate-700 px-4 py-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
                            ERP System
                        </p>
                        <h2 className="mt-2 text-lg font-bold">SW Enterprise</h2>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                        {navItems.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${isActive
                                        ? 'bg-sky-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Sidebar footer */}
                    <div className="border-t border-slate-700 px-4 py-4 text-xs text-slate-400">
                        <p className="truncate">Version 1.0.0</p>
                    </div>
                </div>
            </aside>
        </>
    )
}
