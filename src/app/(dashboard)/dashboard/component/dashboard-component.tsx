// 'use client'

// import { useState, useEffect, useCallback, useRef, useMemo } from "react";
// import {
//   ObservasiDashboardData,
//   ChartItem,
//   ObservasiListItem,
//   ObservasiDashboardResponse,
//   ObservasiDetail,
// } from "@/lib/interface/observasi";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendContent,
//   type ChartConfig,
// } from "@/components/ui/chart";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Search, XIcon, CalendarIcon, ChartBar, FilePlus, Eye, Trash2, Pencil } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import { Checkbox } from "@/components/ui/checkbox";
// import { TableHeadDateRangeFilter, TableHeadFilter } from "@/components/table-head-filter";
// import { cn } from "@/lib/utils";
// import { useDebounce } from "@/hooks/use-debounce";
// import TablePagination from "@/components/custom-pagination";
// import {
//   getObservasiDashboardAction,
//   deleteObservasiAction,
//   getObservasiDetailAction,
// } from "@/actions/observasi";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { DateRangePicker } from "@/components/date-range-picker";
// import { DateRange } from "@/lib/interface/custom";
// import { format, parseISO } from "date-fns";
// import { id as localeId } from "date-fns/locale";
// import { useRouter, useSearchParams } from "next/navigation";
// import { DashboardFilterParams, FilterOptions } from "@/lib/interface/observasi";
// import { toast } from "sonner";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { UpdateObservasiForm } from "@/components/form/observasi/form-update-observasi";

// const PERIODE_OPTIONS = [
//   { value: "harian",   label: "Harian"   },
//   { value: "mingguan", label: "Mingguan" },
//   { value: "bulanan",  label: "Bulanan"  },
//   { value: "tahunan",  label: "Tahunan"  },
// ];

// const DEFAULT_PERIODE = "bulanan";

// const EMPTY_FILTERS: DashboardFilterParams = {
//   status: [],
//   nama_pelapor: [],
//   department_pelapor: [],
//   jabatan_pelapor: [],
//   lokasi_temuan: [],
//   detail_lokasi_temuan: [],
//   type_observasi: [],
// };

// const chartConfig = {
//   open:  { label: "Open",  color: "#ef4444" },
//   close: { label: "Close", color: "#22c55e" },
// } satisfies ChartConfig;

// function toChartData(items: ChartItem[] | null | undefined) {
//   if (!items?.length) return [];
//   return items.map((item) => ({
//     label: item.label,
//     open:  parseInt(item.open  ?? "0", 10),
//     close: parseInt(item.close ?? "0", 10),
//   }));
// }

// function truncateLabel(label: string, maxChars: number) {
//   if (label.length <= maxChars) return label;
//   return `${label.slice(0, maxChars).trimEnd()}…`;
// }

// function formatDate(date: Date) {
//   return format(date, "yyyy-MM-dd");
// }


// function RotatedAxisTick({
//   x, y, payload,
//   angle = -35, fontSize = 9, maxChars = 12,
// }: {
//   x?: number;
//   y?: number;
//   payload?: { value: string };
//   angle?: number;
//   fontSize?: number;
//   maxChars?: number;
// }) {
//   if (!payload) return null;
//   const label = truncateLabel(String(payload.value), maxChars);
//   return (
//     <text
//       x={x} y={y} dy={10}
//       textAnchor="end"
//       fill="var(--muted-foreground)"
//       fontSize={fontSize}
//       transform={`rotate(${angle}, ${x}, ${y})`}
//     >
//       {label}
//     </text>
//   );
// }

// function SummaryCard({
//   title, value, subtitle, variant,
// }: {
//   title: string;
//   value: number | undefined;
//   subtitle: string;
//   variant: "default" | "open" | "close";
// }) {
//   const borderColor =
//     variant === "open"
//       ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
//       : variant === "close"
//         ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
//         : "";

//   const valueColor =
//     variant === "open"
//       ? "text-red-600 dark:text-red-400"
//       : variant === "close"
//         ? "text-green-600 dark:text-green-400"
//         : "";

//   return (
//     <Card className={borderColor}>
//       <CardContent className="text-center">
//         <p className="text-sm text-muted-foreground mb-1">{title}</p>
//         <p className={`text-5xl font-bold tabular-nums ${valueColor}`}>
//           {value ?? "-"}
//         </p>
//         <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
//       </CardContent>
//     </Card>
//   );
// }

