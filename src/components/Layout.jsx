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
                    <div className="flex items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
                        <h1 className="text-lg font-bold text-slate-900">
                            SW Enterprises
                        </h1>

                        <button
                            type="button"
                            onClick={handleLogout}
                            aria-label="Logout"
                            title="Logout"
                            className="rounded-md border border-red-200 bg-red-50 p-2 text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m10 17 5-5-5-5"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12H3"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}