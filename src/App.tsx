import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Services from './pages/Services'
import Destinations from './pages/Destinations'
import Tours from './pages/Tours'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import DashboardInquiries from './pages/dashboard/DashboardInquiries'
import DashboardBookings from './pages/dashboard/DashboardBookings'
import DashboardClients from './pages/dashboard/DashboardClients'
import DashboardTours from './pages/dashboard/DashboardTours'
import DashboardReports from './pages/dashboard/DashboardReports'
import DashboardSettings from './pages/dashboard/DashboardSettings'
import DashboardProfile from './pages/dashboard/DashboardProfile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import { ProtectedRoute } from './routes/ProtectedRoute'
import PageLoader from './components/ui/PageLoader'
import { useRouteLoader } from './hooks/useRouteLoader'
import { useScrollToTop } from './hooks/useScrollToTop'

function AppRoutes() {
  const loading = useRouteLoader()
  useScrollToTop()

  return (
    <>
      {loading && <PageLoader />}
      <Routes>
        {/* ── Public site — Navbar + Footer ── */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>

        {/* ── Dashboard — DashboardLayout, protected ── */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard"             element={<Dashboard />} />
          <Route path="/dashboard/inquiries"   element={<DashboardInquiries />} />
          <Route path="/dashboard/bookings"    element={<DashboardBookings />} />
          <Route path="/dashboard/clients"     element={<DashboardClients />} />
          <Route path="/dashboard/tours"       element={<DashboardTours />} />
          <Route path="/dashboard/reports"     element={<DashboardReports />} />
          <Route path="/dashboard/settings"    element={<DashboardSettings />} />
          <Route path="/dashboard/profile"     element={<DashboardProfile />} />
        </Route>

        {/* ── Auth — standalone ── */}
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
