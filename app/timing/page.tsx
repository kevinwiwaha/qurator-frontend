"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { TimingConsole } from "@/components/timing/timing-console"
import { SlimFilterBar } from "@/components/slim-filter-bar"

export default function TimingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [trackFilter, setTrackFilter] = useState("all")
  const [addTimeDialogOpen, setAddTimeDialogOpen] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === "category") {
      setCategoryFilter(value)
    } else if (filterId === "track") {
      setTrackFilter(value)
    }
  }

  const handleAddTime = () => {
    setAddTimeDialogOpen(true)
  }

  return (
    <AppShell activePage="timing">
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
              id: "track",
              label: "Track",
              options: [
                { value: "track1", label: "Mountain Loop" },
                { value: "track2", label: "Forest Trail" },
                { value: "track3", label: "City Circuit" },
              ],
            },
          ]}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          actionButton={{
            label: "Add Time",
            onClick: handleAddTime,
          }}
        />

        <div className="flex-1 overflow-auto">
          <TimingConsole
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            trackFilter={trackFilter}
            addTimeDialogOpen={addTimeDialogOpen}
            setAddTimeDialogOpen={setAddTimeDialogOpen}
          />
        </div>
      </div>
    </AppShell>
  )
}
