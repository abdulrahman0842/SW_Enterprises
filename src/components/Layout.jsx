import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Sidebar } from './Sidebar'

export function Layout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { signOut } = useAuth()

    async function handleLogout() {
        try {
            await signOut()
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            navigate('/login', {
                replace: true,
                state: {
                    from: location,
                },
            })
        }
    }

    return (
        <div className="flex min-h-screen bg-slate-100 text-slate-900">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                                SW Enterprises
                            </p>

                            <h1 className="text-xl font-bold text-slate-900">
                                SW Enterprise ERP
                            </h1>
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="ml-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}