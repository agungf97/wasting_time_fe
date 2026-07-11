"use server";

import { fetchAPI } from "@/lib/api";
import { UsersResponse } from "@/lib/interface/user";

export async function getCustomerAction(search?: string) {
  const params = new URLSearchParams({ page: "1", limit: "1000" });
  if (search?.trim()) params.set("search", search.trim());

  const { data, error } = await fetchAPI<UsersResponse>(
    `/user?${params.toString()}`,
    { withAuth: true },
  );
  if (error) return { error };

  const users = (data?.data ?? []).filter(
    (u) => u.role.toLowerCase() === "customer",
  );

  return { data: users };
}
