import instance from "@/helper/axios";

export type ConversationType = "SUPPORT" | "DIRECT";
export type ConversationStatus = "OPEN" | "CLOSED";

export type Conversation = {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  subject: string;
  initiatorId: string;
  initiatorName: string;
  recipientId?: string | null;
  recipientName?: string | null;
  courseId?: number | null;
  courseTitle?: string | null;
  unreadCount: number;
  lastMessageAt?: string | null;
  createdAt: string;
};

export type ConversationMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  content: string;
  readAt?: string | null;
  createdAt: string;
};

export type Page<T> = {
  data: T[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function successful(response: any) {
  if (response?.status === false) {
    throw new Error(response.message || "Request failed");
  }
  return response;
}

function page<T>(response: any): Page<T> {
  successful(response);
  return {
    data: Array.isArray(response?.data) ? response.data : [],
    currentPage: Number(response?.currentPage ?? 0),
    size: Number(response?.size ?? 20),
    totalElements: Number(response?.totalElements ?? 0),
    totalPages: Number(response?.totalPages ?? 0),
  };
}

function entity<T>(response: any): T {
  successful(response);
  if (response?.data == null) throw new Error("The server returned no data");
  return response.data as T;
}

export async function getConversations(pageNumber = 0, size = 20) {
  return page<Conversation>(
    await instance.get("/conversations", {
      params: { page: pageNumber, size },
    }),
  );
}

export async function getConversation(id: string) {
  return entity<Conversation>(await instance.get(`/conversations/${id}`));
}

export async function getConversationMessages(
  id: string,
  pageNumber = 0,
  size = 30,
) {
  return page<ConversationMessage>(
    await instance.get(`/conversations/${id}/messages`, {
      params: { page: pageNumber, size },
    }),
  );
}

export async function startSupportConversation(input: {
  subject?: string;
  content: string;
}) {
  return entity<Conversation>(
    await instance.post("/conversations/support", input),
  );
}

export async function startDirectConversation(input: {
  recipientId: string;
  courseId?: number;
  subject?: string;
  content: string;
}) {
  return entity<Conversation>(
    await instance.post("/conversations/direct", input),
  );
}

export async function sendConversationMessage(id: string, content: string) {
  return entity<ConversationMessage>(
    await instance.post(`/conversations/${id}/messages`, { content }),
  );
}

export async function markConversationRead(id: string) {
  const response = successful(await instance.post(`/conversations/${id}/read`));
  return Number(response?.data ?? 0);
}

export async function updateConversationStatus(
  id: string,
  status: ConversationStatus,
) {
  return entity<Conversation>(
    await instance.patch(`/conversations/${id}/status`, undefined, {
      params: { status },
    }),
  );
}

export async function getAdminConversations(
  filters: {
    type?: ConversationType;
    status?: ConversationStatus;
    page?: number;
    limit?: number;
  } = {},
) {
  return page<Conversation>(
    await instance.get("/admin/conversations", {
      params: {
        type: filters.type,
        status: filters.status,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
      },
    }),
  );
}

export async function getAdminConversation(id: string) {
  return entity<Conversation>(await instance.get(`/admin/conversations/${id}`));
}

export async function getAdminConversationMessages(
  id: string,
  pageNumber = 1,
  limit = 30,
) {
  return page<ConversationMessage>(
    await instance.get(`/admin/conversations/${id}/messages`, {
      params: { page: pageNumber, limit },
    }),
  );
}

export async function deleteAdminConversation(id: string) {
  successful(await instance.delete(`/admin/conversations/${id}`));
}

export async function deleteAdminMessage(id: string) {
  successful(await instance.delete(`/admin/messages/${id}`));
}

export async function broadcastNotification(input: {
  title: string;
  body?: string;
  link?: string;
  role?: "STUDENT" | "INSTRUCTOR" | "ADMIN";
}) {
  const response = successful(
    await instance.post("/admin/notifications/broadcast", input),
  );
  return Number(response?.data?.recipients ?? 0);
}
