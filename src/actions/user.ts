"use server";

import { fetchAPI, buildQuery } from "@/lib/api";
import {
  User,
  UserDetail,
  CreateUserPayload,
  UpdateUserPayload,
  GetUsersParams,
  PaginatedResponse,
} from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getUsersAction(params: GetUsersParams = {}) {
  const query = buildQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    ...(params.search && { search: params.search }),
    ...(params.role && { role: params.role }),
    ...(params.id && { id: params.id }),
  });

  const { data, error } = await fetchAPI<PaginatedResponse<User>>(
    `/user${query}`,
    { withAuth: true },
  );

  if (error || !data) {
    return { error: error || "Gagal mengambil data user" };
  }

  return { data };
}

export async function getUserDetailAction(id: number) {
  const { data, error } = await fetchAPI<UserDetail>(`/user/detail?id=${id}`, {
    withAuth: true,
  });

  if (error || !data) {
    return { error: error || "Gagal mengambil detail user" };
  }

  return { data };
}

export async function createUserAction(payload: CreateUserPayload) {
  const { data, error } = await fetchAPI<User>("/user", {
    method: "POST",
    body: JSON.stringify(payload),
    withAuth: true,
  });

  if (error) {
    return { error };
  }

  revalidatePath("/table-users");
  return { data };
}

export async function updateUserAction(
  email: string,
  payload: UpdateUserPayload,
) {
  const { data, error } = await fetchAPI<User>(
    `/user/update?email=${encodeURIComponent(email)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      withAuth: true,
    },
  );

  if (error) {
    return { error };
  }

  revalidatePath("/table-users");
  return { data };
}

export async function deleteUserAction(email: string) {
  const { error } = await fetchAPI(
    `/user/delete?email=${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      withAuth: true,
    },
  );

  if (error) {
    return { error };
  }

  revalidatePath("/table-users");
  return { success: true };
}

export async function deleteMultipleUsersAction(emails: string[]) {
  const results = await Promise.all(
    emails.map((email) => deleteUserAction(email)),
  );

  const failed = results.filter((r) => r.error);
  if (failed.length > 0) {
    return { error: `${failed.length} user gagal dihapus` };
  }

  revalidatePath("/table-users");
  return { success: true };
}
