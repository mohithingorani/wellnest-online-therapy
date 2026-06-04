import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./index.css";

import { ToastProvider } from "./components/admin/Toast";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";

import Layout from "./components/Layout";
const LandingPage = lazy(() => import("./pages/App"));
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
const AboutPage = lazy(() => import("./pages/About"));
const Join = lazy(() => import("./pages/Join"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const TermsPage = lazy(() => import("./pages/Terms"));
const ContactPage = lazy(() => import("./pages/Contact"));

const TherapistsPage = lazy(() => import("./pages/Therapists"));
const TherapistPage = lazy(() => import("./Therapist"));
const Booking = lazy(() => import("./pages/Booking"));
const Checkout = lazy(() => import("./pages/Checkout"));
const BookingConfirm = lazy(() => import("./pages/BookingConfirm"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const JournalPage = lazy(() => import("./pages/Journal"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const MessagesPage = lazy(() => import("./pages/Messages"));
const Breathe = lazy(() => import("./pages/Breathe"));
const AssessHub = lazy(() => import("./pages/Assess"));
const AssessFlow = lazy(() => import("./pages/AssessmentFlow"));
const AssessResult = lazy(() => import("./pages/AssessmentResult"));
const Invite = lazy(() => import("./pages/Invite"));
const ResourcesPage = lazy(() => import("./pages/Resources"));
const ResourceArticle = lazy(() => import("./pages/ResourceArticle"));
const Rewards = lazy(() => import("./pages/Rewards"));
const DashboardShell = lazy(() => import("./components/DashboardShell"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin - no delay
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const TherapistManagement = lazy(() => import("./pages/admin/TherapistManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AdminWaitlist = lazy(() => import("./pages/admin/Waitlist"));

/* Minimal fallback — matches page bg, no layout shift */
function PageLoader() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin" />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <ToastProvider>
      <Suspense fallback={<PageLoader />}>
        <AuthProvider>
        <Routes>
          {/* Auth pages — no nav/footer */}
          <Route path="join" element={<Join />} />
          <Route path="signin" element={<Join />} />
          <Route path="signup" element={<Join />} />
          <Route path="reset-password" element={<ResetPassword />} />

          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="therapists" element={<TherapistsPage />} />
            <Route path="therapists/:id" element={<TherapistPage />} />
            {/* Public assessments — anyone can take without logging in */}
            <Route path="assess" element={<AssessHub />} />
            <Route path="assess/:type" element={<AssessFlow />} />
            <Route path="assess/:type/result" element={<AssessResult />} />
            {/* Short shareable URLs → assessment redirects */}
            <Route path="burnout-test" element={<Navigate to="/assess/burnout" replace />} />
            <Route path="anxiety-test" element={<Navigate to="/assess/gad7" replace />} />
            <Route path="stress-test" element={<Navigate to="/assess/stress" replace />} />
            <Route path="mood-check" element={<Navigate to="/assess/mood" replace />} />

            {/* Authenticated, marketing-chrome transactional routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="therapists/:id/book" element={<Booking />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="booking/:id/confirmed" element={<BookingConfirm />} />
            </Route>

            {/* Dashboard inside Layout so NavBar is visible */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/journal" element={<JournalPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/breathe" element={<Breathe />} />
                <Route path="/assess" element={<AssessHub />} />
                <Route path="/assess/:type" element={<AssessFlow />} />
                <Route path="/assess/:type/result" element={<AssessResult />} />
                <Route path="/invite" element={<Invite />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/resources/:slug" element={<ResourceArticle />} />
                <Route path="/rewards" element={<Rewards />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminAuthProvider>
                <AdminLayout />
              </AdminAuthProvider>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="therapists"
              element={<TherapistManagement />}
            />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="waitlist" element={<AdminWaitlist />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </Suspense>
    </ToastProvider>
  </BrowserRouter>
);