// function BarChartCard({
//   title, description, data, loading,
// }: {
//   title: string;
//   description: string;
//   data: ChartItem[] | null | undefined;
//   loading: boolean;
// }) {
//   const chartData = toChartData(data);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     if (containerRef.current && containerRef.current.clientWidth > 0) {
//       setReady(true);
//     } else {
//       const observer = new ResizeObserver((entries) => {
//         for (const entry of entries) {
//           if (entry.contentRect.width > 0) {
//             setReady(true);
//             observer.disconnect();
//           }
//         }
//       });
//       if (containerRef.current) observer.observe(containerRef.current);
//       return () => observer.disconnect();
//     }
//   }, []);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-sm font-semibold">{title}</CardTitle>
//         <CardDescription className="text-xs">{description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div ref={containerRef} className="w-full">
//           {loading || !ready ? (
//             <Skeleton className="h-56 w-full" />
//           ) : chartData.length === 0 ? (
//             <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
//               Tidak ada data
//             </div>
//           ) : (
//             <ChartContainer config={chartConfig} className="h-80 w-full overflow-visible">
//               <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 36 }}>
//                 <CartesianGrid vertical={false} strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="label"
//                   tick={<RotatedAxisTick angle={-35} fontSize={9} maxChars={12} />}
//                   interval={0} tickLine={false} axisLine={false}
//                 />
//                 <YAxis
//                   tick={{ fontSize: 9 }} tickLine={false} axisLine={false}
//                   label={{
//                     value: "Jumlah Temuan", angle: -90, position: "insideLeft",
//                     offset: -2, style: { fontSize: 9, fill: "var(--muted-foreground)" },
//                   }}
//                 />
//                 <ChartTooltip content={<ChartTooltipContent />} />
//                 <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
//                 <Bar dataKey="open"  fill="var(--color-open)"  radius={[0, 0, 0, 0]} stackId="a" />
//                 <Bar dataKey="close" fill="var(--color-close)" radius={[2, 2, 0, 0]} stackId="a" />
//               </BarChart>
//             </ChartContainer>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// function DetailLokasiChart({
//   data, loading,
// }: {
//   data: ChartItem[] | null | undefined;
//   loading: boolean;
// }) {
//   const chartData = toChartData(data);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     if (containerRef.current && containerRef.current.clientWidth > 0) {
//       setReady(true);
//     } else {
//       const observer = new ResizeObserver((entries) => {
//         for (const entry of entries) {
//           if (entry.contentRect.width > 0) {
//             setReady(true);
//             observer.disconnect();
//           }
//         }
//       });
//       if (containerRef.current) observer.observe(containerRef.current);
//       return () => observer.disconnect();
//     }
//   }, []);

//   return (
//     <div ref={containerRef} className="w-full">
//       {loading || !ready ? (
//         <Skeleton className="h-80 w-full" />
//       ) : !chartData.length ? (
//         <div className="h-80 flex items-center justify-center text-sm text-muted-foreground">
//           Tidak ada data
//         </div>
//       ) : (
//         <ChartContainer config={chartConfig} className="h-80 w-full overflow-visible">
//           <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 36 }}>
//             <CartesianGrid vertical={false} strokeDasharray="3 3" />
//             <XAxis
//               dataKey="label"
//               tick={<RotatedAxisTick angle={-45} fontSize={8} maxChars={12} />}
//               interval={0} tickLine={false} axisLine={false}
//             />
//             <YAxis
//               tick={{ fontSize: 9 }} tickLine={false} axisLine={false}
//               label={{
//                 value: "Jumlah Temuan", angle: -90, position: "insideLeft",
//                 offset: -2, style: { fontSize: 9, fill: "var(--muted-foreground)" },
//               }}
//             />
//             <ChartTooltip content={<ChartTooltipContent />} />
//             <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
//             <Bar dataKey="open"  fill="var(--color-open)"  radius={[0, 0, 0, 0]} stackId="a" />
//             <Bar dataKey="close" fill="var(--color-close)" radius={[2, 2, 0, 0]} stackId="a" />
//           </BarChart>
//         </ChartContainer>
//       )}
//     </div>
//   );
// }


