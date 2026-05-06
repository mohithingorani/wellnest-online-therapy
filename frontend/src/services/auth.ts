const API_BASE = "http://localhost:3000/api";

interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  data?: User;
  message?: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Make sure backend is running on port 3000.");
    }
    throw error;
  }
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async signup(data: SignupData): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/users/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginData): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async logout(): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/users/logout", {
      method: "POST",
    });
  },

  async me(): Promise<AuthResponse> {
    return fetchApi<AuthResponse>("/users/me");
  },
};

export function setAuthUser(user: User | null) {
  localStorage.setItem("wellnest_user", JSON.stringify(user));
}

export function getAuthUser(): User | null {
  const user = localStorage.getItem("wellnest_user");
  return user ? JSON.parse(user) : null;
}

export function clearAuthUser() {
  localStorage.removeItem("wellnest_user");
}