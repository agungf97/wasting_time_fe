import { LucideIcon } from "lucide-react";

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

export interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export type CalendarView = "date" | "month" | "year";

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

export interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onChange: (dateRange: DateRange | undefined) => void;
  onReset?: () => void;
  className?: string;
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

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type CollapseMenuButtonProps = {
  icon: LucideIcon | string;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
};

export interface ContentLayoutProps {
  children: React.ReactNode;
}

export interface MenuProps {
  isOpen: boolean | undefined;
}

export interface NotificationAction {
  action: string;
  title: string;
}

export interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  renotify?: boolean;
  actions?: NotificationAction[];
}

export interface StrOption {
  value: string;
  label: string;
}
