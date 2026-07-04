import { z } from "zod";

export type CalendarView = "date" | "month" | "year";

export interface CustomCalendarContentProps {
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  yearRange: [number, number];
  dateRange: DateRange | undefined;
  onChange: (dateRange: DateRange | undefined) => void;
  tempDateRange?: DateRange | undefined;
  handleDateSelect?: (dateRange: DateRange | undefined) => void;
}

export interface CustomCalendarNavProps {
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  currentYear: number;
  setCurrentYear: (year: number) => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
}

export interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onChange: (dateRange: DateRange | undefined) => void;
  onReset?: () => void;
  showResetButton?: boolean;
  className?: string;
}

export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

export interface TableHeadDateRangeFilterProps {
  label: string;
  dateRange: DateRange | undefined;
  onChange: (dateRange: DateRange | undefined) => void;
  onSort?: (direction: "asc" | "desc" | null) => void;
  onReset?: () => void;
}

export interface TableHeadFilterProps {
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
  onSort?: (direction: "asc" | "desc" | null) => void;
  hideFilter?: boolean;
  onReset?: () => void;
}

export interface TablePaginationProps {
  selectedRowsFromCurrentPage: number;
  currentPageDataLength: number;
  totalSelectedRows: number;
  onClearSelection: () => void;

  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  loading?: boolean;

  pageSizeOptions?: number[];
  showSelection?: boolean;
  showPageSizeSelector?: boolean;
}

export type ProductType = {
  id: string | number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;
};

export type ProductsType = ProductType[];

export type CartItemType = ProductType & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type CartItemsType = CartItemType[];

export type CartStoreStateType = {
  cart: CartItemsType;
  hasHydrated: boolean;
};

export type CartStoreActionsType = {
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
};

export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z.email().min(1, "Email is required!"),
  phone: z
    .string()
    .min(7, "Phone number must be between 7 and 10 digits!")
    .max(10, "Phone number must be between 7 and 10 digits!")
    .regex(/^\d+$/, "Phone number must contain only numbers!"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "City is required!"),
});

export type ShippingFormInputs = z.infer<typeof shippingFormSchema>;

export const paymentFormSchema = z.object({
  cardHolder: z.string().min(1, "Card holder is required!"),
  cardNumber: z
    .string()
    .min(16, "Card Number is required!")
    .max(16, "Card Number is required!"),
  expirationDate: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Expiration date must be in MM/YY format!",
    ),
  cvv: z.string().min(3, "CVV is required!").max(3, "CVV is required!"),
});

export type PaymentFormInputs = z.infer<typeof paymentFormSchema>;