// interface DashboardComponentProps {
//   initialData: ObservasiDashboardData | null;
//   initialMeta: ObservasiDashboardResponse["meta"] | null;
//   filterOptions: FilterOptions;
//   name?: string;
// }

// export default function DashboardComponent({
//   initialData,
//   initialMeta,
//   filterOptions,
//   name,
// }: DashboardComponentProps) {
//   const router = useRouter();

//   const [search, setSearch]       = useState("");
//   const [page, setPage]           = useState(1);
//   const [pageSize, setPageSize]   = useState(10);
//   const debouncedSearch           = useDebounce(search, 400);
//   const isFirstRender             = useRef(true);

//   const [dateRange, setDateRange]           = useState<DateRange | undefined>(undefined);
//   const [periode, setPeriode]               = useState<string>(DEFAULT_PERIODE);
//   const [datePickerOpen, setDatePickerOpen] = useState(false);
//   const [periodePickerOpen, setPeriodePickerOpen] = useState(false);
  
//   const [filters, setFilters] = useState<DashboardFilterParams>(EMPTY_FILTERS);
//   const searchParams = useSearchParams();
//   const columnDateRange = useMemo<DateRange | undefined>(() => {
//   const from = searchParams.get("tanggal_mulai");
//     const to   = searchParams.get("tanggal_selesai");
//     if (!from) return undefined;
//     return {
//       from: parseISO(from),
//       to:   to ? parseISO(to) : undefined,
//     };
//   }, [searchParams]);

//   const [editItem, setEditItem]         = useState<ObservasiDetail | null>(null);
//   const [editOpen, setEditOpen]         = useState(false);
//   const [isLoadingEdit, setIsLoadingEdit] = useState(false);
//   const [deletingItem, setDeletingItem]   = useState<ObservasiListItem | null>(null);
//   const [deleteOpen, setDeleteOpen]       = useState(false);
//   const [isDeleting, setIsDeleting]       = useState(false);
//   const [deleteError, setDeleteError]     = useState("");

//   const handleColumnDateRangeChange = (range: DateRange | undefined) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (range?.from) {
//       params.set("tanggal_mulai", formatDate(range.from));
//       if (range.to) params.set("tanggal_selesai", formatDate(range.to));
//       else params.delete("tanggal_selesai");
//     } else {
//       params.delete("tanggal_mulai");
//       params.delete("tanggal_selesai");
//     }
//     router.replace(`?${params.toString()}`);
//   };

//   const [chartState, setChartState] = useState<{
//     data: Omit<ObservasiDashboardData, "list_data"> | null;
//     loading: boolean;
//   }>({
//     data: initialData
//       ? (() => {
//           // eslint-disable-next-line @typescript-eslint/no-unused-vars
//           const { list_data: _, ...rest } = initialData;
//           return rest;
//         })()
//       : null,
//     loading: false,
//   });

//   const [listState, setListState] = useState<{
//     items: ObservasiListItem[];
//     loading: boolean;
//     error: string | null;
//     meta: ObservasiDashboardResponse["meta"] | null;
//   }>({
//     items: initialData?.list_data ?? [],
//     loading: false,
//     error: null,
//     meta: initialMeta,
//   });

//   const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
//   const [sortConfig, setSortConfig]     = useState<{
//     field: keyof ObservasiListItem | null;
//     direction: "asc" | "desc" | null;
//   }>({ field: null, direction: null });

//   const skipNextListFetchRef = useRef(false);

//   const fetchChartData = useCallback(
//     async (dr: DateRange | undefined, p: string) => {
//       setChartState((prev) => ({ ...prev, loading: true }));
//       const { data, error } = await getObservasiDashboardAction(
//         undefined, 1, 1,
//         dr?.from ? formatDate(dr.from) : undefined,
//         dr?.to   ? formatDate(dr.to)   : undefined,
//         p,
//       );
//       if (error || !data) {
//         setChartState({ data: null, loading: false });
//         return;
//       }
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const { list_data: _, ...rest } = data;
//       setChartState({ data: rest, loading: false });
//     },
//     [],
//   );

