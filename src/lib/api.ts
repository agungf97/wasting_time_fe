import { cookies } from "next/headers";

interface FetchOptions extends RequestInit {
  withAuth?: boolean;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<{ data?: T; error?: string; status?: number }> {
  const { withAuth = false, headers = {}, ...rest } = options;

  const isFormData = rest.body instanceof FormData;

  const reqHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers as Record<string, string>),
  };

  if (withAuth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
      reqHeaders["Authorization"] = token;
    }
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: reqHeaders,
      ...rest,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      return {
        error: data?.message || `Error ${res.status}`,
        status: res.status,
      };
    }

    return { data, status: res.status };
  } catch {
    return { error: "Network error, please try again" };
  }
}

export function buildQuery(params: Record<string, unknown>): string {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return query ? `?${query}` : "";
}
