"use server";

import { fetchAPI } from "@/lib/api";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(payload: LoginPayload) {
  const { data, error } = await fetchAPI<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (error || !data) {
    return { error: error || "Login gagal" };
  }

  const cookieStore = await cookies();
  cookieStore.set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  });

  cookieStore.set(
    "user",
    JSON.stringify({
      id: data.user.id,
      full_name: data.user.full_name,
      email: data.user.email,
      role: data.user.role,
    }),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    },
  );

  redirect("/dashboard");
}

export async function registerAction(payload: RegisterPayload) {
  const { error } = await fetchAPI("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (error) {
    return { error };
  }

  redirect("/login");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("user");
  redirect("/login");
}