//   const fetchListData = useCallback(
//     async (
//       searchTerm: string | undefined,
//       currentPage: number,
//       limit: number,
//       dr: DateRange | undefined,
//       p: string,
//       activeFilters: DashboardFilterParams,
//       sort?: { field: keyof ObservasiListItem | null; direction: "asc" | "desc" | null },
//     ) => {
//       const { data, meta, error } = await getObservasiDashboardAction(
//         searchTerm,
//         currentPage,
//         limit,
//         dr?.from ? formatDate(dr.from) : undefined,
//         dr?.to   ? formatDate(dr.to)   : undefined,
//         p,
//         activeFilters,
//         sort?.field     ?? undefined,
//         sort?.direction ?? undefined,
//       );

//       if (error || !data) {
//         setListState((prev) => ({
//           ...prev,
//           loading: false,
//           error: error ?? "Gagal memuat data",
//         }));
//         return;
//       }

//       setListState({
//         items: data.list_data ?? [],
//         loading: false,
//         error: null,
//         meta: meta ?? null,
//       });
//     },
//     [],
//   );

//   useEffect(() => {
//     if (isFirstRender.current) return;
//     fetchChartData(dateRange, periode);

//     if (page !== 1) skipNextListFetchRef.current = true;

//     setPage(1);
//     setListState((prev) => ({ ...prev, loading: true, error: null }));
//     fetchListData(debouncedSearch, 1, pageSize, columnDateRange, periode, filters, sortConfig);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dateRange, periode]);

//   useEffect(() => {
//     if (isFirstRender.current) return;

//     if (page !== 1) skipNextListFetchRef.current = true;

//     setPage(1);
//     setListState((prev) => ({ ...prev, loading: true, error: null }));
//     fetchListData(debouncedSearch, 1, pageSize, columnDateRange, periode, filters, sortConfig);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [columnDateRange]);

//   useEffect(() => {
//     if (isFirstRender.current) {
//       isFirstRender.current = false;
//       return;
//     }
//     if (skipNextListFetchRef.current) {
//       skipNextListFetchRef.current = false;
//       return;
//     }
//     setListState((prev) => ({ ...prev, loading: true, error: null }));
//     fetchListData(debouncedSearch, page, pageSize, columnDateRange, periode, filters, sortConfig);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [debouncedSearch, page, pageSize]);

//   useEffect(() => {
//     if (isFirstRender.current) return;

//     if (page !== 1) skipNextListFetchRef.current = true;

//     setPage(1);
//     setListState((prev) => ({ ...prev, loading: true, error: null }));
//     fetchListData(debouncedSearch, 1, pageSize, columnDateRange, periode, filters, sortConfig);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, sortConfig]);
  
//   useEffect(() => {
//     if (isFirstRender.current) return;

//     if (page !== 1) skipNextListFetchRef.current = true;

//     setPage(1);
//     setListState((prev) => ({ ...prev, loading: true, error: null }));
//     fetchListData(debouncedSearch, 1, pageSize, columnDateRange, periode, filters, sortConfig);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [searchParams]);  
  
//   const [userRole] = useState<string>(() => {
//     if (typeof document === "undefined") return "";
//     const raw = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("role="))
//       ?.split("=")[1] ?? "";
//     return decodeURIComponent(raw);
//   });

//   const isAdmin = userRole === "ADMIN";

//   const { items: rawItems, loading, meta } = listState;
//   const totalPages = meta?.total_pages ?? 1;
//   const sortedData = rawItems;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
//   const isAllFiltersEmpty = Object.values(filters).every((v) => v.length === 0);

//   const handleSort =
//     (field: keyof ObservasiListItem) =>
//     (direction: "asc" | "desc" | null) => {
//       setSortConfig({ field, direction });
//     };

//   const selectedRows = Object.values(rowSelection).filter(Boolean).length;
//   const selectedRowsFromCurrentPage = Object.entries(rowSelection).filter(
//     ([id, selected]) => selected && sortedData.some((item) => item.id === Number(id)),
//   ).length;

//   const dateRangeLabel = useMemo(() => {
//     if (!dateRange?.from) return "Pilih tanggal";
//     if (!dateRange.to) return format(dateRange.from, "d MMM yyyy", { locale: localeId });
//     return `${format(dateRange.from, "d MMM yyyy", { locale: localeId })} – ${format(dateRange.to, "d MMM yyyy", { locale: localeId })}`;
//   }, [dateRange]);

//   const periodeLabel =
//     PERIODE_OPTIONS.find((o) => o.value === periode)?.label ?? "Bulanan";

//   const isFilterActive = !!dateRange?.from || periode !== DEFAULT_PERIODE;

