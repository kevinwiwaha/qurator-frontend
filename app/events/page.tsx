"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { EventsList } from "@/components/events/events-list"
import { SlimFilterBar } from "@/components/slim-filter-bar"

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [seasonFilter, setSeasonFilter] = useState("all")
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === "status") {
      setStatusFilter(value)
    } else if (filterId === "season") {
      setSeasonFilter(value)
    }
  }

  const handleAddEvent = () => {
    setAddEventDialogOpen(true)
  }

  return (
    <AppShell activePage="events">
      <div className="flex flex-col h-full">
        <SlimFilterBar
          searchPlaceholder="Search events..."
          filters={[
            {
              id: "status",
              label: "Status",
              options: [
                { value: "upcoming", label: "Upcoming" },
                { value: "in-progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ],
            },
            {
              id: "season",
              label: "Season",
              options: [
                { value: "2023", label: "2023" },
                { value: "2024", label: "2024" },
                { value: "2025", label: "2025" },
              ],
            },
          ]}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          actionButton={{
            label: "Add Event",
            onClick: handleAddEvent,
          }}
        />

        <div className="flex-1 p-4 overflow-auto">
          <EventsList
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            seasonFilter={seasonFilter}
            addEventDialogOpen={addEventDialogOpen}
            setAddEventDialogOpen={setAddEventDialogOpen}
          />
        </div>
      </div>
    </AppShell>
  )
}
