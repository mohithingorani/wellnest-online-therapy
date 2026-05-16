const API_URL = "http://mohit.systems:3000/api";

export interface Admin {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Stats {
  totalUsers: number;
  totalTherapists: number;
  activeSessions: number;
  pendingApprovals: number;
}

export interface Therapist {
  id: number;
  name: string;
  experience: number;
  specialities: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sessionCount: number;
  status: string;
}

export interface Activity {
  type: "user" | "therapist";
  id: number;
  name: string;
  email?: string;
  timestamp: string;
}

export interface Specialty {
  id: string;
  name: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }
  return res.json();
}

export const adminApi = {
  login: (email: string, password: string) =>
    fetchApi<{ success: boolean; data: Admin }>("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    fetchApi<{ success: boolean }>("/admin/logout", {
      method: "POST",
    }),

  me: () => fetchApi<{ success: boolean; data: Admin }>("/admin/me"),

  getStats: () => fetchApi<{ success: boolean; data: Stats }>("/admin/stats"),

  getTherapists: () =>
    fetchApi<{ success: boolean; data: Therapist[] }>("/admin/therapists"),

  updateTherapist: (id: number, data: { name?: string; experience?: number }) =>
    fetchApi<{ success: boolean; data: Therapist }>(`/admin/therapists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteTherapist: (id: number) =>
    fetchApi<{ success: boolean }>(`/admin/therapists/${id}`, {
      method: "DELETE",
    }),

  getUsers: () => fetchApi<{ success: boolean; data: User[] }>("/admin/users"),

  updateUser: (id: number, data: { name?: string; email?: string }) =>
    fetchApi<{ success: boolean; data: User }>(`/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteUser: (id: number) =>
    fetchApi<{ success: boolean }>(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  getActivity: () =>
    fetchApi<{ success: boolean; data: Activity[] }>("/admin/activity"),

  createUser: (data: { name: string; email: string; password: string }) =>
    fetchApi<{ success: boolean; data: User }>("/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  createTherapist: (data: {
    name: string;
    experience: number;
    specialtyIds?: string[];
  }) =>
    fetchApi<{ success: boolean; data: Therapist }>("/admin/therapists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getSpecialties: () =>
    fetchApi<{ success: boolean; data: Specialty[] }>("/admin/specialties"),
};
