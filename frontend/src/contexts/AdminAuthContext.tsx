import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { adminApi } from "../services/adminApi";
import type { Admin } from "../services/adminApi";

interface AdminAuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAdmin: (admin: Admin) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.me()
      .then((res) => {
        if (res.success) {
          setAdmin(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await adminApi.login(email, password);
    if (res.success) {
      setAdmin(res.data);
    } else {
      throw new Error("Login failed");
    }
  }, []);

  const logout = useCallback(async () => {
    await adminApi.logout();
    setAdmin(null);
  }, []);

  const updateAdmin = useCallback((next: Admin) => {
    setAdmin(next);
  }, []);

  const value = useMemo(
    () => ({ admin, loading, login, logout, updateAdmin }),
    [admin, loading, login, logout, updateAdmin]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}