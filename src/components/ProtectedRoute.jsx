import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
    const { session, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
                Loading session...
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    return children
}
