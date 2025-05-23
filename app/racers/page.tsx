"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { RacersList } from "@/components/racers/racers-list"
import { SlimFilterBar } from "@/components/slim-filter-bar"

export default function RacersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [addRacerDialogOpen, setAddRacerDialogOpen] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === "category") {
      setCategoryFilter(value)
    } else if (filterId === "status") {
      setStatusFilter(value)
    }
  }

  const handleAddRacer = () => {
    setAddRacerDialogOpen(true)
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
                { value: "elite", label: "Elite" },
              ],
            },
            {
              id: "status",
              label: "Status",
              options: [
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending" },
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
          <RacersList
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            addRacerDialogOpen={addRacerDialogOpen}
            setAddRacerDialogOpen={setAddRacerDialogOpen}
          />
        </div>
      </div>
    </AppShell>
  )
}
