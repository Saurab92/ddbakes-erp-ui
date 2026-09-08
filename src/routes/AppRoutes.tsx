import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { canAccessPath, getAuthSession } from '@/api/auth'
import { AppLayout } from '@/layouts/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'
import { UnitsPage } from '@/features/units/pages/UnitsPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { DepartmentsPage } from '@/features/departments/pages/DepartmentsPage'
import { SuppliersPage } from '@/features/suppliers/pages/SuppliersPage'
import { PersonsPage } from '@/features/persons/pages/PersonsPage'
import { PurchasesPage } from '@/features/purchases/pages/PurchasesPage'
import { IssuesPage } from '@/features/issues/pages/IssuesPage'
import { StocksPage } from '@/features/stocks/pages/StocksPage'
import { ConsumptionReportsPage } from '@/features/reports/pages/ConsumptionReportsPage'
import { RolesPage } from '@/features/roles/pages/RolesPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { Login } from '@/pages/Login'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const session = getAuthSession()

  if (!session) return <Navigate to="/login" replace />
  if (!canAccessPath(location.pathname, session)) return <Navigate to="/" replace />

  return children
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/persons" element={<PersonsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/reports/consumption" element={<ConsumptionReportsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
