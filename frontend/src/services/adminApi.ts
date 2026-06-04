const API_URL = import.meta.env.VITE_API_URL || "/api";

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
  waitlistCount: number;
  assessmentCount: number;
  journalCount: number;
  todaySignups: number;
  totalSeedsDistributed: number;
}

export interface WaitlistEntry {
  id: number;
  email: string;
  city?: string;
  concern?: string;
  createdAt: string;
}

export interface UserDetail {
  user: { id: number; name: string; email: string; createdAt: string };
  assessments: { id: number; type: string; score: number; band: string; createdAt: string }[];
  seeds: { total: number; lifetimeEarned: number } | null;
  journalCount: number;
  achievements: { id: number; slug: string; earnedAt: string }[];
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

export interface Analytics {
  userTotal: number;
  therapistTotal: number;
  activeSessions: number;
  userGrowth: { label: string; count: number }[];
  topSpecialties: { name: string; count: number }[];
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

  getAnalytics: () =>
    fetchApi<{ success: boolean; data: Analytics }>("/admin/analytics"),

  updateProfile: (data: { name?: string; email?: string }) =>
    fetchApi<{ success: boolean; data: Admin }>("/admin/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    fetchApi<{ success: boolean; message: string }>("/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getWaitlist: () =>
    fetchApi<{ success: boolean; data: WaitlistEntry[] }>("/admin/waitlist"),

  deleteWaitlistEntry: (id: number) =>
    fetchApi<{ success: boolean }>(`/admin/waitlist/${id}`, { method: "DELETE" }),

  getUserDetail: (id: number) =>
    fetchApi<{ success: boolean; data: UserDetail }>(`/admin/users/${id}/detail`),
};
