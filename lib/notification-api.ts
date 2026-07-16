import instance from "@/helper/axios";

export type NotificationType =
  | "NEW_MESSAGE"
  | "ENROLLMENT"
  | "EXAM_GRADED"
  | "COURSE_QUESTION"
  | "WEBINAR"
  | "ANNOUNCEMENT"
  | "SYSTEM";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
  referenceId?: string | null;
  isRead: boolean;
  createdAt: string;
};

export type NotificationPage = {
  data: Notification[];
  currentPage: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function assertSuccessful(response: any) {
  if (response?.status === false) {
    throw new Error(response.message || "Notification request failed");
  }
  return response;
}

export async function getNotifications(
  params: { unreadOnly?: boolean; page?: number; size?: number } = {},
): Promise<NotificationPage> {
  const response = assertSuccessful(
    await instance.get("/notifications", {
      params: {
        unreadOnly: params.unreadOnly ?? false,
        page: params.page ?? 0,
        size: params.size ?? 20,
      },
    }),
  );

  return {
    data: Array.isArray(response?.data) ? response.data : [],
    currentPage: Number(response?.currentPage ?? 0),
    size: Number(response?.size ?? 20),
    totalElements: Number(response?.totalElements ?? 0),
    totalPages: Number(response?.totalPages ?? 0),
  };
}

export async function getUnreadNotificationCount(): Promise<number> {
  const response = assertSuccessful(
    await instance.get("/notifications/unread-count"),
  );
  return Number(response?.data ?? 0);
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const response = assertSuccessful(
    await instance.post(`/notifications/${id}/read`),
  );
  return response.data as Notification;
}

export async function markAllNotificationsRead(): Promise<number> {
  const response = assertSuccessful(
    await instance.post("/notifications/read-all"),
  );
  return Number(response?.data ?? 0);
}
