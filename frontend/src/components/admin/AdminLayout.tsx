import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AdminLayout() {
  const { admin, loading } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#47898E] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 font-nunito">Loading...</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Navbar sidebarCollapsed={sidebarCollapsed} />
      <main
        className={`pt-20 pb-8 px-6 transition-all duration-300 ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[280px]"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}