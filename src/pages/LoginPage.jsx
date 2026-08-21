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
    const [showPassword, setShowPassword] = useState(false)

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
                    <p className="text-sm text-slate-500">Checking session...</p>
                </div>
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
            setError(
                loginError?.message ||
                'Unable to sign in. Please check your credentials.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">

            {/* Main */}
            <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">

                <div className="w-full max-w-md">

                    {/* Brand */}
                    <div className="mb-8 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 shadow-lg shadow-sky-600/20">
                            <span className="text-2xl font-bold tracking-tight text-white">
                                SW
                            </span>
                        </div>

                        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                            SW Enterprises
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Business Management System
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Welcome back
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Sign in to continue to your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    autoComplete="email"
                                    autoFocus
                                    disabled={isSubmitting}
                                    placeholder="admin@company.com"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>
                                </div>

                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        autoComplete="current-password"
                                        disabled={isSubmitting}
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isSubmitting}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                                        aria-label={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                                <circle cx="12" cy="12" r="3" />
                                                <path d="M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mt-0.5 h-4 w-4 shrink-0"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 8v4M12 16h.01" />
                                    </svg>

                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-500/20 disabled:cursor-not-allowed disabled:bg-sky-300"
                            >
                                {isSubmitting && (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                )}

                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                    </div>

                    {/* Security note */}
                    <p className="mt-5 text-center text-xs text-slate-400">
                        Authorized users only
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-4 py-5 text-center">
                <p className="text-xs text-slate-400">
                    © {new Date().getFullYear()} SW Enterprises. All rights reserved.
                </p>
            </footer>
        </div>
    )
}