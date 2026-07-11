// "use client";

// import { useEffect, useRef } from "react";
// import { initPushSubscription } from "@/lib/push-init";

// export function PushNotificationInitializer() {
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (initialized.current) return;
//     initialized.current = true;

//     initPushSubscription();
//   }, []);

//   return null;
// }