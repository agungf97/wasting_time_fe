import { useState } from "react";
import { Filter, X, ArrowUpDown, ArrowDownUp, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { TableHead } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TableHeadDateRangeFilterProps, TableHeadFilterProps } from "@/lib/interface";

export const TableHeadFilter = ({
    label,
    values,
    options,
    onChange,
    onSort,
    hideFilter = false,
}: TableHeadFilterProps) => {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    const [search, setSearch] = useState("");

    const handleSort = () => {
        const nextDirection = sortDirection === null ? 'asc' : sortDirection === 'asc' ? 'desc' : null;
        setSortDirection(nextDirection);
        onSort?.(nextDirection);
    };

    const handleReset = () => {
        onChange([]);
        setSortDirection(null);
        onSort?.(null);
    };

    const isActive = values.length > 0 || sortDirection !== null;

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <TableHead>
            <div className="flex items-center gap-1">
                {hideFilter ? (
                    <span>{label}</span>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="filter" className="h-8 p-0 cursor-pointer">
                                <div className="flex items-center gap-1">
                                    {label}
                                    <Filter className="h-4 w-4" />
                                    {isActive && <span className="ml-1 bg-primary w-2 h-2" />}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="max-h-75 w-62.5">
                            <DropdownMenuItem
                                onClick={handleReset}
                                disabled={!isActive}
                                className={cn(!isActive && "opacity-50")}
                            >
                                <Button variant="ghost" className="h-6 w-full cursor-pointer justify-start">
                                    <X className="h-4 w-4" />
                                    Reset
                                </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
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
                                            className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                                            type="button"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSort} className="justify-between cursor-pointer">
                                Sort
                                {sortDirection === 'asc' && <ArrowUpDown className="h-4 w-4" />}
                                {sortDirection === 'desc' && <ArrowDownUp className="h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="overflow-y-auto max-h-50">
                                {filteredOptions.map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onSelect={(e) => e.preventDefault()}
                                        onClick={() => {
                                            const newValues = values.includes(option)
                                                ? values.filter(v => v !== option)
                                                : [...values, option];
                                            onChange(newValues);
                                        }}
                                    >
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="cursor-pointer"
                                                checked={values.includes(option)}
                                                readOnly
                                            />
                                            {option}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </TableHead>
    );
};

export const TableHeadDateRangeFilter = ({
    label,
    dateRange,
    onChange,
    onSort,
    onReset,
}: TableHeadDateRangeFilterProps) => {
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    const handleSort = () => {
        const nextDirection = sortDirection === null ? 'asc' : sortDirection === 'asc' ? 'desc' : null;
        setSortDirection(nextDirection);
        onSort?.(nextDirection);
    };

    const handleReset = () => {
        onChange(undefined);
        setSortDirection(null);
        onSort?.(null);
        onReset?.();
    };

    const isActive = !!dateRange?.from || sortDirection !== null;

    return (
        <TableHead>
            <div className="flex items-center gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="filter" className="h-8 p-0">
                            <div className="flex items-center gap-1">
                                {label}
                                <Calendar className="h-4 w-4" />
                                {isActive && <span className="ml-1 bg-primary w-2 h-2" />}
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-auto p-0">
                        <div className="p-2">
                            <DropdownMenuItem onClick={handleSort} className="justify-between mb-2">
                                Sort
                                {sortDirection === 'asc' && <ArrowUpDown className="h-4 w-4" />}
                                {sortDirection === 'desc' && <ArrowDownUp className="h-4 w-4" />}
                            </DropdownMenuItem>
                            <Separator className="my-2" />
                            <div className="flex gap-2 text-sm text-muted-foreground px-1">
                                <span>
                                    {dateRange?.from ? dateRange.from.toLocaleDateString('id-ID') : "Dari tanggal"}
                                </span>
                                <span>—</span>
                                <span>
                                    {dateRange?.to ? dateRange.to.toLocaleDateString('id-ID') : "Sampai tanggal"}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 w-full cursor-pointer"
                                onClick={handleReset}
                                disabled={!isActive}
                            >
                                <X className="h-4 w-4 mr-1" /> Reset
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TableHead>
    );
};