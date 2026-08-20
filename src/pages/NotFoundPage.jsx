import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-slate-800">404</h1>

        <h2 className="mt-4 text-2xl font-semibold text-slate-700">
          Page Not Found
        </h2>

        <p className="mt-2 text-slate-500">
          The page you are looking for doesn't exist.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}