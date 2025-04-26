"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { LeaderboardList } from "@/components/leaderboard-list"
import { SlimFilterBar } from "@/components/slim-filter-bar"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [eventFilter, setEventFilter] = useState("all")

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === "category") {
      setCategoryFilter(value)
    } else if (filterId === "event") {
      setEventFilter(value)
    }
  }

  const handleAddScore = () => {
    // Handle adding a new score
    console.log("Add score clicked")
  }

  return (
    <AppShell>
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
              id: "event",
              label: "Event",
              options: [
                { value: "event1", label: "Spring Classic" },
                { value: "event2", label: "Summer Series" },
                { value: "event3", label: "Fall Championship" },
              ],
            },
          ]}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          actionButton={{
            label: "Add Score",
            onClick: handleAddScore,
          }}
        />

        <div className="flex-1 p-4 overflow-auto">
          <LeaderboardList searchTerm={searchTerm} categoryFilter={categoryFilter} eventFilter={eventFilter} />
        </div>
      </div>
    </AppShell>
  )
}
