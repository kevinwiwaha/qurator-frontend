"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin } from "lucide-react"
import { ScheduleDetailSheet } from "@/components/schedule/schedule-detail-sheet"

// Schedule data type
export type ScheduleItem = {
  id: number
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: "Race" | "Practice" | "Meeting" | "Registration" | "Award Ceremony"
  description?: string
  notes?: string
}

// Sample schedule data
const initialScheduleItems: ScheduleItem[] = [
  {
    id: 1,
    title: "Mountain Challenge - Registration",
    date: "2023-10-14",
    startTime: "14:00",
    endTime: "18:00",
    location: "Base Camp, Rocky Mountains",
    type: "Registration",
    description: "Registration and race packet pickup for all participants.",
  },
  {
    id: 2,
    title: "Mountain Challenge - Race Day",
    date: "2023-10-15",
    startTime: "08:00",
    endTime: "16:00",
    location: "Rocky Mountains Trail",
    type: "Race",
    description: "Main race event through the mountain trails.",
  },
  {
    id: 3,
    title: "Mountain Challenge - Award Ceremony",
    date: "2023-10-15",
    startTime: "17:00",
    endTime: "19:00",
    location: "Base Camp Lodge",
    type: "Award Ceremony",
    description: "Awards presentation for race winners and participants.",
  },
  {
    id: 4,
    title: "City Sprint Series - Practice Run",
    date: "2023-09-04",
    startTime: "10:00",
    endTime: "12:00",
    location: "Central Park, NY",
    type: "Practice",
    description: "Practice run for all registered participants.",
  },
  {
    id: 5,
    title: "City Sprint Series - Race",
    date: "2023-09-05",
    startTime: "09:00",
    endTime: "14:00",
    location: "Central Park, NY",
    type: "Race",
    description: "Urban sprint race through Central Park.",
  },
  {
    id: 6,
    title: "Desert Endurance - Team Meeting",
    date: "2023-11-18",
    startTime: "15:00",
    endTime: "16:30",
    location: "Desert Oasis Hotel",
    type: "Meeting",
    description: "Pre-race briefing and safety instructions for all participants.",
  },
  {
    id: 7,
    title: "Desert Endurance - Race",
    date: "2023-11-20",
    startTime: "06:00",
    endTime: "18:00",
    location: "Mojave Desert, CA",
    type: "Race",
    description: "Extreme desert endurance race.",
  },
]

// Helper function to group schedule items by date
const groupByDate = (items: ScheduleItem[]) => {
  const grouped: Record<string, ScheduleItem[]> = {}

  items.forEach((item) => {
    if (!grouped[item.date]) {
      grouped[item.date] = []
    }
    grouped[item.date].push(item)
  })

  return grouped
}

// Helper function to get month name
const getMonthName = (date: Date) => {
  return date.toLocaleString("default", { month: "long" })
}

// Helper function to get day name
const getDayName = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString("default", { weekday: "short" })
}

export function ScheduleCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null)
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(initialScheduleItems)

  // Filter items for the current month
  const filteredItems = scheduleItems.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate.getMonth() === currentMonth.getMonth() && itemDate.getFullYear() === currentMonth.getFullYear()
  })

  // Group items by date
  const groupedItems = groupByDate(filteredItems)

  // Navigate to previous month
  const prevMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  // Navigate to next month
  const nextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  // Navigate to current month
  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const handleItemClick = (item: ScheduleItem) => {
    setSelectedItem(item)
  }

  const handleItemUpdate = (updatedItem: ScheduleItem) => {
    const updatedItems = scheduleItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    setScheduleItems(updatedItems)
  }

  const getTypeColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "Race":
        return "bg-primary text-primary-foreground"
      case "Practice":
        return "bg-green-100 text-green-800"
      case "Meeting":
        return "bg-blue-100 text-blue-800"
      case "Registration":
        return "bg-purple-100 text-purple-800"
      case "Award Ceremony":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Card className="shadow-md overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            <h2 className="text-xl font-semibold">
              {getMonthName(currentMonth)} {currentMonth.getFullYear()}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No scheduled events for {getMonthName(currentMonth)}
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedItems)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([date, items]) => (
                  <div key={date} className="relative">
                    <div className="flex items-start">
                      <div className="mr-4 text-center w-16 flex-shrink-0">
                        <div className="text-sm font-medium text-muted-foreground">{getDayName(date)}</div>
                        <div className="text-3xl font-bold">{new Date(date).getDate()}</div>
                      </div>

                      <div className="flex-1 space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-lg">{item.title}</h3>
                              <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                            </div>

                            <div className="flex items-center text-muted-foreground mb-2">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>
                                {item.startTime} - {item.endTime}
                              </span>
                            </div>

                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{item.location}</span>
                            </div>

                            {item.description && (
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </Card>

      <ScheduleDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} onUpdate={handleItemUpdate} />
    </>
  )
}