//   const handleResetAllFilters = () => {
//     setDateRange(undefined);
//     setPeriode(DEFAULT_PERIODE);
//     fetchChartData(undefined, DEFAULT_PERIODE);

//     const params = new URLSearchParams(searchParams.toString());
//     params.delete("tanggal_mulai");
//     params.delete("tanggal_selesai");
//     router.replace(`?${params.toString()}`);

//     skipNextListFetchRef.current = true;
//     setPage(1);
//     setListState((prev) => ({ ...prev, loading: true, error: null }));
//     fetchListData(debouncedSearch, 1, pageSize, undefined, DEFAULT_PERIODE, filters, sortConfig);
//   };

//   const handleResetColumnFilters = () => {
//     setFilters(EMPTY_FILTERS);
//     setSortConfig({ field: null, direction: null });
//     handleColumnDateRangeChange(undefined);
//   };

//   const setFilterField = (field: keyof DashboardFilterParams) => (values: string[]) => {
//     setFilters((prev) => ({ ...prev, [field]: values }));
//   };

//   const handleEdit = async (id: number) => {
//     setIsLoadingEdit(true);
//     const { data, error } = await getObservasiDetailAction(id);
//     if (error || !data) {
//       toast.error("Gagal memuat data observasi", { description: error });
//       setIsLoadingEdit(false);
//       return;
//     }
//     setEditItem(data);
//     setEditOpen(true);
//     setIsLoadingEdit(false);
//   };

//   const handleDelete = async () => {
//     if (!deletingItem) return;
//     setIsDeleting(true);
//     setDeleteError("");
//     try {
//       const { error, message } = await deleteObservasiAction(deletingItem.id);
//       if (error) {
//         setDeleteError(error);
//         toast.error("Gagal menghapus observasi", { description: error });
//         return;
//       }
//       toast.success(message || "Observasi berhasil dihapus");
//       setDeleteOpen(false);
//       setDeletingItem(null);
//       fetchChartData(dateRange, periode);
//       setListState((prev) => ({ ...prev, loading: true, error: null }));
//       fetchListData(debouncedSearch, page, pageSize, columnDateRange, periode, filters, sortConfig);
//     } catch {
//       const msg = "Tidak dapat terhubung ke server.";
//       setDeleteError(msg);
//       toast.error(msg);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <div className="space-y-6">

