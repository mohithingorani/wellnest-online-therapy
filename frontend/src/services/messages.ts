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

export interface TherapistBrief {
  id: number;
  name: string;
  title: string;
}

export interface Message {
  id: number;
  content: string;
  conversationId: number;
  senderType: "user" | "therapist";
  senderId: number;
  createdAt: string;
}

export interface ConversationListItem {
  id: number;
  userId: number;
  therapistId: number;
  therapist: TherapistBrief;
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesPage {
  messages: Message[];
  nextCursor: number | null;
  hasMore: boolean;
}

export const messagesService = {
  async listConversations(): Promise<ApiResponse<ConversationListItem[]>> {
    return fetchApi<ApiResponse<ConversationListItem[]>>("/messages/conversations");
  },

  async getMessages(
    conversationId: number,
    cursor?: number,
  ): Promise<ApiResponse<MessagesPage>> {
    const params = cursor ? `?cursor=${cursor}` : "";
    return fetchApi<ApiResponse<MessagesPage>>(
      `/messages/conversations/${conversationId}/messages${params}`,
    );
  },

  async sendMessage(
    conversationId: number,
    content: string,
  ): Promise<ApiResponse<Message>> {
    return fetchApi<ApiResponse<Message>>(
      `/messages/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ content }),
      },
    );
  },

  async createConversation(
    therapistId: number,
  ): Promise<ApiResponse<ConversationListItem>> {
    return fetchApi<ApiResponse<ConversationListItem>>(
      "/messages/conversations",
      {
        method: "POST",
        body: JSON.stringify({ therapistId }),
      },
    );
  },
};
