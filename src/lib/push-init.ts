// "use client";

// import { getVapidKeyAction, subscribePushAction, unsubscribePushAction } from "@/actions/push";

// function urlBase64ToUint8Array(base64: string): Uint8Array {
//   const padding = "=".repeat((4 - (base64.length % 4)) % 4);
//   const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
//   const raw = window.atob(b64);
//   return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
// }

// export async function initPushSubscription(): Promise<void> {
//   if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

//   try {
//     const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
//     await navigator.serviceWorker.ready;

//     if (Notification.permission !== "granted") return;

//     const existing = await registration.pushManager.getSubscription();
//     if (existing) {
//         const json = existing.toJSON();
//             if (json.keys) {
//                 const resubResult = await subscribePushAction({
//                 endpoint: existing.endpoint,
//                 keys: {
//                     p256dh: json.keys.p256dh ?? "",
//                     auth:   json.keys.auth   ?? "",
//                 },
//                 });
//                 if (resubResult.error) {
//                 console.error("[Push] Gagal re-subscribe existing:", resubResult.error);
//                 }
//             }
//         return;
//     }

//     const { key, error: keyError } = await getVapidKeyAction();
//     if (!key || keyError) {
//       if (keyError !== "Tidak sah") {
//         console.error("[Push] Gagal mengambil VAPID key:", keyError);
//       }
//       return;
//     }

//     const subscription = await registration.pushManager.subscribe({
//       userVisibleOnly:    true,
//       applicationServerKey: urlBase64ToUint8Array(key).buffer as ArrayBuffer,
//     });

//     const json = subscription.toJSON();
//     if (!json.keys) return;

//     const subResult = await subscribePushAction({
//         endpoint: subscription.endpoint,
//         keys: {
//             p256dh: json.keys.p256dh ?? "",
//             auth:   json.keys.auth   ?? "",
//         },
//     });
//     if (subResult.error) {
//         console.error("[Push] Gagal subscribe:", subResult.error);
//         return;
//     }

//   } catch (err) {
//     console.error("[Push] initPushSubscription error:", err);
//   }
// }

// export async function removePushSubscription(): Promise<void> {
//   if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

//   try {
//     const registration = await navigator.serviceWorker.getRegistration("/");
//     if (!registration) return;

//     const subscription = await registration.pushManager.getSubscription();
//     if (!subscription) return;

//     const endpoint = subscription.endpoint;

//     await subscription.unsubscribe();

//     await unsubscribePushAction(endpoint);
//   } catch (err) {
//     console.error("[Push] removePushSubscription error:", err);
//   }
// }