"use client"

import { useState, useEffect } from "react"
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
import { Calendar, MapPin, Users } from "lucide-react"
import { EventDetailDialog } from "@/components/events/event-detail-dialog"
import { Card } from "@/components/ui/card"

// Track type
export type Track = {
  id: string
  name: string
  distance: string
  type: "Road" | "Mountain" | "Trail" | "Mixed"
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert"
}

// Racer type (simplified version of the full Racer type)
export type EventRacer = {
  id: number
  name: string
  number: number
  team: string
  category: string
  coDriver?: string
}

// Event data type with racers and tracks
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
  racers: EventRacer[]
  tracks: Track[]
}

// Sample tracks
const sampleTracks: Track[] = [
  {
    id: "track-1",
    name: "Mountain Loop",
    distance: "12.5 km",
    type: "Mountain",
    difficulty: "Hard",
  },
  {
    id: "track-2",
    name: "Forest Trail",
    distance: "8.2 km",
    type: "Trail",
    difficulty: "Moderate",
  },
  {
    id: "track-3",
    name: "City Circuit",
    distance: "5.0 km",
    type: "Road",
    difficulty: "Easy",
  },
  {
    id: "track-4",
    name: "Extreme Ridge",
    distance: "15.3 km",
    type: "Mixed",
    difficulty: "Expert",
  },
]

// Sample racers
const sampleRacers: EventRacer[] = [
  {
    id: 1,
    name: "John Smith",
    number: 42,
    team: "Red Racers",
    category: "Pro",
    coDriver: "Michael Roberts",
  },
  {
    id: 2,
    name: "Emma Johnson",
    number: 17,
    team: "Blue Speedsters",
    category: "Pro",
    coDriver: "Sarah Williams",
  },
  {
    id: 3,
    name: "Michael Brown",
    number: 33,
    team: "Green Machine",
    category: "Pro",
  },
  {
    id: 4,
    name: "Sarah Davis",
    number: 8,
    team: "Yellow Lightning",
    category: "Pro",
    coDriver: "James Wilson",
  },
  {
    id: 5,
    name: "David Wilson",
    number: 21,
    team: "Purple Power",
    category: "Pro",
  },
  {
    id: 6,
    name: "Lisa Martinez",
    number: 55,
    team: "Orange Flames",
    category: "Amateur",
  },
  {
    id: 7,
    name: "Robert Taylor",
    number: 12,
    team: "Silver Streaks",
    category: "Amateur",
    coDriver: "Thomas Laurent",
  },
  {
    id: 8,
    name: "Jennifer Anderson",
    number: 29,
    team: "Black Bolts",
    category: "Amateur",
  },
]

// Sample event data with racers and tracks
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
    racers: [sampleRacers[0], sampleRacers[1], sampleRacers[2]],
    tracks: [sampleTracks[0], sampleTracks[1]],
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
    racers: [sampleRacers[3], sampleRacers[4]],
    tracks: [sampleTracks[2]],
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
    racers: [sampleRacers[5], sampleRacers[6], sampleRacers[7]],
    tracks: [sampleTracks[3]],
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
    racers: [],
    tracks: [],
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
    racers: [],
    tracks: [],
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
    racers: [],
    tracks: [],
  },
]

interface EventsListProps {
  searchTerm?: string
  statusFilter?: string
  addEventDialogOpen?: boolean
  setAddEventDialogOpen?: (open: boolean) => void
}

export function EventsList({
  searchTerm = "",
  statusFilter = "all",
  addEventDialogOpen = false,
  setAddEventDialogOpen = () => {},
}: EventsListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const itemsPerPage = 5

  // Handle external dialog state
  useEffect(() => {
    if (addEventDialogOpen) {
      handleAddEvent()
    }
  }, [addEventDialogOpen])

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort events
  const filteredAndSortedEvents = [...events]
    .filter((event) => {
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          event.name.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term) ||
          event.organizer?.toLowerCase().includes(term)
        )
      }
      return true
    })
    .filter((event) => {
      // Apply status filter
      if (statusFilter !== "all") {
        return event.status.toLowerCase().replace(" ", "-") === statusFilter.toLowerCase()
      }
      return true
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof a]

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage)
  const paginatedEvents = filteredAndSortedEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event)
    setDialogOpen(true)
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
      racers: [],
      tracks: [],
    }

    setEvents([...events, newEvent])
    setSelectedEvent(newEvent)
    setDialogOpen(true)

    if (setAddEventDialogOpen) {
      setAddEventDialogOpen(false)
    }
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
      <Card className="overflow-hidden shadow-md mb-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("name")}
                >
                  Event Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("date")}
                >
                  Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("location")}
                >
                  Location {sortField === "location" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("status")}
                >
                  Status {sortField === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("participants")}
                >
                  Participants {sortField === "participants" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="py-4 text-base">Tracks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => (
                  <TableRow
                    key={event.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(event)}
                  >
                    <TableCell className="font-medium py-4 text-base">{event.name}</TableCell>
                    <TableCell className="py-4 text-base">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-base">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant={getStatusBadgeVariant(event.status)} className="px-3 py-1 text-base">
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-base">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        {event.racers.length} / {event.participants}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {event.tracks.length > 0 ? (
                          event.tracks.map((track) => (
                            <Badge key={track.id} variant="outline" className="px-2 py-1 text-sm">
                              {track.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No tracks</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No events found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
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
        )}
      </Card>

      <EventDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={selectedEvent}
        onUpdate={handleEventUpdate}
        availableRacers={sampleRacers}
        availableTracks={sampleTracks}
      />
    </>
  )
}
