import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import PageLoader from './components/ui/PageLoader'
import { useRouteLoader } from './hooks/useRouteLoader'
import { useScrollToTop } from './hooks/useScrollToTop'

const Home               = lazy(() => import('./pages/Home'))
const Services           = lazy(() => import('./pages/Services'))
const ServiceDetail      = lazy(() => import('./pages/ServiceDetail'))
const Destinations       = lazy(() => import('./pages/Destinations'))
const Tours              = lazy(() => import('./pages/Tours'))
const About              = lazy(() => import('./pages/About'))
const Contact            = lazy(() => import('./pages/Contact'))
const Login              = lazy(() => import('./pages/Login'))
const Signup             = lazy(() => import('./pages/Signup'))
const ForgotPassword     = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword      = lazy(() => import('./pages/ResetPassword'))
const AdminLogin         = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminEnquiries     = lazy(() => import('./pages/admin/AdminEnquiries'))
const AdminUsers         = lazy(() => import('./pages/admin/AdminUsers'))
const AdminSettings      = lazy(() => import('./pages/admin/AdminSettings'))
const Dashboard          = lazy(() => import('./pages/Dashboard'))
const DashboardInquiries = lazy(() => import('./pages/dashboard/DashboardInquiries'))
const DashboardBookings  = lazy(() => import('./pages/dashboard/DashboardBookings'))
const DashboardClients   = lazy(() => import('./pages/dashboard/DashboardClients'))
const DashboardTours     = lazy(() => import('./pages/dashboard/DashboardTours'))
const DashboardReports   = lazy(() => import('./pages/dashboard/DashboardReports'))
const DashboardSettings  = lazy(() => import('./pages/dashboard/DashboardSettings'))
const DashboardProfile   = lazy(() => import('./pages/dashboard/DashboardProfile'))
const PrivacyPolicy      = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService     = lazy(() => import('./pages/TermsOfService'))
const NotFound           = lazy(() => import('./pages/NotFound'))
const AuthCallback       = lazy(() => import('./pages/AuthCallback'))

function AppRoutes() {
  const loading = useRouteLoader()
  useScrollToTop()

  return (
    <Suspense fallback={<PageLoader />}>
      {loading && <PageLoader />}
      <Routes>
        {/* ── Public site — Navbar + Footer ── */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
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
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/adlog"           element={<AdminLogin />} />
        <Route path="/auth/callback"   element={<AuthCallback />} />

        {/* ── Admin — AdminLayout, protected by localStorage check ── */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard"  element={<AdminDashboard />} />
          <Route path="/admin/enquiries"  element={<AdminEnquiries />} />
          <Route path="/admin/users"      element={<AdminUsers />} />
          <Route path="/admin/settings"   element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
