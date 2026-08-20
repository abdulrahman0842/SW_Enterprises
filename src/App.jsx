import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { Layout } from './components/Layout'
// import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsPage } from './pages/ProductsPage'

function AppRoutes() {
  const { session, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
        Loading application...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          // <ProtectedRoute>
          <Layout>
            <DashboardPage />
          </Layout>
          // </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          // <ProtectedRoute>
          <Layout>
            <ProductsPage />
          </Layout>
          // </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
