'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Search, MoreHorizontal, X, FilePlus, EyeOff, Eye } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeadFilter } from "@/components/admin/table-head-filter";
import { TablePagination } from "@/components/admin/table-pagination";

interface Product {
    id: number;
    name: string;
    email: string;
    password: string;
    roleId: number;
    departmentId: number;
    jabatanId: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ROLES = [
    { id: 1, roleName: "ADMIN" },
    { id: 2, roleName: "USER" },
    { id: 3, roleName: "MANAGER" },
];

const MOCK_DEPARTMENTS = [
    { id: 1, departmentName: "Engineering" },
    { id: 2, departmentName: "Marketing" },
    { id: 3, departmentName: "Finance" },
];

const MOCK_JABATANS = [
    { id: 1, jabatanName: "Frontend Developer", departmentId: 1 },
    { id: 2, jabatanName: "Backend Developer", departmentId: 1 },
    { id: 3, jabatanName: "Marketing Specialist", departmentId: 2 },
    { id: 4, jabatanName: "Finance Analyst", departmentId: 3 },
];

const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: "BUDI SANTOSO", email: "budi@example.com", password: "", roleId: 1, departmentId: 1, jabatanId: 1 },
    { id: 2, name: "SITI RAHAYU", email: "siti@example.com", password: "", roleId: 2, departmentId: 2, jabatanId: 3 },
    { id: 3, name: "AGUS PRASETYO", email: "agus@example.com", password: "", roleId: 3, departmentId: 3, jabatanId: 4 },
    { id: 4, name: "DEWI KUSUMA", email: "dewi@example.com", password: "", roleId: 2, departmentId: 1, jabatanId: 2 },
    { id: 5, name: "RIZKY MAULANA", email: "rizky@example.com", password: "", roleId: 2, departmentId: 2, jabatanId: 3 },
];

