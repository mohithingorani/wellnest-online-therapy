import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { authService, setAuthUser, getAuthUser, clearAuthUser } from "../services/auth";

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getAuthUser());
  const [loading, setLoading] = useState(!!getAuthUser());

  useEffect(() => {
    const stored = getAuthUser();
    if (stored) {
      authService.me()
        .then((res) => {
          if (res.success && res.data) {
            setAuthUser(res.data);
            setUser(res.data);
          } else {
            clearAuthUser();
            setUser(null);
          }
        })
        .catch(() => {
          clearAuthUser();
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      setAuthUser(res.data);
      setUser(res.data);
    } else {
      throw new Error(res.message || "Login failed");
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.signup({ name, email, password });
    if (res.success && res.data) {
      setAuthUser(res.data);
      setUser(res.data);
    } else {
      throw new Error(res.message || "Signup failed");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    clearAuthUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
