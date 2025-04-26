"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FilterOption {
  id: string
  label: string
  options: {
    value: string
    label: string
  }[]
}

interface ModernFiltersProps {
  placeholder?: string
  filters: FilterOption[]
  onSearch?: (value: string) => void
  onFilterChange?: (filterId: string, value: string) => void
  className?: string
}

export function ModernFilters({
  placeholder = "Search...",
  filters,
  onSearch,
  onFilterChange,
  className,
}: ModernFiltersProps) {
  const [searchValue, setSearchValue] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const handleSearch = (value: string) => {
    setSearchValue(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleFilterChange = (filterId: string, value: string) => {
    const newActiveFilters = { ...activeFilters }

    if (value === "all") {
      delete newActiveFilters[filterId]
    } else {
      newActiveFilters[filterId] = value
    }

    setActiveFilters(newActiveFilters)

    if (onFilterChange) {
      onFilterChange(filterId, value)
    }
  }

  const clearFilter = (filterId: string) => {
    const newActiveFilters = { ...activeFilters }
    delete newActiveFilters[filterId]
    setActiveFilters(newActiveFilters)

    if (onFilterChange) {
      onFilterChange(filterId, "all")
    }
  }

  const clearAllFilters = () => {
    setActiveFilters({})
    setSearchValue("")

    if (onSearch) {
      onSearch("")
    }

    Object.keys(activeFilters).forEach((filterId) => {
      if (onFilterChange) {
        onFilterChange(filterId, "all")
      }
    })
  }

  const hasActiveFilters = searchValue || Object.keys(activeFilters).length > 0

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-9 bg-white border-gray-200 rounded-lg shadow-sm"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => handleSearch("")}
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.id}
              value={activeFilters[filter.id] || "all"}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger className="h-9 bg-white border-gray-200 rounded-lg shadow-sm min-w-[140px] w-auto">
                <div className="flex items-center gap-2 truncate">
                  <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <SelectValue placeholder={filter.label} />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {filter.label}s</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {searchValue && (
            <Badge variant="outline" className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100">
              <span className="text-xs font-normal">Search: {searchValue}</span>
              <Button variant="ghost" size="sm" onClick={() => handleSearch("")} className="h-4 w-4 p-0 ml-1">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find((f) => f.id === filterId)
            const option = filter?.options.find((o) => o.value === value)

            if (!filter || !option) return null

            return (
              <Badge key={filterId} variant="outline" className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100">
                <span className="text-xs font-normal">
                  {filter.label}: {option.label}
                </span>
                <Button variant="ghost" size="sm" onClick={() => clearFilter(filterId)} className="h-4 w-4 p-0 ml-1">
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )
          })}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs h-7 px-2 text-gray-500 hover:text-gray-700"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
