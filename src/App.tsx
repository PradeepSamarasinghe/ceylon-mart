import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingsStore'
import { Loader2 } from 'lucide-react'

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { OnboardingPage } from '@/pages/auth/OnboardingPage'
import { LandingPage } from '@/pages/LandingPage'

// Dashboard Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { POSPage } from '@/pages/pos/POSPage'

// Inventory
import { ProductsPage } from '@/pages/inventory/ProductsPage'
import { StockPage } from '@/pages/inventory/StockPage'
import { TransfersPage } from '@/pages/inventory/TransfersPage'

// Commerce
import { SalesPage } from '@/pages/sales/SalesPage'
import { PurchasesPage } from '@/pages/purchases/PurchasesPage'
import { CustomersPage } from '@/pages/customers/CustomersPage'
import { SuppliersPage } from '@/pages/suppliers/SuppliersPage'

// Accounting
import { AccountingPage } from '@/pages/accounting/AccountingPage'
import { LedgerPage } from '@/pages/accounting/LedgerPage'
import { ReconciliationPage } from '@/pages/accounting/ReconciliationPage'

// HR
import { EmployeesPage } from '@/pages/hr/EmployeesPage'
import { PayrollPage } from '@/pages/hr/PayrollPage'
import { AdvancesPage } from '@/pages/hr/AdvancesPage'

// Reports
import { ReportsHubPage } from '@/pages/reports/ReportsHubPage'
import { VATReportPage } from '@/pages/reports/VATReportPage'
import { SVATReportPage } from '@/pages/reports/SVATReportPage'
import { WHTReportPage } from '@/pages/reports/WHTReportPage'
import { EPFETFReportPage } from '@/pages/reports/EPFETFReportPage'
import { SalesAnalyticsPage } from '@/pages/reports/SalesAnalyticsPage'

// System
import { BranchesPage } from '@/pages/branches/BranchesPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'

function App() {
  const { initializeAuth, isAuthenticated, isLoading, user } = useAuthStore()
  const { darkMode } = useSettingsStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Sync Global Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove('light-mode')
    } else {
      document.documentElement.classList.add('light-mode')
    }
  }, [darkMode])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0c0c0c] font-sans">
        <Loader2 className="animate-spin text-[#22c55e]" size={32} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" replace />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/auth/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/auth/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/auth/login" />} />
        </Route>

        {/* Dashboard Routes */}
        <Route 
          element={
            isAuthenticated ? (
              user?.organization_id ? (
                <DashboardLayout />
              ) : (
                <Navigate to="/auth/onboarding" />
              )
            ) : (
              <Navigate to="/auth/login" />
            )
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pos" element={<POSPage />} />

          {/* Inventory */}
          <Route path="/inventory" element={<StockPage />} />
          <Route path="/inventory/products" element={<ProductsPage />} />
          <Route path="/inventory/transfers" element={<TransfersPage />} />

          {/* Commerce */}
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />

          {/* Accounting */}
          <Route path="/accounting" element={<AccountingPage />} />
          <Route path="/accounting/ledger" element={<LedgerPage />} />
          <Route path="/accounting/reconciliation" element={<ReconciliationPage />} />

          {/* HR */}
          <Route path="/hr/employees" element={<EmployeesPage />} />
          <Route path="/hr/payroll" element={<PayrollPage />} />
          <Route path="/hr/advances" element={<AdvancesPage />} />

          {/* Reports */}
          <Route path="/reports" element={<ReportsHubPage />} />
          <Route path="/reports/vat" element={<VATReportPage />} />
          <Route path="/reports/svat" element={<SVATReportPage />} />
          <Route path="/reports/wht" element={<WHTReportPage />} />
          <Route path="/reports/epf-etf" element={<EPFETFReportPage />} />
          <Route path="/reports/sales-analytics" element={<SalesAnalyticsPage />} />

          {/* System */}
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
