import { useAuth } from '../hooks/useAuth'

export function DashboardPage() {
    const { user, signOut } = useAuth()

    async function handleLogout() {
        await signOut()
    }

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                            Dashboard
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-slate-900">Welcome back</h1>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Logout
                    </button>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Signed in as</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                    {user?.email || 'Authenticated user'}
                </p>
            </section>
        </div>
    )
}
