'use client'

import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeadFilter } from "@/components/table-head-filter";
import TablePagination from "@/components/custom-pagination";
import { Users } from "@/lib/interface/user";
import { useDebounce } from "@/hooks/use-debounce";
import { getCustomerAction } from "@/actions/customer";

interface CustomerTableProps {
  initialData: Users[];
}

export default function CustomerTable({ initialData }: CustomerTableProps) {
    const [data, setData] = useState<Users[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    const [sortConfig, setSortConfig] = useState<{
        field: keyof Users | null;
        direction: 'asc' | 'desc' | null;
    }>({ field: null, direction: null });

    const [filters, setFilters] = useState({
        full_name: [] as string[],
        email: [] as string[],
        username: [] as string[],
        phone_number: [] as string[],
    });

    const fetchUsers = async (searchTerm?: string) => {
        setLoading(true);
        try {
            const { data: res, error } = await getCustomerAction(searchTerm);
            if (error) {
            console.error("Failed to fetch customers:", error);
            return;
            }
            setData(res ?? []);
        } catch (err) {
            console.error("Failed to fetch customers:", err);
        } finally {
            setLoading(false);
        }
    };

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setPage(1);
        fetchUsers(debouncedSearch);
    }, [debouncedSearch]);

    const handleSort = (field: keyof Users) => (direction: 'asc' | 'desc' | null) => {
        setSortConfig({ field, direction });
    };

    const isAllFiltersEmpty = Object.values(filters).every(v => v.length === 0);

    const getUniqueOptions = (field: keyof Users) => {
        return Array.from(new Set(
            data.map(item => item[field]?.toString()).filter((v): v is string => !!v)
        ));
    };

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesFilters = Object.entries(filters).every(([key, selectedValues]) => {
                if (selectedValues.length === 0) return true;
                return selectedValues.includes(item[key as keyof Users]?.toString() ?? '');
            });
            return matchesFilters;
        }).sort((a, b) => {
            if (!sortConfig.field || !sortConfig.direction) return 0;
            const vA = (a[sortConfig.field] ?? '').toString().toLowerCase();
            const vB = (b[sortConfig.field] ?? '').toString().toLowerCase();
            return sortConfig.direction === 'asc'
                ? vA.localeCompare(vB)
                : vB.localeCompare(vA);
        });
    }, [data, filters, sortConfig]);

    const currentPageData = useMemo(() => {
        const start = (page - 1) * pageSize;
        const end = pageSize === -1 ? filteredData.length : start + pageSize;
        return filteredData.slice(start, end);
    }, [filteredData, page, pageSize]);

    const totalPages = Math.ceil(filteredData.length / (pageSize === -1 ? 1 : pageSize));
    const selectedRows = Object.values(rowSelection).filter(Boolean).length;
    const selectedRowsFromCurrentPage = Object.entries(rowSelection)
        .filter(([id, selected]) => selected && currentPageData.some(item => item.id === parseInt(id)))
        .length;

    return (
        <div className="space-y-4">
            <div className="md:flex justify-between space-y-4 md:space-y-0">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari data..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="pl-8 pr-8"
                    />
                    {search && (
                        <Button
                            variant="eye"
                            onClick={() => { setSearch(''); setPage(1); }}
                            className="absolute cursor-pointer right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                            type="button"
                        >
                            <XIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <div className="md:flex justify-between gap-2 items-center space-y-4 md:space-y-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-fit cursor-pointer"
                        onClick={() => {
                            setFilters({
                                full_name: [],
                                email: [],
                                username: [],
                                phone_number: [],
                            });
                            setSortConfig({ field: null, direction: null });
                        }}
                        disabled={isAllFiltersEmpty && !sortConfig.field}
                    >
                        <XIcon className="h-4 w-4 mr-1" />
                        Reset Filter
                    </Button>
                </div>
            </div>

            <div className="rounded-md border text-xs">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
                                    className="cursor-pointer"
                                    checked={filteredData.length > 0 && selectedRows === filteredData.length}
                                    onCheckedChange={(value) => {
                                        setRowSelection(
                                            value
                                                ? filteredData.reduce((acc, row) => ({ ...acc, [row.id]: true }), {})
                                                : {}
                                        );
                                    }}
                                    aria-label="Pilih Semua"
                                />
                            </TableHead>
                            <TableHeadFilter
                                label="Nama Lengkap"
                                values={filters.full_name}
                                options={getUniqueOptions("full_name")}
                                onChange={(values) => setFilters(prev => ({ ...prev, full_name: values }))}
                                onSort={handleSort('full_name')}
                            />
                            <TableHeadFilter
                                label="Email"
                                values={filters.email}
                                options={getUniqueOptions("email")}
                                onChange={(values) => setFilters(prev => ({ ...prev, email: values }))}
                                onSort={handleSort('email')} />
                            <TableHeadFilter
                                label="Username"
                                values={filters.username}
                                options={getUniqueOptions("username")}
                                onChange={(values) => setFilters(prev => ({ ...prev, username: values }))}
                                onSort={handleSort('username')} />
                            <TableHeadFilter
                                label="Phone Number"
                                values={filters.phone_number}
                                options={getUniqueOptions("phone_number")}
                                onChange={(values) => setFilters(prev => ({ ...prev, phone_number: values }))}
                                onSort={handleSort('phone_number')} />
                            <TableHead>Last Update</TableHead>
                            <TableHead>Last Login</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={9} className="py-10 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span className="text-sm text-muted-foreground">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    <span className="text-sm text-muted-foreground">No results found.</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPageData.map((user, index) => (
                                <TableRow
                                    key={user.id}
                                    className={cn(
                                        "transition-colors duration-200 hover:bg-muted/50",
                                        rowSelection[user.id] && "bg-muted"
                                    )}
                                >
                                    <TableCell className="w-12">
                                        <Checkbox
                                            className="cursor-pointer"
                                            checked={rowSelection[user.id] ?? false}
                                            onCheckedChange={(value) => {
                                                setRowSelection(prev => ({ ...prev, [user.id]: !!value }));
                                            }}
                                            aria-label={`Select row ${index}`}
                                        />
                                    </TableCell>
                                    <TableCell>{user.full_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.username ?? '-'}</TableCell>
                                    <TableCell>{user.phone_number ?? '-'}</TableCell>
                                    <TableCell>
                                        {user.date_time_update
                                            ? new Date(user.date_time_update).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })
                                            : '-'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {user.last_login
                                            ? new Date(user.last_login).toLocaleDateString('id-ID', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit',
                                            })
                                            : '-'
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <TablePagination
                selectedRowsFromCurrentPage={selectedRowsFromCurrentPage}
                currentPageDataLength={currentPageData.length}
                totalSelectedRows={selectedRows}
                onClearSelection={() => setRowSelection({})}
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(1); }}
                loading={loading}
                pageSizeOptions={[10, 25, 50, 100, -1]}
                showSelection={true}
                showPageSizeSelector={true}
            />
        </div>
    );
}