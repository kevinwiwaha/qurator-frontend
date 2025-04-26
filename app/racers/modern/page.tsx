"use client"

import { useState, useRef } from "react"
import { AppShell } from "@/components/app-shell"
import { ModernRacersList, type ModernRacersListRef } from "@/components/racers/modern-racers-list"
import { SlimFilterBar } from "@/components/slim-filter-bar"

export default function ModernRacersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const racersListRef = useRef<ModernRacersListRef>({ onAddRacer: () => {} })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === "category") {
      setCategoryFilter(value)
    } else if (filterId === "country") {
      setCountryFilter(value)
    }
  }

  const handleAddRacer = () => {
    racersListRef.current.onAddRacer()
  }

  return (
    <AppShell activePage="racers">
      <div className="flex flex-col h-full">
        <SlimFilterBar
          searchPlaceholder="Search racer or team..."
          filters={[
            {
              id: "category",
              label: "Category",
              options: [
                { value: "pro", label: "Pro" },
                { value: "amateur", label: "Amateur" },
              ],
            },
            {
              id: "country",
              label: "Country",
              options: [
                { value: "usa", label: "USA" },
                { value: "canada", label: "Canada" },
                { value: "uk", label: "UK" },
                { value: "australia", label: "Australia" },
                { value: "germany", label: "Germany" },
              ],
            },
          ]}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          actionButton={{
            label: "Add Racer",
            onClick: handleAddRacer,
          }}
        />

        <div className="flex-1 p-4 overflow-auto">
          <ModernRacersList
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            countryFilter={countryFilter}
            onAddRacer={(callback) => (racersListRef.current.onAddRacer = callback)}
            ref={racersListRef}
          />
        </div>
      </div>
    </AppShell>
  )
}
