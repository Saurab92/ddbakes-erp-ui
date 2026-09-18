import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { canAccessPath, getAuthSession } from '@/api/auth'
import { AppLayout } from '@/layouts/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { HRDashboard } from '@/pages/HRDashboard'
import { FinanceDashboard } from '@/pages/FinanceDashboard'
import { ModulePlaceholderPage } from '@/components/common/ModulePlaceholderPage'
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
        {/* DD BAKES MANAGEMENT SYSTEM (Bakery / Inventory) */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory/dashboard" element={<Dashboard />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/inventory/units" element={<UnitsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/inventory/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/inventory/categories" element={<CategoriesPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/inventory/departments" element={<DepartmentsPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/inventory/suppliers" element={<SuppliersPage />} />
        <Route path="/persons" element={<PersonsPage />} />
        <Route path="/inventory/persons" element={<PersonsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/inventory/users" element={<UsersPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/inventory/roles" element={<RolesPage />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/inventory/purchases" element={<PurchasesPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/inventory/issues" element={<IssuesPage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/inventory/stocks" element={<StocksPage />} />
        <Route path="/reports/consumption" element={<ConsumptionReportsPage />} />
        <Route path="/inventory/reports/consumption" element={<ConsumptionReportsPage />} />
        <Route
          path="/inventory/inventory"
          element={
            <ModulePlaceholderPage
              title="Inventory Overview"
              moduleId="bakery"
              description="Comprehensive view of real-time inventory assets and warehouse stock."
              highlights={['Multi-warehouse tracking', 'Batch & Expiry alerts', 'Stock value ledger']}
            />
          }
        />
        <Route
          path="/inventory/sales"
          element={
            <ModulePlaceholderPage
              title="Bakery Sales"
              moduleId="bakery"
              description="Point of sale records and daily counter transactions."
              highlights={['Retail counter sales', 'B2B Wholesale dispatches', 'Product sales velocity']}
            />
          }
        />
        <Route
          path="/inventory/production"
          element={
            <ModulePlaceholderPage
              title="Bakery Production"
              moduleId="bakery"
              description="Daily batch production runs and raw material consumption."
              highlights={['Recipe & BOM planning', 'Daily baking batch schedules', 'Wastage tracking']}
            />
          }
        />

        {/* HR MANAGEMENT */}
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route
          path="/hr/employees"
          element={
            <ModulePlaceholderPage
              title="Employees"
              moduleId="hr"
              description="Directory and employee profile management across all bakery branches."
              highlights={[
                'Employee profiles & contact data',
                'Department & designation hierarchy',
                'Employment terms & shift assignments',
                'Document management & compliance records',
              ]}
            />
          }
        />
        <Route
          path="/hr/attendance"
          element={
            <ModulePlaceholderPage
              title="Attendance Management"
              moduleId="hr"
              description="Centralized daily attendance, shift logs, and clock-in records."
              notice="Attendance is strictly managed by HR personnel only. Employees do not have direct access to modify or log into this portal."
              highlights={[
                'Biometric and branch clock-in reconciliation',
                'Overtime and late arrival management',
                'Shift scheduling and roster adjustments',
                'Monthly attendance register sign-off',
              ]}
            />
          }
        />
        <Route
          path="/hr/leave"
          element={
            <ModulePlaceholderPage
              title="Leave Management"
              moduleId="hr"
              description="Centralized leave request reviews, approvals, and annual quotas."
              notice="Leave allocations and approvals are managed exclusively by HR administrators. Employees submit leave via HR representatives."
              highlights={[
                'Leave request authorization and status updates',
                'Paid, sick, and casual leave balance registers',
                'Company holiday calendar and blackout dates',
                'Leave encashment and carry-forward calculation',
              ]}
            />
          }
        />
        <Route
          path="/hr/payroll"
          element={
            <ModulePlaceholderPage
              title="Payroll Processing"
              moduleId="hr"
              description="Salary structures, deductions, allowances, and payslip generation."
              highlights={[
                'Monthly salary calculation and disbarment',
                'Tax, pension, and insurance deductions',
                'Overtime, incentives, and bonus payouts',
                'Direct bank transfer batch generation',
              ]}
            />
          }
        />
        <Route
          path="/hr/recruitment"
          element={
            <ModulePlaceholderPage
              title="Recruitment & Hiring"
              moduleId="hr"
              description="Job listings, applicant tracking, and interview pipelines."
              highlights={[
                'Job vacancy postings and requisitions',
                'Applicant resume screening and pipeline stages',
                'Interview scheduling and evaluation scorecards',
                'Offer letter generation and onboarding',
              ]}
            />
          }
        />
        <Route
          path="/hr/performance"
          element={
            <ModulePlaceholderPage
              title="Performance Appraisals"
              moduleId="hr"
              description="Periodic performance reviews, OKRs, and employee appraisals."
              highlights={[
                'Quarterly and annual appraisal cycles',
                'Skill matrices and goal tracking',
                'Manager feedback and peer reviews',
                'Promotion and merit raise recommendations',
              ]}
            />
          }
        />
        <Route
          path="/hr/reports"
          element={
            <ModulePlaceholderPage
              title="HR Analytics & Reports"
              moduleId="hr"
              description="Comprehensive workforce metrics, turnover rates, and attendance statistics."
              highlights={[
                'Headcount distribution and growth trends',
                'Staff turnover and retention analytics',
                'Leave utilization summaries',
                'Overtime expenditure insights',
              ]}
            />
          }
        />

        {/* FINANCE MANAGEMENT */}
        <Route path="/finance/dashboard" element={<FinanceDashboard />} />
        <Route
          path="/finance/accounts"
          element={
            <ModulePlaceholderPage
              title="Chart of Accounts"
              moduleId="finance"
              description="Financial account structure, bank registers, and cash ledgers."
              highlights={[
                'Standard Chart of Accounts (Assets, Liabilities, Equity, Revenue, Expense)',
                'Bank account connections & reconciliation',
                'Petty cash fund registers',
                'Fiscal year and accounting period controls',
              ]}
            />
          }
        />
        <Route
          path="/finance/ledger"
          element={
            <ModulePlaceholderPage
              title="General Ledger"
              moduleId="finance"
              description="Double-entry journal transactions, debit/credit postings, and trial balances."
              highlights={[
                'Manual journal entries with attachment support',
                'Real-time trial balance verification',
                'Transaction audit logs and change tracking',
                'Year-end closing entries',
              ]}
            />
          }
        />
        <Route
          path="/finance/invoices"
          element={
            <ModulePlaceholderPage
              title="Invoice Management"
              moduleId="finance"
              description="Customer invoicing, billing schedules, and overdue collections."
              highlights={[
                'Invoice generation and customizable PDF receipts',
                'B2B customer recurring billing schedules',
                'Automated payment reminders and tracking',
                'Sales tax and VAT breakdown',
              ]}
            />
          }
        />
        <Route
          path="/finance/payments"
          element={
            <ModulePlaceholderPage
              title="Payments & Disbursements"
              moduleId="finance"
              description="Outbound supplier payments, vendor settlements, and transaction histories."
              highlights={[
                'Supplier bill payment scheduling',
                'Electronic fund transfers and batch cheque logs',
                'Partial payment allocations',
                'Payment gateway settlement reconciliation',
              ]}
            />
          }
        />
        <Route
          path="/finance/expenses"
          element={
            <ModulePlaceholderPage
              title="Expense Tracking"
              moduleId="finance"
              description="Operational expenditures, utility bills, maintenance, and supply costs."
              highlights={[
                'Categorized expense entry and receipt uploads',
                'Departmental budget allocation vs actuals',
                'Recurring bill management (Rent, Utilities)',
                'Vendor expense summary and trend analysis',
              ]}
            />
          }
        />
        <Route
          path="/finance/income"
          element={
            <ModulePlaceholderPage
              title="Income & Revenue"
              moduleId="finance"
              description="Daily revenue streams from store branches, catering, and wholesale clients."
              highlights={[
                'Branch daily cash & card POS revenue',
                'Wholesale bread & pastry revenue feeds',
                'Event catering contract income',
                'Revenue forecasting and trend analysis',
              ]}
            />
          }
        />
        <Route
          path="/finance/reports"
          element={
            <ModulePlaceholderPage
              title="Financial Statements & Reports"
              moduleId="finance"
              description="Profit & Loss statements, Balance Sheets, and Cash Flow analytics."
              highlights={[
                'Income Statement (Profit & Loss / P&L)',
                'Balance Sheet & Net Asset value',
                'Cash Flow statement (Direct & Indirect)',
                'Audit export for tax filings',
              ]}
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
