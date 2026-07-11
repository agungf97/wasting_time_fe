"use client";

import { Users } from "@/lib/interface/user";
import { useState } from "react";

function readUserCookie(): Users | null {
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
  const [user] = useState<Users | null>(readUserCookie);
  return user;
}
