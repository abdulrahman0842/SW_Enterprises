import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
]

export function Layout({ children }) {
    const navigate = useNavigate()
    const { signOut } = useAuth()

    async function handleLogout() {
        try {
            await signOut()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            navigate('/login', { replace: true })
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                            Enterprise Suite
                        </p>
                        <h1 className="text-xl font-bold text-slate-900">SW Enterprise ERP</h1>
                    </div>

                    <nav className="flex items-center gap-2 text-sm font-medium text-slate-600 md:gap-4">
                        {navItems.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `rounded-full px-3 py-2 transition ${isActive
                                        ? 'bg-sky-100 text-sky-700'
                                        : 'hover:bg-slate-100 hover:text-slate-900'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
    )
}
