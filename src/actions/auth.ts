"use server";

import { fetchAPI } from "@/lib/api";
import {
  ChangePasswordPayload,
  ChangePasswordResult,
  LoginResponse,
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

  redirect("/login");
}

export async function loginAction(
  identifier: string,
  password: string,
  rememberMe: boolean = false,
) {
  const { data, error, status } = await fetchAPI<LoginResponse>("/login", {
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
  cookieStore.set("role", role ?? "", {
    ...baseCookieOptions,
    httpOnly: false,
  });
  cookieStore.set("name", name ?? "", {
    ...baseCookieOptions,
    httpOnly: false,
  });
  cookieStore.set("email", email ?? "", {
    ...baseCookieOptions,
    httpOnly: false,
  });
  cookieStore.set("username", username ?? "", {
    ...baseCookieOptions,
    httpOnly: false,
  });
  cookieStore.set("phone_number", phone_number ?? "", {
    ...baseCookieOptions,
    httpOnly: false,
  });

  return { success: true, status };
}

const SESSION_COOKIE_NAMES = [
  "token",
  "role",
  "name",
  "email",
  "username",
  "phone_number",
];

export async function logoutAction() {
  const { error } = await fetchAPI<{ success: boolean; message: string }>(
    "/logout",
    {
      method: "POST",
      withAuth: true,
    },
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
    "/change-password",
    {
      method: "POST",
      withAuth: true,
      body: JSON.stringify(payload),
    },
  );

  if (error) {
    return { success: false, message: error };
  }

  const cookieStore = await cookies();
  SESSION_COOKIE_NAMES.forEach((name) => cookieStore.delete(name));

  redirect("/");
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
