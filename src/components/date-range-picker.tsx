import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { CalendarView, CustomCalendarContentProps, CustomCalendarNavProps, DateRangePickerProps, DateRange } from "@/lib/interface/custom";

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthViewProps {
  currentMonth: Date;
  onSelect: (index: number) => void;
}

const MonthView = ({ currentMonth, onSelect }: MonthViewProps) => (
  <div className="grid grid-cols-3 gap-2 p-2">
    {MONTHS.map((month, index) => (
      <button
        key={month}
        onClick={() => onSelect(index)}
        className={cn(
          "flex items-center justify-center p-2 rounded-md hover:bg-gray-100",
          currentMonth.getMonth() === index && "bg-gray-100 font-medium"
        )}
      >
        {month}
      </button>
    ))}
  </div>
);

interface YearViewProps {
  currentYear: number;
  yearRange: [number, number];
  onSelect: (year: number) => void;
}

const YearView = ({ currentYear, yearRange, onSelect }: YearViewProps) => (
  <div className="grid grid-cols-3 gap-2 p-2">
    {Array.from({ length: 9 }, (_, i) => yearRange[0] + i).map(year => (
      <button
        key={year}
        onClick={() => onSelect(year)}
        className={cn(
          "flex items-center justify-center p-2 rounded-md hover:bg-gray-100",
          currentYear === year && "bg-gray-100 font-medium"
        )}
      >
        {year}
      </button>
    ))}
  </div>
);

const CustomCalendarNav = ({
  currentView,
  setCurrentView,
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear,
  yearRange,
  setYearRange
}: CustomCalendarNavProps) => {
  const handleLabelClick = () => {
    if (currentView === 'date') {
      setCurrentView('month');
    } else if (currentView === 'month') {
      setCurrentView('year');
      const startYear = Math.floor(currentYear / 9) * 9;
      setYearRange([startYear, startYear + 8]);
    }
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
    setCurrentYear(newDate.getFullYear());
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
    setCurrentYear(newDate.getFullYear());
  };

  const goToPreviousYears = () => {
    const startYear = yearRange[0] - 9;
    setYearRange([startYear, startYear + 8]);
  };

  const goToNextYears = () => {
    const startYear = yearRange[0] + 9;
    setYearRange([startYear, startYear + 8]);
  };

  return (
    <div className="flex items-center justify-between px-1 py-1">
      {(currentView === 'date' || currentView === 'year') && (
        <Button
          variant="filter"
          type="button"
          className="p-1 rounded-md hover:bg-gray-100"
          onClick={currentView === 'date' ? goToPreviousMonth : goToPreviousYears}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="filter"
        type="button"
        onClick={handleLabelClick}
        className="flex-1 font-medium text-sm hover:bg-gray-100 rounded-md px-2 py-1"
      >
        {currentView === 'date' && (
          <span>{currentMonth.toLocaleString('default', { month: 'long' })} {currentYear}</span>
        )}
        {currentView === 'month' && <span>{currentYear}</span>}
        {currentView === 'year' && <span>{yearRange[0]} - {yearRange[1]}</span>}
      </Button>

      {(currentView === 'date' || currentView === 'year') && (
        <Button
          variant="filter"
          type="button"
          className="p-1 rounded-md hover:bg-gray-100"
          onClick={currentView === 'date' ? goToNextMonth : goToNextYears}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

const CustomCalendarContent = ({
  currentView,
  setCurrentView,
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear,
  yearRange,
  dateRange,
  onChange,
  tempDateRange,
  handleDateSelect
}: CustomCalendarContentProps) => {
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setCurrentView('date');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setCurrentYear(year);
    setCurrentView('month');
  };

  if (currentView === 'month') {
    return <MonthView currentMonth={currentMonth} onSelect={handleMonthSelect} />;
  }

  if (currentView === 'year') {
    return <YearView currentYear={currentYear} yearRange={yearRange} onSelect={handleYearSelect} />;
  }

  return (
    <CalendarComponent
      mode="range"
      defaultMonth={currentMonth}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      selected={tempDateRange ?? dateRange}
      onSelect={handleDateSelect ?? onChange}
      numberOfMonths={1}
      className="border"
      hideNavigation
      components={{
            MonthCaption: () => <></>
        }}
    />
  );
};

export const DateRangePicker = ({
  dateRange,
  onChange,
  className
}: DateRangePickerProps) => {
  const [currentView, setCurrentView] = useState<CalendarView>('date');
  const [currentMonth, setCurrentMonth] = useState<Date>(
    dateRange?.from ? new Date(dateRange.from) : new Date()
  );
  const [currentYear, setCurrentYear] = useState<number>(currentMonth.getFullYear());
  const startYear = Math.floor(currentYear / 9) * 9;
  const [yearRange, setYearRange] = useState<[number, number]>([startYear, startYear + 8]);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange);

  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setTempDateRange(selectedRange);
  };

  const handleApply = () => {
    onChange(tempDateRange);
    setCurrentView('date');
  };

  const handleCancel = () => {
    setTempDateRange(dateRange);
    setCurrentView('date');
  };

  const hasTempChanges = JSON.stringify(tempDateRange) !== JSON.stringify(dateRange);

  return (
    <div className={cn("w-auto space-y-2", className)}>
      <div className="font-medium text-sm px-3 pt-3">
        Rentang Tanggal
      </div>

      <Separator className="mx-3" />

      <div className="flex flex-col gap-2 px-3">
        <CustomCalendarNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          yearRange={yearRange}
          setYearRange={setYearRange}
        />

        <CustomCalendarContent
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
          yearRange={yearRange}
          dateRange={tempDateRange}
          onChange={handleDateSelect}
          tempDateRange={tempDateRange}
          handleDateSelect={handleDateSelect}
        />
      </div>

      <div className="flex justify-end gap-2 p-3 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={!hasTempChanges}
          className={cn("h-8 px-3 text-xs cursor-pointer", !hasTempChanges && "opacity-50 cursor-not-allowed")}
        >
          Batal
        </Button>
        <Button
          size="sm"
          onClick={handleApply}
          disabled={!tempDateRange?.from}
          className={cn("h-8 px-3 text-xs cursor-pointer", !tempDateRange?.from && "opacity-50 cursor-not-allowed")}
        >
          Terapkan
        </Button>
      </div>
    </div>
  );
};