import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

interface StrOption {
  value: string;
  label: string;
}

interface FormComboboxProps {
  value: string;
  onValueChange: (val: string | null) => void;
  options: StrOption[];
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  emptyText?: string;
  readOnly?: boolean;
}

export function FormCombobox({
  value,
  onValueChange,
  options,
  placeholder = "Pilih opsi",
  disabled = false,
  hasError = false,
  emptyText = "Tidak ditemukan.",
}: FormComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between cursor-pointer font-normal",
            !value && "text-muted-foreground",
            hasError && "border-red-500"
          )}
        >
          <span className="truncate flex-1 text-left block">
            {selectedLabel ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align="start"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Command className="max-h-60">
          <CommandInput placeholder="Search data..." className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  className="cursor-pointer"
                  onSelect={() => {
                    onValueChange(opt.value === value ? null : opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
