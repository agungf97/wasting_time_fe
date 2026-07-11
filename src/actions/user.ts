"use server";

import { fetchAPI } from "@/lib/api";
import {
  CreateUserPayload,
  RoleItem,
  UpdateUserPayload,
  Users,
  UsersResponse,
} from "@/lib/interface/user";

export async function createUserAction(payload: CreateUserPayload) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
    data: CreateUserPayload;
  }>("/user", {
    method: "POST",
    withAuth: true,
    body: JSON.stringify(payload),
  });

  if (error) {
    return { error };
  }

  return { success: true, message: data?.message, data: data?.data };
}

export async function getUserFormOptionsAction() {
  const [roleRes] = await Promise.all([
    fetchAPI<{ data: RoleItem[] }>("/role", { withAuth: true }),
  ]);

  return {
    roleOptions: (roleRes.data?.data ?? [])
      .filter((r) => r.role_name.toLowerCase() !== "customer")
      .map((r) => ({
        id: r.role_name,
        label: r.role_name,
      })),
  };
}

export async function getUsersAction(search?: string) {
  const params = new URLSearchParams({ page: "1", limit: "1000" });
  if (search?.trim()) params.set("search", search.trim());

  const { data, error } = await fetchAPI<UsersResponse>(
    `/user?${params.toString()}`,
    { withAuth: true },
  );
  if (error) return { error };

  const users = (data?.data ?? []).filter(
    (u) => u.role.toLowerCase() !== "customer",
  );

  return { data: users };
}

export async function getUserDetailAction(id: string | number) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
    data: Users;
  }>(`/user/detail?id=${encodeURIComponent(String(id))}`, {
    withAuth: true,
  });

  if (error) return { error };
  return { data: data?.data };
}

export async function updateUserAction(payload: UpdateUserPayload) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
    data: UpdateUserPayload;
  }>("/user/update", {
    method: "PUT",
    withAuth: true,
    body: JSON.stringify(payload),
  });

  if (error) return { error };
  return { success: true, message: data?.message, data: data?.data };
}

export async function deleteUserAction(email: string) {
  const { data, error } = await fetchAPI<{
    success: boolean;
    message: string;
  }>(`/user/delete?email=${encodeURIComponent(email)}`, {
    method: "DELETE",
    withAuth: true,
  });

  if (error) return { error };
  return { success: true, message: data?.message };
}