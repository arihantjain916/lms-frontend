"use client";

import {
  createContext,
  createElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import instance from "@/helper/axios";
import { usePathname, useRouter } from "next/navigation";

export const AUTH_STATE_EVENT = "eduportal:auth-state-changed";

export type AuthUser = {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  createdAt?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function notifyAuthStateChanged() {
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await instance.get("/auth/me");
      if (response?.status && response?.data) setUser(response.data);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await instance.post("/auth/logout");
    } finally {
      window.localStorage.removeItem("token");
      setUser(null);
      notifyAuthStateChanged();
    }
  }, []);

  useEffect(() => {
    refreshUser();
    const handleAuthChange = () => refreshUser();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener(AUTH_STATE_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener(AUTH_STATE_EVENT, handleAuthChange);
    };
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      refreshUser,
      logout,
    }),
    [user, loading, refreshUser, logout],
  );
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export function useAuthenticated() {
  return useAuth().isAuthenticated;
}

export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated)
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [auth.loading, auth.isAuthenticated, pathname, router]);
  return auth;
}
