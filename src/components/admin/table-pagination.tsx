import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TablePaginationProps } from "@/lib/interface";

export const TablePagination: React.FC<TablePaginationProps> = ({
  selectedRowsFromCurrentPage,
  currentPageDataLength,
  totalSelectedRows,
  onClearSelection,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading = false,
  pageSizeOptions = [10, 25, 50, 100, -1],
  showSelection = true,
  showPageSizeSelector = true,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    onPageSizeChange(newPageSize);
  };

  const renderPageButtons = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter(pageNum => {
        return pageNum === 1 ||
          pageNum === totalPages ||
          Math.abs(pageNum - currentPage) <= 1;
      })
      .map((pageNum, i, array) => {
        if (i > 0 && pageNum - array[i - 1] > 1) {
          return (
            <React.Fragment key={`ellipsis-${pageNum}`}>
              <span className="px-2 text-muted-foreground">...</span>
              <Button
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className={cn(
                  "min-w-10 transition-all duration-200 cursor-pointer",
                  currentPage === pageNum && "hover:bg-primary/90"
                )}
              >
                {pageNum}
              </Button>
            </React.Fragment>
          );
        }

        return (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            onClick={() => onPageChange(pageNum)}
            disabled={loading}
            className={cn(
              "min-w-10 transition-all duration-200 cursor-pointer",
              currentPage === pageNum && "hover:bg-primary/90"
            )}
          >
            {pageNum}
          </Button>
        );
      });
  };

  return (
    <div className="md:flex items-center justify-between w-full px-4 space-y-4 md:space-y-0">
      {showSelection && (
        <div className="flex justify-center md:justify-start">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {selectedRowsFromCurrentPage} of {currentPageDataLength} data{currentPageDataLength !== 1 ? "s" : ""} selected
            </p>
            {totalSelectedRows > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={onClearSelection}
                className="h-auto p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {showPageSizeSelector && (
        <div className="flex justify-center md:justify-start items-center gap-2">
          <span className="text-sm text-gray-500">Data per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
            disabled={loading}
          >
            <SelectTrigger className="w-20 transition-all duration-200 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="transition-colors duration-200 hover:bg-muted cursor-pointer"
                >
                  {size === -1 ? "All" : size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col justify-center md:justify-end items-center gap-4">
        <div className="text-sm text-muted-foreground md:hidden">
          <div className="md:hidden block text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </div>
        </div>

        <div className="md:flex items-center gap-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            <div className="hidden md:block text-sm text-muted-foreground">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          <div className="flex justify-center md:justify-end items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || loading}
              size="icon"
              className="transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {renderPageButtons()}

            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || loading}
              size="icon"
              className="transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;