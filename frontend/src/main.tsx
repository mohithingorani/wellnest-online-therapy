import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./pages/App.tsx";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Signin from "./pages/Signin.tsx";
import SignUp from "./pages/SignUp.tsx";
import AboutPage from "./pages/About.tsx";
import TherapistsPage from "./pages/Therapists.tsx";
import TherapistPage2 from "./Therapist.tsx";
import { ToastProvider } from "./components/admin/Toast";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import TherapistManagement from "./pages/admin/TherapistManagement";
import UserManagement from "./pages/admin/UserManagement";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import AdminLogin from "./pages/admin/Login";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <Routes>
        <Route index element={<App />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/therapists" element={<TherapistsPage />} />
        <Route path="/therapists/:id" element={<TherapistPage2/>}/>
        
        <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
        <Route path="/admin" element={<AdminAuthProvider><AdminLayout /></AdminAuthProvider>}>
          <Route index element={<AdminDashboard />} />
          <Route path="therapists" element={<TherapistManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </ToastProvider>
  </BrowserRouter>,
);
