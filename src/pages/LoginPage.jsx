import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
export function LoginPage() {
    const navigate = useNavigate()
    const { signIn, session, loading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
                Checking session...
            </div>
        )
    }

    if (session) {
        return <Navigate to="/dashboard" replace />
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        if (!email.trim() || !password) {
            setError('Email and password are required.')
            return
        }

        setIsSubmitting(true)

        try {
            await signIn(email.trim(), password)

            navigate('/dashboard', { replace: true })
        } catch (loginError) {
            setError(loginError?.message || 'Unable to sign in. Please check your credentials.')
        } finally {
            setIsSubmitting(false)
        }
    }

    
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                        ERP Access
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900">Sign in</h1>
                   
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            autoComplete="email"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="admin@company.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="current-password"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
                    >
                        {isSubmitting ? 'Signing in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}
