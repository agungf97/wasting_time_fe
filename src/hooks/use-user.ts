"use client";

import { useState } from "react";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

function readUserCookie(): User | null {
  if (typeof window === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user="));

  if (!match) return null;

  try {
    const decoded = decodeURIComponent(match.split("=")[1]);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function useUser() {
  const [user] = useState<User | null>(readUserCookie);
  return user;
}
