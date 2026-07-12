"use server";

import { fetchAPI } from "@/lib/api";
import {
  ChangePasswordPayload,
  ChangePasswordResult,
  LoginResponse,
  SessionsResponse,
} from "@/lib/interface/auth";
import { RegisterPayload } from "@/lib/interface/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerAction(payload: RegisterPayload) {
  const { error } = await fetchAPI("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (error) {
    return { error };
  }

  const email = encodeURIComponent(payload.email ?? "");
  redirect(`/verify-email?email=${email}`);
}

export async function loginAction(
  identifier: string,
  password: string,
  rememberMe: boolean = false,
) {
  const { data, error } = await fetchAPI<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password, remember_me: rememberMe }),
  });

  const token = data?.data?.token;
  const expiresAt = data?.data?.expires_at;
  const role = data?.data?.user?.role;
  const name = data?.data?.user?.full_name;
  const phone_number = data?.data?.user?.phone_number;
  const email = data?.data?.user?.email;
  const username = data?.data?.user?.username;

  if (error || !token) {
    return { error: error || data?.message || "Login gagal" };
  }

  const expires = expiresAt ? new Date(expiresAt * 1000) : undefined;

  const baseCookieOptions = {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires,
  };

  const cookieStore = await cookies();
  cookieStore.set("token", token, { ...baseCookieOptions, httpOnly: true });
  cookieStore.set("role", role ?? "", { ...baseCookieOptions, httpOnly: false });
  cookieStore.set("name", name ?? "", { ...baseCookieOptions, httpOnly: false });
  cookieStore.set("email", email ?? "", { ...baseCookieOptions, httpOnly: false });
  cookieStore.set("username", username ?? "", { ...baseCookieOptions, httpOnly: false });
  cookieStore.set("phone_number", phone_number ?? "", { ...baseCookieOptions, httpOnly: false });

  redirect("/");
}

const SESSION_COOKIE_NAMES = [
  "token",
  "role",
  "name",
  "email",
  "username",
  "phone_number",
  "user",
];

export async function logoutAction(allDevices: boolean = false) {
  const { error } = await fetchAPI<{ success: boolean; message: string }>(
    `/auth/logout?all_devices=${allDevices}`,
    { method: "POST", withAuth: true },
  );

  if (error) {
    console.error("Gagal mencabut sesi di server saat logout:", error);
  }

  const cookieStore = await cookies();
  SESSION_COOKIE_NAMES.forEach((name) => cookieStore.delete(name));
  redirect("/");
}

export async function changePasswordAction(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResult> {
  const { error } = await fetchAPI<{ success: boolean; message: string }>(
    "/auth/change-password",
    { method: "POST", withAuth: true, body: JSON.stringify(payload) },
  );

  if (error) {
    return { success: false, message: error };
  }

  const cookieStore = await cookies();
  SESSION_COOKIE_NAMES.forEach((name) => cookieStore.delete(name));

  return { success: true, message: "Password berhasil diubah, silakan login kembali." };
}

export async function forgotPasswordAction(email: string) {
  const { data, error } = await fetchAPI<{ success: boolean; message: string }>(
    "/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );

  if (error) {
    return { success: false, message: error };
  }

  return { success: true, message: data?.message };
}

export async function validateTokenAction(token: string) {
  const { error } = await fetchAPI<{ success: boolean; message: string }>(
    `/validate-token?token=${encodeURIComponent(token)}`,
  );

  if (error) {
    return { valid: false, error };
  }

  return { valid: true };
}

export async function resetPasswordAction(
  token: string,
  newPassword: string,
  confirmPassword: string,
) {
  const { data, error } = await fetchAPI<{ success: boolean; message: string }>(
    "/reset-password",
    {
      method: "POST",
      body: JSON.stringify({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    },
  );

  if (error) {
    return { success: false, message: error };
  }

  return { success: true, message: data?.message };
}


export async function getActiveSessionsAction() {
  const { data, error } = await fetchAPI<SessionsResponse>(
    "/auth/sessions",
    { withAuth: true },
  );

  if (error) return { error };
  return { data: data?.data ?? [] };
}

export async function logoutSessionByIdAction(sessionId: string) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
  }>(`/auth/sessions/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
    withAuth: true,
  });

  if (error) return { error };
  return { success: true, message: data?.message };
}

export async function verifyEmailAction(token: string) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
  }>("/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });

  if (error) return { success: false, message: error };
  return { success: true, message: data?.message };
}

export async function resendVerificationAction(email: string) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
  }>("/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (error) return { success: false, message: error };
  return { success: true, message: data?.message };
}