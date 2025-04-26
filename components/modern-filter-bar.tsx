"use client"

import { useState, type ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, SlidersHorizontal, Plus } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

interface ModernFilterBarProps {
  searchPlaceholder?: string
  filters?: FilterGroup[]
  onSearch?: (value: string) => void
  onFilterChange?: (filterId: string, value: string) => void
  actionButton?: {
    label: string
    icon?: ReactNode
    onClick: () => void
  }
}

export function ModernFilterBar({
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  onFilterChange,
  actionButton,
}: ModernFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(filterId, value)
    }
  }

  return (
    <div className="bg-background border-b shadow-sm sticky top-0 z-20 pb-3">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 h-10 text-sm"
            />
          </div>

          {filters.map((filterGroup) => (
            <div key={filterGroup.id} className="flex items-center gap-2">
              <Select defaultValue="all" onValueChange={(value) => handleFilterChange(filterGroup.id, value)}>
                <SelectTrigger className="h-10 text-sm w-[140px]">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="text-gray-500 h-4 w-4" />
                    <SelectValue placeholder={filterGroup.label} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filterGroup.label}</SelectItem>
                  {filterGroup.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-10">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>

            {actionButton && (
              <Button size="sm" className="h-10" onClick={actionButton.onClick}>
                {actionButton.icon || <Plus className="mr-1 h-3.5 w-3.5" />}
                {actionButton.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
