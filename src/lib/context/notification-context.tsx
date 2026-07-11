"use client";

import {
  createContext, useCallback, useContext,
  useEffect, useState,
} from "react";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  url: string;
  timestamp: number;
  read: boolean;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);
const STORAGE_KEY = "wts_notifications";
const MAX_ITEMS = 50;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((items: NotificationItem[]) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "PUSH_RECEIVED") return;
      const notif = event.data.notification as NotificationItem;
      setNotifications((prev) => {
        const updated = [notif, ...prev].slice(0, MAX_ITEMS);
        persist(updated);
        return updated;
      });
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, [persist]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persist(updated);
      return updated;
    });
  }, [persist]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      persist(updated);
      return updated;
    });
  }, [persist]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    persist([]);
  }, [persist]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount,
      markAsRead, markAllAsRead, clearAll, removeNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}