// Simulasi role: ganti "ADMIN" menjadi "USER" untuk menyembunyikan tombol aksi admin
const CURRENT_USER_ROLE = "ADMIN";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductsTable() {
    const [allData, setAllData] = useState<Product[]>(MOCK_PRODUCTS);
    const [selectedProducts, setSelectedProducts] = useState<Product | null>(null);
    const [productsToDelete, setProductsToDelete] = useState<Product | null>(null);
    const [roles] = useState(MOCK_ROLES);
    const [departments] = useState(MOCK_DEPARTMENTS);
    const [jabatans] = useState(MOCK_JABATANS);
    const [showPassword, setShowPassword] = useState(false);
    const [loading] = useState(false);
    const [search, setSearch] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [open, setOpen] = useState(false);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    // Form state untuk tambah user
    const [addForm, setAddForm] = useState({
        name: "",
        email: "",
        password: "",
        roleId: "",
        departmentId: "",
        jabatanId: "",
    });

    // Form state untuk edit user
    const [editFormData, setEditFormData] = useState({
        id: 0,
        name: "",
        email: "",
        roleId: "",
        departmentId: "",
        jabatanId: "",
    });

    const [sortConfig, setSortConfig] = useState<{
        field: keyof Product | null;
        direction: 'asc' | 'desc' | null;
    }>({ field: null, direction: null });

    const [filters, setFilters] = useState({
        name: [] as string[],
        email: [] as string[],
        roleId: [] as string[],
        departmentId: [] as string[],
        jabatanId: [] as string[],
    });

    const handleSort = (field: keyof Product) => (direction: 'asc' | 'desc' | null) => {
        setSortConfig({ field, direction });
    };

    const filteredData = useMemo(() => {
        return allData.filter(item => {
            const matchesSearch = search === '' ||
                Object.values(item).some(value =>
                    value?.toString().toLowerCase().includes(search.toLowerCase())
                );

            const matchesFilters = Object.entries(filters).every(([key, selectedValues]) => {
                if (selectedValues.length === 0) return true;
                switch (key) {
                    case 'roleId': {
                        const roleName = roles.find(rl => rl.id === item.roleId)?.roleName ?? 'Unknown';
                        return selectedValues.includes(roleName);
                    }
                    case 'departmentId': {
                        const deptName = departments.find(d => d.id === item.departmentId)?.departmentName ?? 'Unknown';
                        return selectedValues.includes(deptName);
                    }
                    case 'jabatanId': {
                        const jabName = jabatans.find(j => j.id === item.jabatanId)?.jabatanName ?? 'Unknown';
                        return selectedValues.includes(jabName);
                    }
                    default: {
                        const itemValue = item[key as keyof Product]?.toString() || "";
                        return selectedValues.includes(itemValue);
                    }
                }
            });

            return matchesSearch && matchesFilters;
        }).sort((a, b) => {
            if (!sortConfig.field || !sortConfig.direction) return 0;
            const valueA = (a[sortConfig.field] ?? '').toString().toLowerCase();
            const valueB = (b[sortConfig.field] ?? '').toString().toLowerCase();
            return sortConfig.direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });
    }, [allData, search, filters, sortConfig, roles, departments, jabatans]);

    const totalPages = Math.ceil(filteredData.length / (pageSize === -1 ? 1 : pageSize));

    const currentPageData = useMemo(() => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = pageSize === -1 ? filteredData.length : startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, page, pageSize]);

    const selectedRows = Object.values(rowSelection).filter(Boolean).length;
    const selectedRowsFromCurrentPage = Object.entries(rowSelection)
        .filter(([id, selected]) => selected && currentPageData.some(item => item.id.toString() === id))
        .length;

    const isAllFiltersEmpty = Object.values(filters).every(value => value.length === 0);

    const getUniqueOptions = (field: keyof Product): string[] => {
        switch (field) {
            case 'roleId':
                return Array.from(new Set(allData.map(item => roles.find(r => r.id === item.roleId)?.roleName ?? 'Unknown')));
            case 'departmentId':
                return Array.from(new Set(allData.map(item => departments.find(d => d.id === item.departmentId)?.departmentName ?? 'Unknown')));
            case 'jabatanId':
                return Array.from(new Set(allData.map(item => jabatans.find(j => j.id === item.jabatanId)?.jabatanName ?? 'Unknown')));
            default:
                return Array.from(new Set(allData.map(item => item[field]?.toString()).filter((v): v is string => v !== undefined)));
        }
    };

    const handleDeleteClick = (product: Product) => {
        setProductsToDelete(product);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!productsToDelete) return;
        if (productsToDelete.name.includes('selected items')) {
            const selectedIds = Object.entries(rowSelection).filter(([, v]) => v).map(([id]) => Number(id));
            setAllData(prev => prev.filter(u => !selectedIds.includes(u.id)));
            setRowSelection({});
        } else {
            setAllData(prev => prev.filter(u => u.id !== productsToDelete.id));
        }
        setDeleteOpen(false);
        setProductsToDelete(null);
    };

    const handleDeleteSelected = () => {
        setDeleteOpen(true);
        setProductsToDelete({
            id: 0,
            name: `${selectedRows} selected items`,
            email: "",
            password: "",
            roleId: 0,
            departmentId: 0,
            jabatanId: 0,
        });
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newProduct: Product = {
            id: allData.length > 0 ? Math.max(...allData.map(p => p.id)) + 1 : 1,
            name: addForm.name,
            email: addForm.email,
            password: addForm.password,
            roleId: Number(addForm.roleId),
            departmentId: Number(addForm.departmentId),
            jabatanId: Number(addForm.jabatanId),
        };
        setAllData(prev => [...prev, newProduct]);
        setAddForm({ name: "", email: "", password: "", roleId: "", departmentId: "", jabatanId: "" });
        setOpen(false);
    };

    const handleEditClick = (product: Product) => {
        setSelectedProducts(product);
        setEditFormData({
            id: product.id,
            name: product.name,
            email: product.email,
            roleId: product.roleId.toString(),
            departmentId: product.departmentId.toString(),
            jabatanId: product.jabatanId.toString(),
        });
        setEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAllData(prev => prev.map(u =>
            u.id === editFormData.id
                ? { ...u, name: editFormData.name, email: editFormData.email, roleId: Number(editFormData.roleId), departmentId: Number(editFormData.departmentId), jabatanId: Number(editFormData.jabatanId) }
                : u
        ));
        setEditOpen(false);
    };

    const isAdmin = CURRENT_USER_ROLE === "ADMIN";

    return (
        <div className="space-y-4">
            <div className="md:flex justify-between space-y-4 md:space-y-0">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari data..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 pr-8"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <div className="md:flex justify-between gap-2 items-center space-y-4 md:space-y-0">
                    <div className="flex justify-end flex-wrap md:flex-nowrap items-center gap-2">
                        {/* Reset Filter */}
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-fit justify-start md:px-2 cursor-pointer"
                            onClick={() => {
                                setFilters({ name: [], email: [], roleId: [], departmentId: [], jabatanId: [] });
                                setSortConfig({ field: null, direction: null });
                            }}
                            disabled={isAllFiltersEmpty && !sortConfig.field}
                        >
                            <X className="h-4 w-4" />
                            Reset Filter
                        </Button>

                        {/* Delete Selected (admin only) */}
                        {isAdmin && (
                            <Button
                                variant="destructive"
                                size="lg"
                                onClick={handleDeleteSelected}
                                disabled={selectedRows === 0}
                                className="cursor-pointer"
                            >
                                Delete ({selectedRows})
                            </Button>
                        )}

                        {/* Tambah Product Dialog */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="lg" className="cursor-pointer">
                                    <FilePlus /> Products
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Tambah Data Products</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddSubmit} className="space-y-6">
                                    <div className="md:grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nama</label>
                                            <Input
                                                placeholder="Enter name"
                                                value={addForm.name}
                                                onChange={(e) => setAddForm(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input
                                                type="email"
                                                placeholder="Enter email"
                                                value={addForm.email}
                                                onChange={(e) => setAddForm(p => ({ ...p, email: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter password"
                                                    value={addForm.password}
                                                    onChange={(e) => setAddForm(p => ({ ...p, password: e.target.value }))}
                                                    required
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-0.5 top-0.5 h-8 w-8"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Pilih Role</label>
                                            <Select value={addForm.roleId} onValueChange={(v) => setAddForm(p => ({ ...p, roleId: v }))}>
                                                <SelectTrigger className="w-full cursor-pointer">
                                                    <SelectValue placeholder="Pilih role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map(role => (
                                                        <SelectItem key={role.id} value={role.id.toString()} className="cursor-pointer">
                                                            {role.roleName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Pilih Department</label>
                                            <Select
                                                value={addForm.departmentId}
                                                onValueChange={(v) => setAddForm(p => ({ ...p, departmentId: v, jabatanId: "" }))}
                                            >
                                                <SelectTrigger className="w-full cursor-pointer">
                                                    <SelectValue placeholder="Pilih department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {departments.map(dept => (
                                                        <SelectItem key={dept.id} value={dept.id.toString()} className="cursor-pointer">
                                                            {dept.departmentName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Pilih Jabatan</label>
                                            <Select
                                                value={addForm.jabatanId}
                                                onValueChange={(v) => setAddForm(p => ({ ...p, jabatanId: v }))}
                                                disabled={!addForm.departmentId}
                                            >
                                                <SelectTrigger className="w-full cursor-pointer">
                                                    <SelectValue placeholder="Pilih jabatan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {jabatans
                                                        .filter(j => j.departmentId === Number(addForm.departmentId))
                                                        .map(jabatan => (
                                                            <SelectItem key={jabatan.id} value={jabatan.id.toString()} className="cursor-pointer">
                                                                {jabatan.jabatanName}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full cursor-pointer">
                                        Buat Pengguna
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className={cn("rounded-md border transition-opacity duration-200 text-xs")}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox
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
                                label="Nama"
                                values={filters.name}
                                options={getUniqueOptions("name")}
                                onChange={(values) => setFilters(prev => ({ ...prev, name: values }))}
                                onSort={handleSort('name')}
                            />
                            <TableHeadFilter
                                label="Email"
                                values={filters.email}
                                options={getUniqueOptions("email")}
                                onChange={(values) => setFilters(prev => ({ ...prev, email: values }))}
                                onSort={handleSort('email')}
                            />
                            <TableHeadFilter
                                label="Role User"
                                values={filters.roleId}
                                options={getUniqueOptions("roleId")}
                                onChange={(values) => setFilters(prev => ({ ...prev, roleId: values }))}
                                onSort={handleSort('roleId')}
                            />
                            <TableHeadFilter
                                label="Department"
                                values={filters.departmentId}
                                options={getUniqueOptions("departmentId")}
                                onChange={(values) => setFilters(prev => ({ ...prev, departmentId: values }))}
                                onSort={handleSort('departmentId')}
                            />
                            <TableHeadFilter
                                label="Jabatan"
                                values={filters.jabatanId}
                                options={getUniqueOptions("jabatanId")}
                                onChange={(values) => setFilters(prev => ({ ...prev, jabatanId: values }))}
                                onSort={handleSort('jabatanId')}
                            />
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="py-10 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span className="text-sm text-muted-foreground">Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <span className="text-sm text-muted-foreground">No results found.</span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPageData.map((user, index) => {
                                const role = roles.find(r => r.id === user.roleId);
                                const department = departments.find(d => d.id === user.departmentId);
                                const jabatan = jabatans.find(j => j.id === user.jabatanId);

                                return (
                                    <TableRow
                                        key={user.id}
                                        className={cn(
                                            "transition-colors duration-200 hover:bg-muted/50",
                                            rowSelection[user.id] && "bg-muted"
                                        )}
                                    >
                                        <TableCell className="w-12">
                                            <Checkbox
                                                checked={rowSelection[user.id] ?? false}
                                                onCheckedChange={(value) => {
                                                    setRowSelection(prev => ({ ...prev, [user.id]: !!value }));
                                                }}
                                                aria-label={`Select row ${index}`}
                                            />
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{role?.roleName ?? "Unknown"}</TableCell>
                                        <TableCell>{department?.departmentName ?? "Unknown"}</TableCell>
                                        <TableCell>{jabatan?.jabatanName ?? "Unknown"}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {isAdmin && (
                                                        <>
                                                            <DropdownMenuItem
                                                                className="cursor-pointer"
                                                                onClick={() => handleEditClick(user)}
                                                            >
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive cursor-pointer"
                                                                onClick={() => handleDeleteClick(user)}
                                                            >
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Edit Dialog ── */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Products</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-6">
                        <div className="md:grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama</label>
                                <Input
                                    placeholder="Enter name"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData(p => ({ ...p, email: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pilih Role</label>
                                <Select
                                    value={editFormData.roleId}
                                    onValueChange={(v) => setEditFormData(p => ({ ...p, roleId: v }))}
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.id.toString()} className="cursor-pointer">
                                                {role.roleName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pilih Department</label>
                                <Select
                                    value={editFormData.departmentId}
                                    onValueChange={(v) => setEditFormData(p => ({ ...p, departmentId: v, jabatanId: "" }))}
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue placeholder="Pilih department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id.toString()} className="cursor-pointer">
                                                {dept.departmentName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pilih Jabatan</label>
                                <Select
                                    value={editFormData.jabatanId}
                                    onValueChange={(v) => setEditFormData(p => ({ ...p, jabatanId: v }))}
                                    disabled={!editFormData.departmentId}
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue placeholder="Pilih jabatan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jabatans
                                            .filter(j => j.departmentId === Number(editFormData.departmentId))
                                            .map(jabatan => (
                                                <SelectItem key={jabatan.id} value={jabatan.id.toString()} className="cursor-pointer">
                                                    {jabatan.jabatanName}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button type="submit" className="w-full cursor-pointer">
                            Edit Pengguna
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ── Delete Dialog ── */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {productsToDelete?.name?.includes('selected items') ? "Delete Selected Products" : "Delete Product"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p>Apakah kamu yakin akan menghapus data ini?</p>
                        <p className="font-medium">{productsToDelete?.name}</p>
                        <div className="flex justify-end space-x-2">
                            <Button className="cursor-pointer" variant="outline" onClick={() => setDeleteOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" className="cursor-pointer" onClick={handleDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Pagination ── */}
            <TablePagination
                selectedRowsFromCurrentPage={selectedRowsFromCurrentPage}
                currentPageDataLength={currentPageData.length}
                totalSelectedRows={selectedRows}
                onClearSelection={() => setRowSelection({})}
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(newPageSize) => {
                    setPageSize(newPageSize);
                    setPage(1);
                }}
                loading={loading}
                pageSizeOptions={[10, 25, 50, 100, -1]}
                showSelection={true}
                showPageSizeSelector={true}
            />
        </div>
    );
}