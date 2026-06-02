const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
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
}

export interface JournalEntry {
  id: number;
  userId: number;
  title: string;
  content: string;
  mood: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalListResponse {
  entries: JournalEntry[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface CreateJournalData {
  title: string;
  content: string;
  mood?: number;
}

export interface UpdateJournalData {
  title?: string;
  content?: string;
  mood?: number | null;
}

export const journalService = {
  async list(cursor?: number): Promise<ApiResponse<JournalListResponse>> {
    const params = cursor ? `?cursor=${cursor}` : "";
    return fetchApi<ApiResponse<JournalListResponse>>(`/journal${params}`);
  },

  async get(id: number): Promise<ApiResponse<JournalEntry>> {
    return fetchApi<ApiResponse<JournalEntry>>(`/journal/${id}`);
  },

  async create(data: CreateJournalData): Promise<ApiResponse<JournalEntry>> {
    return fetchApi<ApiResponse<JournalEntry>>("/journal", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: number, data: UpdateJournalData): Promise<ApiResponse<JournalEntry>> {
    return fetchApi<ApiResponse<JournalEntry>>(`/journal/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return fetchApi<ApiResponse<void>>(`/journal/${id}`, {
      method: "DELETE",
    });
  },

  async getStreak(): Promise<ApiResponse<{ streak: number }>> {
    return fetchApi<ApiResponse<{ streak: number }>>("/journal/streak");
  },
};
