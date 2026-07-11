interface FetchOptions extends RequestInit {
  withAuth?: boolean;
}

export async function fetchAPIClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<{ data?: T; error?: string; status?: number }> {
  const { withAuth = false, headers = {}, ...rest } = options;

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (withAuth) {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
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