//       <Card>
//         {name && (
//           <>
//             <CardHeader>
//               <CardDescription>Hi 👋, Selamat datang kembali</CardDescription>
//               <CardTitle>{name}</CardTitle>
//             </CardHeader>
//             <Separator />
//           </>
//         )}
//         <CardContent>
//           <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
//             <div className="flex flex-col gap-1 md:min-w-45">
//               <span className="text-xs text-muted-foreground font-medium">Tanggal Temuan</span>
//               <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline" size="sm"
//                     className={cn(
//                       "h-9 w-full md:w-auto cursor-pointer justify-start text-left font-normal text-xs",
//                       !dateRange?.from && "text-muted-foreground",
//                     )}
//                   >
//                     <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0" />
//                     {dateRangeLabel}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0" align="start">
//                   <DateRangePicker
//                     dateRange={dateRange}
//                     onChange={(range) => {
//                       setDateRange(range);
//                       if (range?.from && range?.to) setDatePickerOpen(false);
//                     }}
//                     onReset={() => setDateRange(undefined)}
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div className="flex flex-col gap-1 md:min-w-40">
//               <span className="text-xs text-muted-foreground font-medium">Tampilan Chart</span>
//               <Popover open={periodePickerOpen} onOpenChange={setPeriodePickerOpen}>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline" size="sm"
//                     className="h-9 w-full cursor-pointer md:w-auto justify-start text-left font-normal text-xs"
//                   >
//                     <ChartBar className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
//                     {periodeLabel}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-48 p-1" align="start" sideOffset={4}>
//                   {PERIODE_OPTIONS.map((opt) => (
//                     <Button
//                       variant="filter" key={opt.value}
//                       onClick={() => { setPeriode(opt.value); setPeriodePickerOpen(false); }}
//                       className={cn(
//                         "w-full flex items-center justify-between rounded px-3 py-2 text-xs hover:bg-accent hover:text-accent-foreground transition-colors",
//                         periode === opt.value && "font-semibold text-primary",
//                       )}
//                     >
//                       {opt.label}
//                       {periode === opt.value && (
//                         <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                           <polyline points="20 6 9 17 4 12" />
//                         </svg>
//                       )}
//                     </Button>
//                   ))}
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div className="flex items-center justify-end gap-2 md:ml-auto">
//               <Button
//                 variant="outline" size="sm"
//                 className="h-9 px-3 text-xs cursor-pointer"
//                 onClick={handleResetAllFilters}
//                 disabled={!isFilterActive}
//               >
//                 <XIcon className="h-3.5 w-3.5 mr-1" />
//                 Reset
//               </Button>
//               <Button
//                 variant="outline" size="sm"
//                 className="h-9 cursor-pointer px-3 text-xs"
//                 onClick={() => router.push("/form-observasi")}
//               >
//                 <FilePlus className="h-3.5 w-3.5 mr-1" />
//                 Temuan
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         <div className="col-span-2 md:col-span-1">
//           <SummaryCard
//             title="Total Temuan"
//             value={chartState.data?.total_temuan}
//             subtitle="Keseluruhan"
//             variant="default"
//           />
//         </div>
//         <SummaryCard title="Status Open" value={chartState.data?.status_open}  subtitle="Perlu Ditindak" variant="open"  />
//         <SummaryCard title="Telah Closed"  value={chartState.data?.status_close} subtitle="Sudah Tuntas"  variant="close" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <BarChartCard
//           title="Observasi Bulanan"
//           description={`Tampilkan chart observasi dalam waktu ${periodeLabel.toLowerCase()}.`}
//           data={chartState.data?.chart_observasi_periode}
//           loading={chartState.loading}
//         />
//         <BarChartCard
//           title="Type Observasi"
//           description={`Tampilkan chart berdasarkan type observasi dalam waktu ${periodeLabel.toLowerCase()}.`}
//           data={chartState.data?.chart_type_observasi}
//           loading={chartState.loading}
//         />
//         <BarChartCard
//           title="Department Pelapor"
//           description={`Tampilkan chart berdasarkan department pelapor dalam waktu ${periodeLabel.toLowerCase()}.`}
//           data={chartState.data?.chart_department_pelapor}
//           loading={chartState.loading}
//         />
//         <BarChartCard
//           title="Lokasi Temuan"
//           description={`Tampilkan chart berdasarkan lokasi temuan dalam waktu ${periodeLabel.toLowerCase()}.`}
//           data={chartState.data?.chart_lokasi_temuan}
//           loading={chartState.loading}
//         />
//         <div className="hidden md:block">
//           <BarChartCard
//             title="Potensi Bahaya dan Resiko"
//             description={`Tampilkan chart berdasarkan potensi bahaya dan resiko dalam waktu ${periodeLabel.toLowerCase()}.`}
//             data={chartState.data?.chart_potensi_bahaya_resiko}
//             loading={chartState.loading}
//           />
//         </div>
//         <div className="hidden md:block">
//           <BarChartCard
//             title="Nama Pelapor"
//             description={`Tampilkan chart berdasarkan nama pelapor dalam waktu ${periodeLabel.toLowerCase()}.`}
//             data={chartState.data?.chart_nama_pelapor}
//             loading={chartState.loading}
//           />
//         </div>
//       </div>

//       <Card className="hidden md:block">
//         <CardHeader>
//           <CardTitle className="text-sm font-semibold">Detail Lokasi Temuan</CardTitle>
//           <CardDescription className="text-xs">
//             {`Tampilkan chart berdasarkan detail lokasi temuan dalam waktu ${periodeLabel.toLowerCase()}.`}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DetailLokasiChart
//             data={chartState.data?.chart_detail_lokasi_temuan}
//             loading={chartState.loading}
//           />
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle className="text-sm font-semibold">Safety Behavior Observation</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">

//             <div className="md:flex justify-between space-y-4 md:space-y-0">
//               <div className="relative">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Cari data..."
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value);
//                     setPage(1);
//                   }}
//                   className="pl-8 pr-8"
//                 />
//                 {search && (
//                   <Button
//                     variant="eye"
//                     onClick={() => { setSearch(""); setPage(1); }}
//                     className="absolute cursor-pointer right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
//                     type="button"
//                   >
//                     <XIcon className="h-4 w-4" />
//                   </Button>
//                 )}
//               </div>

