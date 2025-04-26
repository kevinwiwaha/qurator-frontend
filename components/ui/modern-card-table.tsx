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
import { Card } from "@/components/ui/card"

interface ModernCardTableProps<T> {
  data: T[]
  renderCard: (item: T, index: number) => React.ReactNode
  itemsPerPage?: number
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  className?: string
  emptyState?: React.ReactNode
  gridClassName?: string
}

export function ModernCardTable<T>({
  data,
  renderCard,
  itemsPerPage = 10,
  currentPage = 1,
  totalPages,
  onPageChange,
  className,
  emptyState,
  gridClassName,
}: ModernCardTableProps<T>) {
  const calculatedTotalPages = totalPages || Math.ceil(data.length / itemsPerPage)
  const paginatedData = totalPages ? data : data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className={cn("flex flex-col", className)}>
      {paginatedData.length > 0 ? (
        <div className={cn("grid gap-4", gridClassName || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}>
          {paginatedData.map((item, index) => renderCard(item, index))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          {emptyState || (
            <div className="text-gray-500">
              <p className="text-lg font-medium">No data available</p>
              <p className="mt-1 text-sm">There are no items to display at this time.</p>
            </div>
          )}
        </Card>
      )}

      {calculatedTotalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1 && onPageChange) {
                      onPageChange(currentPage - 1)
                    }
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                      <span className="flex h-10 w-10 items-center justify-center">...</span>
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
                  className={currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
