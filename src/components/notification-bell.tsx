// "use client";

// import { startTransition, useCallback, useEffect, useState } from "react";
// import { Bell, CheckCheck, ExternalLink, Loader2, X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Separator } from "@/components/ui/separator";
// import { useNotifications } from "@/lib/context/notification-context";
// import { cn } from "@/lib/utils";
// import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
// import { initPushSubscription } from "@/lib/push-init";

// interface OpenTemuan {
//   id: number;
//   nama_pelapor: string;
//   lokasi_temuan: string;
//   waktu_temuan: string;
//   type_observasi?: string;
// }

// type PermissionState = "default" | "granted" | "denied";

// function timeAgo(ts: number): string {
//   const diff = Date.now() - ts;
//   const m = Math.floor(diff / 60000);
//   const h = Math.floor(diff / 3600000);
//   const d = Math.floor(diff / 86400000);
//   if (m < 1) return "Baru saja";
//   if (m < 60) return `${m} menit lalu`;
//   if (h < 24) return `${h} jam lalu`;
//   if (d < 7) return `${d} hari lalu`;
//   return new Date(ts).toLocaleDateString("id-ID");
// }

// export function NotificationBell() {
//   const [open, setOpen] = useState(false);
//   const [openTemuan, setOpenTemuan] = useState<OpenTemuan[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [requestingPermission, setRequestingPermission] = useState(false);

//   const [permission, setPermission] = useState<PermissionState>(
//     () =>
//       typeof window !== "undefined" && "Notification" in window
//         ? (Notification.permission as PermissionState)
//         : "default",
//   );

//   const [pushSupport] = useState(() => {
//     if (typeof window === "undefined") {
//       return { isIOS: false, isSafari: false, isStandalone: false };
//     }
//     const ua = window.navigator.userAgent;
//     const isIOS = /iPad|iPhone|iPod/.test(ua);
//     const isSafari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);
//     const isStandalone =
//       window.matchMedia("(display-mode: standalone)").matches ||
//       (window.navigator as unknown as { standalone?: boolean }).standalone === true;
//     return { isIOS, isSafari, isStandalone };
//   });

//   const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, removeNotification } =
//     useNotifications();
//   const router = useRouter();

//   // const fetchOpenTemuan = useCallback(async () => {
//   //   setLoading(true);
//   //   try {
//   //     const result = await getObservasiDashboardAction(
//   //       undefined,
//   //       1,
//   //       50,
//   //       undefined,
//   //       undefined,
//   //       undefined,
//   //       { status: ["OPEN"] },
//   //       "waktu_temuan",
//   //       "desc",
//   //     );

//   //     if (result.data?.list_data) {
//   //       setOpenTemuan(
//   //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   //         result.data.list_data.map((item: any) => ({
//   //           id:            item.id            ?? 0,
//   //           nama_pelapor:  item.nama_pelapor  ?? "-",
//   //           lokasi_temuan: item.lokasi_temuan ?? "-",
//   //           waktu_temuan:  item.waktu_temuan  ?? "-",
//   //           type_observasi: item.type_observasi,
//   //         })),
//   //       );
//   //     }
//   //   } catch {
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, []);

//   // useEffect(() => {
//   //   startTransition(() => {
//   //     fetchOpenTemuan();
//   //   });
//   // }, [fetchOpenTemuan]);

//   // useEffect(() => {
//   //   if (!open) return;
//   //   startTransition(() => {
//   //     fetchOpenTemuan();
//   //   });
//   // }, [open, fetchOpenTemuan]);

//   const handleRequestPermission = async () => {
//     if (!("Notification" in window)) return;
//     setRequestingPermission(true);
//     try {
//       const result = await Notification.requestPermission();
//       setPermission(result as PermissionState);

//       if (result === "granted") {
//         await initPushSubscription();
//       }
//     } catch (err) {
//       console.error("[Push] Permission error:", err);
//     } finally {
//       setRequestingPermission(false);
//     }
//   };

//   const totalUnread = unreadCount + openTemuan.length;

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <Tooltip delayDuration={100}>
//         <TooltipTrigger asChild>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="icon" className="relative cursor-pointer rounded-full">
//               <Bell className="h-5 w-5" />
//               {totalUnread > 0 && (
//                 <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500 hover:bg-red-500 rounded-full">
//                   {totalUnread > 99 ? "99+" : totalUnread}
//                 </Badge>
//               )}
//             </Button>
//           </PopoverTrigger>
//         </TooltipTrigger>
//         <TooltipContent side="bottom">Notifikasi</TooltipContent>
//       </Tooltip>

//       <PopoverContent className="w-80 p-0" align="end">
//         <div className="flex items-center justify-between px-4 py-3 border-b">
//           <span className="font-semibold text-sm">Notifikasi</span>
//           {notifications.length > 0 && (
//             <div className="flex items-center gap-1">
//               {unreadCount > 0 && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-7 px-2 text-xs gap-1"
//                   onClick={markAllAsRead}
//                 >
//                   <CheckCheck className="h-3.5 w-3.5" />
//                   Baca semua
//                 </Button>
//               )}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-7 w-7 text-destructive hover:text-destructive"
//                 onClick={clearAll}
//               >
//                 <X className="h-3.5 w-3.5" />
//               </Button>
//             </div>
//           )}
//         </div>

