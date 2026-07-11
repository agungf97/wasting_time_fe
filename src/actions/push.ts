"use server";

import { fetchAPI } from "@/lib/api";

export async function getVapidKeyAction(): Promise<{ key?: string; error?: string }> {
  const { data, error } = await fetchAPI<{ data: { vapid_public_key: string } }>("/push/vapid-key", {
    withAuth: true,
  });
  if (error) return { error };
  return { key: data?.data?.vapid_public_key };
}

export async function subscribePushAction(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}): Promise<{ success?: boolean; error?: string }> {
  const { error } = await fetchAPI("/push/subscribe", {
    method: "POST",
    withAuth: true,
    body: JSON.stringify(subscription),
  });
  if (error) return { error };
  return { success: true };
}

export async function unsubscribePushAction(endpoint: string): Promise<{ success?: boolean; error?: string }> {
  const { error } = await fetchAPI("/push/unsubscribe", {
    method: "POST",
    withAuth: true,
    body: JSON.stringify({ endpoint }),
  });
  if (error) return { error };
  return { success: true };
}