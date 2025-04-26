"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Plus, ChevronDown } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
}

interface SlimFilterBarProps {
  searchPlaceholder?: string
  filters?: FilterGroup[]
  onSearch?: (value: string) => void
  onFilterChange?: (filterId: string, value: string) => void
  actionButton: {
    label: string
    onClick: () => void
  }
}

export function SlimFilterBar({
  searchPlaceholder = "Search...",
  filters = [],
  onSearch,
  onFilterChange,
  actionButton,
}: SlimFilterBarProps) {
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
    <div className="bg-background border-b shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-3 px-4 py-2 flex-nowrap">
        <div className="relative flex-1 min-w-0">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-10 text-sm"
          />
        </div>

        {filters.map((filterGroup) => (
          <Select
            key={filterGroup.id}
            defaultValue="all"
            onValueChange={(value) => handleFilterChange(filterGroup.id, value)}
          >
            <SelectTrigger className="h-10 text-sm w-[140px] bg-gray-50 border flex-shrink-0">
              <div className="flex items-center justify-between w-full">
                <span className="truncate">All {filterGroup.label}s</span>
                <ChevronDown className="h-4 w-4 opacity-50 ml-1 flex-shrink-0" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filterGroup.label}s</SelectItem>
              {filterGroup.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Button className="h-10 bg-blue-600 hover:bg-blue-700 flex-shrink-0" onClick={actionButton.onClick}>
          <Plus className="mr-1 h-4 w-4" />
          {actionButton.label}
        </Button>
      </div>
    </div>
  )
}
