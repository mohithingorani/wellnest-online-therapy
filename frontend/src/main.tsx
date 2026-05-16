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

const lazyWithDelay = (
  importFn: () => Promise<any>,
  delayMs = 3600000
) =>
  lazy(async () => {
    await delay(delayMs);
    return importFn();
  });

// Lazy pages with artificial delay
const HomePage = lazyWithDelay(() => import("./pages/App"));
const AboutPage = lazyWithDelay(() => import("./pages/About"));
const Signin = lazyWithDelay(() => import("./pages/Signin"));
const SignUp = lazyWithDelay(() => import("./pages/SignUp"));
const TherapistsPage = lazyWithDelay(() => import("./pages/Therapists"));
const TherapistPage = lazyWithDelay(() => import("./Therapist"));
const NotFound = lazyWithDelay(() => import("./pages/NotFound"));

// Admin
const AdminLogin = lazyWithDelay(() => import("./pages/admin/Login"));
const AdminDashboard = lazyWithDelay(() => import("./pages/admin/Dashboard"));
const TherapistManagement = lazyWithDelay(() => import("./pages/admin/TherapistManagement"));
const UserManagement = lazyWithDelay(() => import("./pages/admin/UserManagement"));
const Analytics = lazyWithDelay(() => import("./pages/admin/Analytics"));
const Settings = lazyWithDelay(() => import("./pages/admin/Settings"));

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
            <Route index element={<HomePage />} />
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