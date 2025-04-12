"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarDays, ListFilter, RefreshCw, Plus } from "lucide-react"

export function ScheduleFilters() {
  const [view, setView] = useState("calendar")
  const [eventType, setEventType] = useState("all")

  return (
    <Card className="mb-6 shadow-md">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 border rounded-lg overflow-hidden">
              <Button
                variant={view === "calendar" ? "default" : "ghost"}
                className="rounded-none h-12"
                onClick={() => setView("calendar")}
              >
                <CalendarDays className="h-5 w-5 mr-2" />
                Calendar
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                className="rounded-none h-12"
                onClick={() => setView("list")}
              >
                <ListFilter className="h-5 w-5 mr-2" />
                List
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="race">Races</SelectItem>
                <SelectItem value="practice">Practice</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="ceremony">Award Ceremonies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" className="mr-3 h-12 px-5 text-base">
              <RefreshCw className="mr-2 h-5 w-5" />
              Reset
            </Button>
            <Button className="h-12 px-6 text-base">
              <Plus className="mr-2 h-5 w-5" />
              Add Event
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
