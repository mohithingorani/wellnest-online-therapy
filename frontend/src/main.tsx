import { createRoot } from "react-dom/client";
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import { ToastProvider } from "./components/admin/Toast";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";

import Layout from "./components/Layout";
import LoadingPage from "./components/Loading";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Only add delay to landing page
const LandingPage = lazy(async () => {
  await delay(2000);
  return import("./pages/App");
});

// All other pages - no delay
const AboutPage = lazy(() => import("./pages/About"));
const Signin = lazy(() => import("./pages/Signin"));
const SignUp = lazy(() => import("./pages/SignUp"));
const TherapistsPage = lazy(() => import("./pages/Therapists"));
const TherapistPage = lazy(() => import("./Therapist"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin - no delay
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const TherapistManagement = lazy(() => import("./pages/admin/TherapistManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Settings = lazy(() => import("./pages/admin/Settings"));

function SuspenseFallback() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return show ? <LoadingPage /> : null;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="therapists" element={<TherapistsPage />} />
            <Route path="therapists/:id" element={<TherapistPage />} />
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
      </Suspense>
    </ToastProvider>
  </BrowserRouter>
);