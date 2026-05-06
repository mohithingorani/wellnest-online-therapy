import { useAdminAuth } from "../../contexts/AdminAuthContext";

interface NavbarProps {
  sidebarCollapsed: boolean;
}

export function Navbar({ sidebarCollapsed }: NavbarProps) {
  const { admin } = useAdminAuth();

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-[#0a0a0a] border-b border-[#1f1f1f] flex items-center justify-between px-6 z-30 transition-all duration-300 ${
        sidebarCollapsed ? "left-[72px]" : "left-[280px]"
      }`}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white font-nunito">
          Welcome back, {admin?.name || "Admin"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-[#1f1f1f]">
          <div className="w-9 h-9 bg-[#47898E] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm font-nunito">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-white font-nunito">{admin?.name}</div>
            <div className="text-xs text-gray-500 font-nunito capitalize">{admin?.role?.replace("_", " ")}</div>
          </div>
        </div>
      </div>
    </header>
  );
}