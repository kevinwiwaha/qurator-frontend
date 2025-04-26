"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronUp, ChevronDown } from "lucide-react"

interface ModernTableProps<T> {
  data: T[]
  columns: {
    key: string
    header: React.ReactNode
    cell: (item: T) => React.ReactNode
    sortable?: boolean
    className?: string
  }[]
  sortKey?: string
  sortDirection?: "asc" | "desc"
  onSort?: (key: string) => void
  itemsPerPage?: number
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  className?: string
  emptyState?: React.ReactNode
}

export function ModernTable<T>({
  data,
  columns,
  sortKey,
  sortDirection,
  onSort,
  itemsPerPage = 10,
  currentPage = 1,
  totalPages,
  onPageChange,
  className,
  emptyState,
}: ModernTableProps<T>) {
  const calculatedTotalPages = totalPages || Math.ceil(data.length / itemsPerPage)
  const paginatedData = totalPages ? data : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 text-primary" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 text-primary" />
    )
  }

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {/* Table with fixed header */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {paginatedData.length > 0 ? (
          <div className="w-full overflow-hidden">
            <table className="w-full divide-y divide-gray-100">
              <thead className="sticky top-0 bg-white z-20 shadow-sm">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-left text-sm font-medium text-gray-500",
                        column.sortable && "cursor-pointer hover:text-primary transition-colors",
                        column.className,
                      )}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center">
                        {column.header}
                        {column.sortable && renderSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedData.map((item, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={cn("px-4 py-3 text-sm text-gray-800 whitespace-nowrap", column.className)}
                      >
                        {column.cell(item)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            {emptyState || (
              <div className="text-gray-500">
                <p className="text-lg font-medium">No data available</p>
                <p className="mt-1 text-sm">There are no items to display at this time.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {calculatedTotalPages > 1 && (
        <div className="py-3 border-t bg-white shadow-sm z-20 mt-4 rounded-lg">
          <Pagination>
            <PaginationContent className="flex items-center justify-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1 && onPageChange) {
                      onPageChange(currentPage - 1)
                    }
                  }}
                  className={cn(
                    "h-8 px-2 flex items-center",
                    currentPage === 1 ? "pointer-events-none opacity-50" : "",
                  )}
                />
              </PaginationItem>

              {Array.from({ length: calculatedTotalPages }).map((_, index) => {
                // Show first, last, current, and pages around current
                if (
                  index === 0 ||
                  index === calculatedTotalPages - 1 ||
                  index === currentPage - 1 ||
                  Math.abs(index - (currentPage - 1)) <= 1
                ) {
                  return (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (onPageChange) {
                            onPageChange(index + 1)
                          }
                        }}
                        isActive={currentPage === index + 1}
                        className="h-8 w-8 flex items-center justify-center"
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }

                // Show ellipsis for gaps
                if (
                  (index === 1 && currentPage > 3) ||
                  (index === calculatedTotalPages - 2 && currentPage < calculatedTotalPages - 2)
                ) {
                  return (
                    <PaginationItem key={index}>
                      <span className="flex h-8 w-8 items-center justify-center">...</span>
                    </PaginationItem>
                  )
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < calculatedTotalPages && onPageChange) {
                      onPageChange(currentPage + 1)
                    }
                  }}
                  className={cn(
                    "h-8 px-2 flex items-center",
                    currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : "",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
