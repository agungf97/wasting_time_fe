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
import { useState, useMemo, useEffect } from "react";
import { Search, MoreHorizontal, X, FilePlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeadFilter } from "@/components/admin/table-head-filter";
import { TablePagination } from "@/components/admin/table-pagination";
import {
  getUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
  deleteMultipleUsersAction,
} from "@/actions/user";
import { User } from "@/lib/types";

const ROLE_OPTIONS = ["Admin", "Customer", "User"];

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalData, setTotalData] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const [addForm, setAddForm] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    role: "",
  });

  const [editForm, setEditForm] = useState({
    email: "",
    full_name: "",
    phone_number: "",
    role: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    field: keyof User | null;
    direction: "asc" | "desc" | null;
  }>({ field: null, direction: null });

  const [filters, setFilters] = useState({
    full_name: [] as string[],
    email: [] as string[],
    role: [] as string[],
  });

    const [refreshKey, setRefreshKey] = useState(0);
    const triggerRefresh = () => setRefreshKey((k) => k + 1);

    useEffect(() => {
    let cancelled = false;

    const load = async () => {
        setLoading(true);
        setError(null);

        const result = await getUsersAction({
        page,
        limit: pageSize === -1 ? 9999 : pageSize,
        search: search || undefined,
        });

        if (cancelled) return;

        if (result.error) {
        setError(result.error);
        } else if (result.data) {
        setUsers(result.data.data ?? []);
        setTotalData(result.data.total ?? 0);
        }

        setLoading(false);
    };

    load();

    return () => {
        cancelled = true;
    };
    }, [page, pageSize, search, refreshKey]);

  const filteredData = useMemo(() => {
    return users
      .filter((item) => {
        const matchesFilters = Object.entries(filters).every(
          ([key, selectedValues]) => {
            if (selectedValues.length === 0) return true;
            const val = item[key as keyof User]?.toString() ?? "";
            return selectedValues.includes(val);
          }
        );
        return matchesFilters;
      })
      .sort((a, b) => {
        if (!sortConfig.field || !sortConfig.direction) return 0;
        const valA = (a[sortConfig.field] ?? "").toString().toLowerCase();
        const valB = (b[sortConfig.field] ?? "").toString().toLowerCase();
        return sortConfig.direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
  }, [users, filters, sortConfig]);

  const totalPages = Math.ceil(totalData / (pageSize === -1 ? totalData || 1 : pageSize));

  const selectedRows = Object.values(rowSelection).filter(Boolean).length;
  const selectedRowsFromCurrentPage = Object.entries(rowSelection).filter(
    ([id, selected]) => selected && filteredData.some((u) => u.id.toString() === id)
  ).length;

  const isAllFiltersEmpty = Object.values(filters).every((v) => v.length === 0);

  const getUniqueOptions = (field: keyof User): string[] =>
    Array.from(new Set(users.map((u) => u[field]?.toString() ?? "").filter(Boolean)));

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    const result = await createUserAction(addForm);

    if (result.error) {
      setFormError(result.error);
    } else {
      setAddForm({ username: "", email: "", password: "", full_name: "", phone_number: "", role: "" });
      setOpen(false);
      triggerRefresh();
    }

    setFormLoading(false);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      role: user.role,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormError(null);
    setFormLoading(true);

    const result = await updateUserAction(selectedUser.email, editForm);

    if (result.error) {
      setFormError(result.error);
    } else {
      setEditOpen(false);
      triggerRefresh();
    }

    setFormLoading(false);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setFormLoading(true);

    const result = await deleteUserAction(userToDelete.email);

    if (result.error) {
      setFormError(result.error);
    } else {
      setDeleteOpen(false);
      setUserToDelete(null);
      triggerRefresh();
    }

    setFormLoading(false);
  };

  const handleDeleteSelected = async () => {
    const emails = Object.entries(rowSelection)
      .filter(([, v]) => v)
      .map(([id]) => users.find((u) => u.id.toString() === id)?.email)
      .filter(Boolean) as string[];

    setFormLoading(true);
    const result = await deleteMultipleUsersAction(emails);

    if (result.error) {
      setError(result.error);
    } else {
      setRowSelection({});
      triggerRefresh();
    }

    setFormLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="md:flex justify-between space-y-4 md:space-y-0">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari data..."
            value={search}
            onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
            }}
            className="pl-8 pr-8"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="lg"
            className="w-fit cursor-pointer"
            onClick={() => {
              setFilters({ full_name: [], email: [], role: [] });
              setSortConfig({ field: null, direction: null });
            }}
            disabled={isAllFiltersEmpty && !sortConfig.field}
          >
            <X className="h-4 w-4" />
            Reset Filter
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleDeleteSelected}
            disabled={selectedRows === 0 || formLoading}
            className="cursor-pointer"
          >
            Delete ({selectedRows})
          </Button>

          {/* ── Add User Dialog ── */}
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); setFormError(null); }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="cursor-pointer">
                <FilePlus /> Users
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tambah User</DialogTitle>
              </DialogHeader>
              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="md:grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <Input
                      placeholder="John Doe"
                      value={addForm.full_name}
                      onChange={(e) => setAddForm((p) => ({ ...p, full_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      placeholder="johndoe"
                      value={addForm.username}
                      onChange={(e) => setAddForm((p) => ({ ...p, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={addForm.email}
                      onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">No. HP</label>
                    <Input
                      placeholder="081234567890"
                      value={addForm.phone_number}
                      onChange={(e) => setAddForm((p) => ({ ...p, phone_number: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={addForm.password}
                      onChange={(e) => setAddForm((p) => ({ ...p, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select value={addForm.role} onValueChange={(v) => setAddForm((p) => ({ ...p, role: v }))}>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((r) => (
                          <SelectItem key={r} value={r} className="cursor-pointer">{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full cursor-pointer" disabled={formLoading}>
                  {formLoading ? "Menyimpan..." : "Buat User"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className={cn("rounded-md border text-xs transition-opacity duration-200", loading && "opacity-50")}>
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
                />
              </TableHead>
              <TableHeadFilter
                label="Nama"
                values={filters.full_name}
                options={getUniqueOptions("full_name")}
                onChange={(values) => setFilters((p) => ({ ...p, full_name: values }))}
                onSort={(dir) => setSortConfig({ field: "full_name", direction: dir })}
              />
              <TableHeadFilter
                label="Email"
                values={filters.email}
                options={getUniqueOptions("email")}
                onChange={(values) => setFilters((p) => ({ ...p, email: values }))}
                onSort={(dir) => setSortConfig({ field: "email", direction: dir })}
              />
              <TableHead>No. HP</TableHead>
              <TableHeadFilter
                label="Role"
                values={filters.role}
                options={getUniqueOptions("role")}
                onChange={(values) => setFilters((p) => ({ ...p, role: values }))}
                onSort={(dir) => setSortConfig({ field: "role", direction: dir })}
              />
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    rowSelection[user.id] && "bg-muted"
                  )}
                >
                  <TableCell className="w-12">
                    <Checkbox
                      checked={rowSelection[user.id] ?? false}
                      onCheckedChange={(value) =>
                        setRowSelection((p) => ({ ...p, [user.id]: !!value }))
                      }
                      aria-label={`Select row ${index}`}
                    />
                  </TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); setFormError(null); }}>
        <DialogContent className="max-h-[80vh] w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="md:grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Lengkap</label>
                <Input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. HP</label>
                <Input
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone_number: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={editForm.role} onValueChange={(v) => setEditForm((p) => ({ ...p, role: v }))}>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r} className="cursor-pointer">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={formLoading}>
              {formLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Apakah kamu yakin ingin menghapus user ini?</p>
            <p className="font-medium">{userToDelete?.full_name} ({userToDelete?.email})</p>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)} className="cursor-pointer">
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={formLoading} className="cursor-pointer">
                {formLoading ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Pagination ── */}
      <TablePagination
        selectedRowsFromCurrentPage={selectedRowsFromCurrentPage}
        currentPageDataLength={filteredData.length}
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
        showSelection
        showPageSizeSelector
      />
    </div>
  );
}