//               <Button
//                 variant="outline" size="sm"
//                 className="w-fit cursor-pointer"
//                 onClick={handleResetColumnFilters}
//                 disabled={isAllFiltersEmpty && !sortConfig.field && !columnDateRange?.from}
//               >
//                 <XIcon className="h-4 w-4 mr-1" />
//                 Reset Filter
//               </Button>
//             </div>

//             <div className="rounded-md border text-xs overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="w-12">
//                       <Checkbox
//                         className="cursor-pointer"
//                         checked={sortedData.length > 0 && selectedRows === sortedData.length}
//                         onCheckedChange={(value) => {
//                           setRowSelection(
//                             value
//                               ? sortedData.reduce((acc, row) => ({ ...acc, [row.id]: true }), {})
//                               : {},
//                           );
//                         }}
//                         aria-label="Pilih Semua"
//                       />
//                     </TableHead>

//                     <TableHeadFilter
//                       label="Status Temuan"
//                       values={filters.status ?? []}
//                       options={filterOptions.status}
//                       onChange={setFilterField("status")}
//                       onSort={handleSort("status")}
//                     />
//                     <TableHeadDateRangeFilter
//                       label="Waktu Temuan"
//                       dateRange={columnDateRange}
//                       onChange={handleColumnDateRangeChange}
//                       onSort={handleSort("waktu_temuan")}
//                       onReset={() => handleColumnDateRangeChange(undefined)}
//                     />
//                     <TableHeadFilter
//                       label="Nama Pelapor"
//                       values={filters.nama_pelapor ?? []}
//                       options={filterOptions.nama_pelapor}
//                       onChange={setFilterField("nama_pelapor")}
//                       onSort={handleSort("nama_pelapor")}
//                     />
//                     <TableHeadFilter
//                       label="Department Pelapor"
//                       values={filters.department_pelapor ?? []}
//                       options={filterOptions.department_pelapor}
//                       onChange={setFilterField("department_pelapor")}
//                       onSort={handleSort("department_pelapor")}
//                     />
//                     <TableHeadFilter
//                       label="Jabatan Pelapor"
//                       values={filters.jabatan_pelapor ?? []}
//                       options={filterOptions.jabatan_pelapor}
//                       onChange={setFilterField("jabatan_pelapor")}
//                       onSort={handleSort("jabatan_pelapor")}
//                     />
//                     <TableHeadFilter
//                       label="Lokasi Temuan"
//                       values={filters.lokasi_temuan ?? []}
//                       options={filterOptions.lokasi_temuan}
//                       onChange={setFilterField("lokasi_temuan")}
//                       onSort={handleSort("lokasi_temuan")}
//                     />
//                     <TableHeadFilter
//                       label="Detail Lokasi Temuan"
//                       values={filters.detail_lokasi_temuan ?? []}
//                       options={filterOptions.detail_lokasi_temuan}
//                       onChange={setFilterField("detail_lokasi_temuan")}
//                       onSort={handleSort("detail_lokasi_temuan")}
//                     />
//                     <TableHeadFilter
//                       label="Type Observasi"
//                       values={filters.type_observasi ?? []}
//                       options={filterOptions.type_observasi}
//                       onChange={setFilterField("type_observasi")}
//                       onSort={handleSort("type_observasi")}
//                     />
//                     <TableHead>Aksi</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {loading ? (
//                     <TableRow>
//                       <TableCell colSpan={10} className="py-10 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
//                           <span className="text-sm text-muted-foreground">Loading...</span>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ) : sortedData.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
//                         Tidak ada data ditemukan.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     sortedData.map((item, index) => (
//                       <TableRow
//                         key={item.id}
//                         onDoubleClick={() => router.push(`/observasi/${item.id}`)}
//                         className={cn(
//                           "transition-colors duration-200 hover:bg-muted/50 cursor-pointer",
//                           rowSelection[item.id] && "bg-muted",
//                         )}
//                       >
//                         <TableCell className="w-12">
//                           <Checkbox
//                             className="cursor-pointer"
//                             checked={rowSelection[item.id] ?? false}
//                             onCheckedChange={(value) => {
//                               setRowSelection((prev) => ({ ...prev, [item.id]: !!value }));
//                             }}
//                             aria-label={`Select row ${index}`}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             className={
//                               item.status === "OPEN"
//                                 ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-950 dark:text-red-400"
//                                 : "bg-green-100 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-400"
//                             }
//                           >
//                             {item.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell className="whitespace-nowrap">{item.waktu_temuan}</TableCell>
//                         <TableCell>{item.nama_pelapor}</TableCell>
//                         <TableCell>{item.department_pelapor}</TableCell>
//                         <TableCell>{item.jabatan_pelapor}</TableCell>
//                         <TableCell>{item.lokasi_temuan}</TableCell>
//                         <TableCell>{item.detail_lokasi_temuan}</TableCell>
//                         <TableCell>{item.type_observasi}</TableCell>
//                         <TableCell>
//                           <div className="flex items-center gap-1">
//                             <Button
//                               variant="eye"
//                               onClick={() => router.push(`/observasi/${item.id}`)}
//                               className="text-primary underline-offset-4 hover:underline cursor-pointer font-medium border-2 shadow"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </Button>
//                             {isAdmin && (
//                               <>
//                                 <Button
//                                   variant="link"
//                                   onClick={() => handleEdit(item.id)}
//                                   disabled={isLoadingEdit}
//                                   className="border flex cursor-pointer items-center justify-center rounded-sm p-2 transition-colors bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
//                                 >
//                                   {isLoadingEdit ? (
//                                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                                   ) : (
//                                     <Pencil className="w-4 h-4 text-white" />
//                                   )}
//                                 </Button>
//                                 <Button
//                                   variant="link"
//                                   onClick={() => {
//                                     setDeletingItem(item);
//                                     setDeleteError("");
//                                     setDeleteOpen(true);
//                                   }}
//                                   className="border flex cursor-pointer items-center justify-center rounded-sm p-2 transition-colors bg-red-500 hover:bg-red-600"
//                                 >
//                                   <Trash2 className="w-4 h-4 text-white" />
//                                 </Button>
//                               </>
//                             )}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//             {editItem && (
//               <UpdateObservasiForm
//                 id={editItem.id}
//                 type_observasi={editItem.type_observasi}
//                 initialData={editItem}
//                 open={editOpen}
//                 onOpenChange={(val) => {
//                   setEditOpen(val);
//                   if (!val) setEditItem(null);
//                 }}
//                 onSuccess={() => {
//                   setEditOpen(false);
//                   setEditItem(null);
//                   fetchChartData(dateRange, periode);
//                   setListState((prev) => ({ ...prev, loading: true, error: null }));
//                   fetchListData(debouncedSearch, page, pageSize, columnDateRange, periode, filters, sortConfig);
//                 }}
//               />
//             )}

