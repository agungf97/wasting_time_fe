"use client";

import { logoutAction } from "@/actions/auth";
// import { removePushSubscription } from "@/lib/push-init";

export async function logoutWithPushCleanup(): Promise<void> {
  try {
    // await removePushSubscription();
  } catch (err) {
    console.error("[Push] Gagal unsubscribe saat logout:", err);
  }

  await logoutAction();
}