"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Calendar, MapPin, Users, Plus } from "lucide-react"
import { EventDetailSheet } from "@/components/events/event-detail-sheet"

// Event data type
export type Event = {
  id: number
  name: string
  date: string
  location: string
  status: "Upcoming" | "In Progress" | "Completed" | "Cancelled"
  participants: number
  description?: string
  organizer?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  notes?: string
}

// Sample event data
const initialEvents: Event[] = [
  {
    id: 1,
    name: "Mountain Challenge 2023",
    date: "2023-10-15",
    location: "Rocky Mountains, CO",
    status: "Upcoming",
    participants: 120,
    description: "Annual mountain race through challenging terrain with spectacular views.",
    organizer: "Mountain Racing Association",
    contactEmail: "info@mountainchallenge.com",
    contactPhone: "+1 555-123-4567",
    website: "www.mountainchallenge.com",
  },
  {
    id: 2,
    name: "City Sprint Series",
    date: "2023-09-05",
    location: "Central Park, NY",
    status: "Completed",
    participants: 85,
    description: "Fast-paced urban race through iconic city landmarks.",
    organizer: "Urban Racing League",
    contactEmail: "contact@citysprint.com",
  },
  {
    id: 3,
    name: "Desert Endurance Race",
    date: "2023-11-20",
    location: "Mojave Desert, CA",
    status: "Upcoming",
    participants: 60,
    description: "Test your limits in this extreme desert endurance challenge.",
    organizer: "Extreme Sports Inc.",
    contactEmail: "info@desertrace.com",
    website: "www.desertendurance.com",
  },
  {
    id: 4,
    name: "Coastal Marathon",
    date: "2023-08-12",
    location: "Pacific Coast, OR",
    status: "Completed",
    participants: 150,
    description: "Scenic marathon along the beautiful Pacific coastline.",
    organizer: "Coastal Running Club",
    contactEmail: "run@coastalmarathon.com",
  },
  {
    id: 5,
    name: "Forest Trail Challenge",
    date: "2023-10-28",
    location: "Redwood Forest, CA",
    status: "Upcoming",
    participants: 75,
    description: "Navigate through ancient forest trails in this technical race.",
    organizer: "Trail Runners Association",
    contactEmail: "info@foresttrail.com",
  },
  {
    id: 6,
    name: "Winter Snow Race",
    date: "2024-01-15",
    location: "Aspen, CO",
    status: "Upcoming",
    participants: 90,
    description: "Race through snow-covered terrain in this winter challenge.",
    organizer: "Winter Sports Federation",
    contactEmail: "contact@winterrace.com",
  },
]

type SortField = "name" | "date" | "location" | "status" | "participants"
type SortDirection = "asc" | "desc"

export function EventsList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const itemsPerPage = 5
  const totalPages = Math.ceil(events.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedEvents = [...events].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const paginatedEvents = sortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleEventUpdate = (updatedEvent: Event) => {
    const updatedEvents = events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    setEvents(updatedEvents)
  }

  const handleAddEvent = () => {
    // Create a new event with default values
    const today = new Date().toISOString().split("T")[0]
    const newEvent: Event = {
      id: Math.max(...events.map((e) => e.id)) + 1,
      name: "New Event",
      date: today,
      location: "",
      status: "Upcoming",
      participants: 0,
    }

    setEvents([...events, newEvent])
    setSelectedEvent(newEvent)
  }

  const getStatusBadgeVariant = (status: Event["status"]) => {
    switch (status) {
      case "Upcoming":
        return "secondary"
      case "In Progress":
        return "default"
      case "Completed":
        return "outline"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Race Events</h2>
        <Button onClick={handleAddEvent} className="h-10">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Card className="overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("name")}
                  >
                    Event Name {renderSortIcon("name")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("date")}
                  >
                    Date {renderSortIcon("date")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("location")}
                  >
                    Location {renderSortIcon("location")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("status")}
                  >
                    Status {renderSortIcon("status")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("participants")}
                  >
                    Participants {renderSortIcon("participants")}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow
                  key={event.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(event)}
                >
                  <TableCell className="font-medium py-4">{event.name}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={getStatusBadgeVariant(event.status)} className="px-3 py-1 text-sm">
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.participants}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(index + 1)
                    }}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      <EventDetailSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} onUpdate={handleEventUpdate} />
    </>
  )
}
