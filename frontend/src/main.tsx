import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import { ToastProvider } from "./components/admin/Toast";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";

import Layout from "./components/Layout";
import LandingPage from "./pages/App";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
const AboutPage = lazy(() => import("./pages/About"));
const Join = lazy(() => import("./pages/Join"));

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
const DashboardShell = lazy(() => import("./components/DashboardShell"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin - no delay
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const TherapistManagement = lazy(() => import("./pages/admin/TherapistManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Settings = lazy(() => import("./pages/admin/Settings"));

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <ToastProvider>
      <Suspense fallback={null}>
        <AuthProvider>
        <Routes>
          {/* Auth pages — no nav/footer */}
          <Route path="join" element={<Join />} />
          <Route path="signin" element={<Join />} />
          <Route path="signup" element={<Join />} />

          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="therapists" element={<TherapistsPage />} />
            <Route path="therapists/:id" element={<TherapistPage />} />

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
              </Route>
            </Route>
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

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
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </Suspense>
    </ToastProvider>
  </BrowserRouter>
);