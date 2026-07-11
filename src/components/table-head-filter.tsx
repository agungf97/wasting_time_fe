import { useState } from "react";
import { Filter, ArrowUpDown, ArrowDownUp, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { TableHeadDateRangeFilterProps, TableHeadFilterProps } from "@/lib/interface/custom";
import { DateRangePicker } from "./date-range-picker";
import { TableHead } from "./ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandInput } from "./ui/command";

export const TableHeadFilter = ({
    label,
    values,
    options,
    onChange,
    onSort,
    hideFilter = false
}: TableHeadFilterProps) => {
    const [open, setOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
    const [search, setSearch] = useState("");

    const handleSort = () => {
        const nextDirection = sortDirection === null ? 'asc' :
            sortDirection === 'asc' ? 'desc' : null;
        setSortDirection(nextDirection);
        if (onSort) onSort(nextDirection);
    };

    const isActive = values.length > 0 || sortDirection !== null;

    const filteredOptions = options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <TableHead>
            <div className="flex items-center gap-1">
                {hideFilter ? (
                    <span>{label}</span>
                ) : (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="filter" className="h-8 p-0 cursor-pointer">
                                <div className="flex items-center gap-1">
                                    {label}
                                    <Filter className="h-4 w-4" />
                                    {isActive && (
                                        <span className="ml-1 bg-primary w-2 h-2" />
                                    )}
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0 w-62.5"
                            align="end"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                        >
                            <Command>
                                <CommandInput
                                    placeholder="Cari data..."
                                    value={search}
                                    onValueChange={setSearch}
                                />
                                <CommandList className="max-h-80">
                                    <CommandGroup>
                                        <CommandItem
                                            className="justify-between cursor-pointer"
                                            onSelect={handleSort}
                                        >
                                            Sort
                                            {sortDirection === 'asc' && <ArrowUpDown className="h-4 w-4" />}
                                            {sortDirection === 'desc' && <ArrowDownUp className="h-4 w-4" />}
                                            {sortDirection === null && <ArrowUpDown className="h-4 w-4 opacity-30" />}
                                        </CommandItem>
                                    </CommandGroup>

                                    <Separator />

                                    <CommandGroup>
                                        <CommandEmpty>Data tidak ditemukan.</CommandEmpty>
                                        {filteredOptions.map((option) => (
                                            <CommandItem
                                                key={option}
                                                value={option}
                                                className="cursor-pointer"
                                                onSelect={() => {
                                                    const newValues = values.includes(option)
                                                        ? values.filter(v => v !== option)
                                                        : [...values, option];
                                                    onChange(newValues);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        className="cursor-pointer"
                                                        checked={values.includes(option)}
                                                        readOnly
                                                    />
                                                    {option}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
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
    onReset
}: TableHeadDateRangeFilterProps) => {
    const [open, setOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

    const handleSort = () => {
        const nextDirection = sortDirection === null ? 'asc' :
            sortDirection === 'asc' ? 'desc' : null;
        setSortDirection(nextDirection);
        if (onSort) onSort(nextDirection);
    };

    const handleReset = () => {
        onChange(undefined);
        setSortDirection(null);
        if (onSort) onSort(null);
        if (onReset) onReset();
    };

    const isActive = !!dateRange?.from || sortDirection !== null;

    return (
        <TableHead>
            <div className="flex items-center gap-1">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="filter" className="h-8 p-0">
                            <div className="flex items-center gap-1">
                                {label}
                                <Calendar className="h-4 w-4" />
                                {isActive && (
                                    <span className="ml-1 bg-primary w-2 h-2" />
                                )}
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="p-0 w-auto"
                        align="end"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        <Command>
                            <CommandList className="max-h-124">
                                <CommandGroup>
                                    <CommandItem
                                        className="justify-between cursor-pointer"
                                        onSelect={() => {
                                            handleSort();
                                        }}
                                    >
                                        Sort
                                        {sortDirection === 'asc' && <ArrowUpDown className="h-4 w-4" />}
                                        {sortDirection === 'desc' && <ArrowDownUp className="h-4 w-4" />}
                                        {sortDirection === null && <ArrowUpDown className="h-4 w-4 opacity-30" />}
                                    </CommandItem>
                                </CommandGroup>

                                <Separator />

                                <div className="p-2">
                                    <DateRangePicker
                                        dateRange={dateRange}
                                        onChange={onChange}
                                        onReset={handleReset}
                                        className="border-0"
                                    />
                                </div>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </TableHead>
    );
};