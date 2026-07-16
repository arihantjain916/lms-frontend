"use client";

import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/hooks/use-authenticated";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "@/lib/notification-api";
import type { ConversationMessage } from "@/lib/conversation-api";

type ConnectionState = "disconnected" | "connecting" | "connected";

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  connectionState: ConnectionState;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  latestMessage: ConversationMessage | null;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [latestMessage, setLatestMessage] =
    useState<ConversationMessage | null>(null);
  const knownIds = useRef(new Set<string>());

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const [page, count] = await Promise.all([
        getNotifications({ page: 0, size: 20 }),
        getUnreadNotificationCount(),
      ]);
      knownIds.current = new Set(
        page.data.map((notification) => notification.id),
      );
      setNotifications(page.data);
      setUnreadCount(count);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load notifications",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      knownIds.current.clear();
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      setLatestMessage(null);
      return;
    }
    void refresh();
  }, [authLoading, isAuthenticated, refresh, user?.id]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !user?.id) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
    const token = window.localStorage.getItem("token");
    if (!backendUrl || !token) {
      setError(
        !backendUrl
          ? "NEXT_PUBLIC_BACKEND_URL is not configured"
          : "Authentication token is missing",
      );
      return;
    }

    setConnectionState("connecting");
    const client = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/api/ws`),
      reconnectDelay: 5_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      debug: process.env.NODE_ENV === "development" ? console.debug : () => {},
    });

    client.beforeConnect = () => {
      const currentToken = window.localStorage.getItem("token");
      client.connectHeaders = currentToken
        ? { Authorization: `Bearer ${currentToken}` }
        : {};
      setConnectionState("connecting");
    };

    client.onConnect = () => {
      setConnectionState("connected");
      setError(null);
      client.subscribe("/user/queue/notifications", (message: IMessage) => {
        try {
          const notification = JSON.parse(message.body) as Notification;
          if (!notification?.id || knownIds.current.has(notification.id))
            return;

          knownIds.current.add(notification.id);
          setNotifications((current) =>
            [notification, ...current].slice(0, 20),
          );
          if (!notification.isRead) setUnreadCount((current) => current + 1);
        } catch {
          setError("Received an invalid notification from the server");
        }
      });
      client.subscribe("/user/queue/messages", (message: IMessage) => {
        try {
          const incoming = JSON.parse(message.body) as ConversationMessage;
          if (incoming?.id && incoming?.conversationId)
            setLatestMessage(incoming);
        } catch {
          setError("Received an invalid message from the server");
        }
      });
    };

    client.onStompError = (frame) => {
      setConnectionState("disconnected");
      setError(frame.headers.message || "Notification socket error");
    };
    client.onWebSocketClose = () => setConnectionState("disconnected");
    client.onWebSocketError = () =>
      setError("Unable to connect to real-time notifications");

    client.activate();
    return () => {
      void client.deactivate();
      setConnectionState("disconnected");
    };
  }, [authLoading, isAuthenticated, user?.id]);

  const markRead = useCallback(
    async (id: string) => {
      const existing = notifications.find(
        (notification) => notification.id === id,
      );
      if (!existing || existing.isRead) return;

      const updated = await markNotificationRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? updated : notification,
        ),
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    },
    [notifications],
  );

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
    setUnreadCount(0);
  }, []);

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      connectionState,
      refresh,
      markRead,
      markAllRead,
      latestMessage,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      connectionState,
      refresh,
      markRead,
      markAllRead,
      latestMessage,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider",
    );
  }
  return context;
}