//         <ScrollArea className="h-100 overflow-y-auto">
//           <div className="py-1">
//             {permission !== "granted" && (
//               <div
//                 className={cn(
//                   "mx-3 my-2 p-3 rounded-lg border text-sm",
//                   permission === "denied"
//                     ? "bg-destructive/10 border-destructive/20"
//                     : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
//                 )}
//               >
//                 {pushSupport.isIOS && !pushSupport.isStandalone ? (
//                   <>
//                     <p className="font-medium text-xs text-blue-700 dark:text-blue-300">
//                       Aktifkan push notifikasi
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {pushSupport.isSafari
//                         ? "Tambahkan situs ini ke Layar Utama terlebih dahulu: tekan tombol Share, lalu pilih \"Add to Home Screen\". Buka aplikasi dari ikon tersebut untuk mengaktifkan notifikasi."
//                         : "Buka situs ini melalui Safari (bukan Chrome) di iPhone, lalu tekan tombol Share dan pilih \"Add to Home Screen\" untuk mengaktifkan notifikasi."}
//                     </p>
//                   </>
//                 ) : permission === "denied" ? (
//                   <>
//                     <p className="font-medium text-destructive text-xs">Push notifikasi diblokir</p>
//                     <p className="text-muted-foreground text-xs mt-1">
//                       Aktifkan melalui pengaturan browser kamu.
//                     </p>
//                   </>
//                 ) : (
//                   <>
//                     <p className="font-medium text-xs text-blue-700 dark:text-blue-300">
//                       Aktifkan push notifikasi
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1 mb-2">
//                       Dapatkan notifikasi saat ada temuan baru.
//                     </p>
//                     <Button
//                       size="sm"
//                       className="h-7 text-xs w-full cursor-pointer"
//                       onClick={handleRequestPermission}
//                       disabled={requestingPermission}
//                     >
//                       {requestingPermission ? (
//                         <>
//                           <Loader2 className="h-3 w-3 animate-spin mr-1" /> Meminta izin...
//                         </>
//                       ) : (
//                         <>
//                           <Bell className="h-3 w-3 mr-1" /> Aktifkan Notifikasi
//                         </>
//                       )}
//                     </Button>
//                   </>
//                 )}
//               </div>
//             )}

//             <div className="px-3 pt-2 pb-1">
//               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
//                 Temuan Belum Direspons
//               </p>
//             </div>

//             {loading ? (
//               <div className="flex items-center justify-center py-8">
//                 <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
//               </div>
//             ) : openTemuan.length === 0 ? (
//               <p className="text-xs text-muted-foreground text-center py-4">
//                 Semua temuan sudah direspons 🎉
//               </p>
//             ) : (
//               <ul>
//                 {openTemuan.map((item) => (
//                   <li
//                     key={item.id}
//                     className="flex items-start gap-2 px-4 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors group"
//                     onClick={() => {
//                       setOpen(false);
//                       router.push(`/observasi/${item.id}`);
//                     }}
//                   >
//                     <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-1">
//                         <p className="text-sm font-medium truncate">{item.nama_pelapor}</p>
//                         <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
//                       </div>
//                       <div className="flex justify-between gap-2 pr-2">
//                         <p className="text-[11px] text-muted-foreground mt-0.5">{item.waktu_temuan}</p>
//                         <p className="text-xs text-muted-foreground truncate">{item.lokasi_temuan}</p>
//                       </div>
//                       {item.type_observasi && (
//                         <span className="inline-block text-[10px] bg-muted px-1.5 py-0.5 rounded mt-0.5 max-w-full truncate">
//                           {item.type_observasi}
//                         </span>
//                       )}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {notifications.length > 0 && (
//               <>
//                 <Separator className="my-2" />
//                 <div className="px-3 pb-1">
//                   <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
//                     Aktivitas Terbaru
//                   </p>
//                 </div>
//                 <ul className="divide-y">
//                   {notifications.map((notif) => (
//                     <li
//                       key={notif.id}
//                       className={cn(
//                         "relative flex items-start gap-2 px-4 py-2.5 cursor-pointer group",
//                         "hover:bg-muted/50 transition-colors",
//                         !notif.read && "bg-blue-50/50 dark:bg-blue-950/20",
//                       )}
//                       onClick={() => {
//                         if (!notif.read) markAsRead(notif.id);
//                         setOpen(false);
//                         router.push(notif.url);
//                       }}
//                     >
//                       {!notif.read ? (
//                         <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
//                       ) : (
//                         <span className="mt-1.5 h-2 w-2 shrink-0" />
//                       )}
//                       <div className="flex-1 min-w-0">
//                         <p
//                           className={cn(
//                             "text-sm truncate",
//                             !notif.read ? "font-semibold" : "font-medium",
//                           )}
//                         >
//                           {notif.title}
//                         </p>
//                         <p className="text-[11px] text-muted-foreground mt-1">
//                           {timeAgo(notif.timestamp)}
//                         </p>
//                         <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
//                           {notif.body}
//                         </p>
//                       </div>
//                       <button
//                         className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           removeNotification(notif.id);
//                         }}
//                       >
//                         <X className="h-3 w-3 text-muted-foreground" />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </>
//             )}

//             {!loading &&
//               openTemuan.length === 0 &&
//               notifications.length === 0 &&
//               permission === "granted" && (
//                 <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
//                   <Bell className="h-8 w-8 opacity-30" />
//                   <p className="text-sm">Belum ada notifikasi</p>
//                 </div>
//               )}
//           </div>
//         </ScrollArea>
//       </PopoverContent>
//     </Popover>
//   );
// }