//             <AlertDialog open={deleteOpen} onOpenChange={(open) => {
//               if (!open) {
//                 setDeleteOpen(false);
//                 setDeletingItem(null);
//                 setDeleteError("");
//               }
//             }}>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Hapus Observasi</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     Apakah Anda yakin ingin menghapus observasi dari{" "}
//                     <span className="font-semibold text-foreground">
//                       {deletingItem?.nama_pelapor}
//                     </span>{" "}
//                     pada{" "}
//                     <span className="font-semibold text-foreground">
//                       {deletingItem?.waktu_temuan}
//                     </span>
//                     ? Tindakan ini tidak dapat dibatalkan.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 {deleteError && (
//                   <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md" role="alert">
//                     {deleteError}
//                   </div>
//                 )}
//                 <AlertDialogFooter>
//                   <AlertDialogCancel className="cursor-pointer" disabled={isDeleting}>
//                     Batal
//                   </AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={handleDelete}
//                     disabled={isDeleting}
//                     className="cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-red-600"
//                   >
//                     {isDeleting ? (
//                       <span className="flex items-center gap-2">
//                         <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                         Menghapus...
//                       </span>
//                     ) : (
//                       "Hapus"
//                     )}
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>

//             <TablePagination
//               selectedRowsFromCurrentPage={selectedRowsFromCurrentPage}
//               currentPageDataLength={sortedData.length}
//               totalSelectedRows={selectedRows}
//               onClearSelection={() => setRowSelection({})}
//               currentPage={page}
//               totalPages={totalPages}
//               pageSize={pageSize}
//               onPageChange={(p) => setPage(p)}
//               onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
//               loading={loading}
//               pageSizeOptions={[10, 25, 50, 100, -1]}
//               showSelection={true}
//               showPageSizeSelector={true}
//             />
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }