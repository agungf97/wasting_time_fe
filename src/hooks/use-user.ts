"use client";

import { Users } from "@/lib/interface/user";
import { useEffect, useState } from "react";

const AUTH_CHANGED_EVENT = "auth-changed";

function getCookieValue(cookieMap: Map<string, string>, key: string): string {
  const value = cookieMap.get(key);
  if (!value) return "";

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function readUserCookie(): Users | null {
  if (typeof window === "undefined") return null;

  const cookieMap = new Map(
    document.cookie
      .split("; ")
      .filter(Boolean)
      .map((row) => {
        const separatorIndex = row.indexOf("=");
        if (separatorIndex === -1) return [row, ""] as const;

        const key = row.slice(0, separatorIndex);
        const value = row.slice(separatorIndex + 1);
        return [key, value] as const;
      }),
  );

  const fullName = getCookieValue(cookieMap, "name");
  const email = getCookieValue(cookieMap, "email");
  const phoneNumber = getCookieValue(cookieMap, "phone_number");
  const username = getCookieValue(cookieMap, "username");
  const role = getCookieValue(cookieMap, "role");

  const hasSessionData = Boolean(fullName || email || username || role);
  if (!hasSessionData) return null;

  return {
    id: 0,
    full_name: fullName,
    phone_number: phoneNumber,
    username: username || undefined,
    email,
    role,
    user_entry: "",
    date_time_entry: "",
    user_update: "",
    date_time_update: "",
  };
}

export function notifyAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function useUser() {
  const [user, setUser] = useState<Users | null>(null);

  useEffect(() => {
    const refresh = () => setUser(readUserCookie());

    // Keep first client render identical to server output to avoid hydration mismatch.
    refresh();

    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return user;
}