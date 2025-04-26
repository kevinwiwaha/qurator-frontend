"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { ModernTable } from "@/components/ui/modern-table"
import { ModernCardTable } from "@/components/ui/modern-card-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Users, Calendar, MapPin } from "lucide-react"

// Sample data for racers
const racers = [
  {
    id: 1,
    name: "John Smith",
    number: 42,
    team: "Red Racers",
    category: "Pro",
    age: 28,
    country: "USA",
    totalRaces: 24,
    wins: 5,
    avatar: "",
  },
  {
    id: 2,
    name: "Emma Johnson",
    number: 17,
    team: "Blue Speedsters",
    category: "Pro",
    age: 26,
    country: "Canada",
    totalRaces: 18,
    wins: 3,
    avatar: "",
  },
  {
    id: 3,
    name: "Michael Brown",
    number: 33,
    team: "Green Machine",
    category: "Pro",
    age: 31,
    country: "UK",
    totalRaces: 32,
    wins: 7,
    avatar: "",
  },
  {
    id: 4,
    name: "Sarah Davis",
    number: 8,
    team: "Yellow Lightning",
    category: "Pro",
    age: 24,
    country: "Australia",
    totalRaces: 15,
    wins: 2,
    avatar: "",
  },
  {
    id: 5,
    name: "David Wilson",
    number: 21,
    team: "Purple Power",
    category: "Pro",
    age: 29,
    country: "Germany",
    totalRaces: 27,
    wins: 4,
    avatar: "",
  },
  {
    id: 6,
    name: "Lisa Martinez",
    number: 55,
    team: "Orange Flames",
    category: "Amateur",
    age: 22,
    country: "Spain",
    totalRaces: 8,
    wins: 0,
    avatar: "",
  },
  {
    id: 7,
    name: "Robert Taylor",
    number: 12,
    team: "Silver Streaks",
    category: "Amateur",
    age: 35,
    country: "France",
    totalRaces: 12,
    wins: 1,
    avatar: "",
  },
  {
    id: 8,
    name: "Jennifer Anderson",
    number: 29,
    team: "Black Bolts",
    category: "Amateur",
    age: 27,
    country: "Italy",
    totalRaces: 9,
    wins: 0,
    avatar: "",
  },
]

// Sample data for events
const events = [
  {
    id: 1,
    name: "Mountain Challenge 2023",
    date: "2023-10-15",
    location: "Rocky Mountains, CO",
    status: "Upcoming",
    participants: 120,
  },
  {
    id: 2,
    name: "City Sprint Series",
    date: "2023-09-05",
    location: "Central Park, NY",
    status: "Completed",
    participants: 85,
  },
  {
    id: 3,
    name: "Desert Endurance Race",
    date: "2023-11-20",
    location: "Mojave Desert, CA",
    status: "Upcoming",
    participants: 60,
  },
  {
    id: 4,
    name: "Coastal Marathon",
    date: "2023-08-12",
    location: "Pacific Coast, OR",
    status: "Completed",
    participants: 150,
  },
  {
    id: 5,
    name: "Forest Trail Challenge",
    date: "2023-10-28",
    location: "Redwood Forest, CA",
    status: "Upcoming",
    participants: 75,
  },
  {
    id: 6,
    name: "Winter Snow Race",
    date: "2024-01-15",
    location: "Aspen, CO",
    status: "Upcoming",
    participants: 90,
  },
]

export default function ModernTablesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [activeTab, setActiveTab] = useState("racers")

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const sortedRacers = [...racers].sort((a, b) => {
    const aValue = a[sortKey as keyof typeof a]
    const bValue = b[sortKey as keyof typeof b]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const sortedEvents = [...events].sort((a, b) => {
    const aValue = a[sortKey as keyof typeof a]
    const bValue = b[sortKey as keyof typeof b]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-400"
      case 2:
        return "text-gray-300"
      case 3:
        return "text-amber-600"
      default:
        return "text-gray-200"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
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
    <AppShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Modern Tables</h1>
        <p className="text-muted-foreground mb-6">
          A modern, minimalist alternative to traditional tables with both tabular and card views.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="racers">Racers</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs defaultValue="table" className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="cards">Card View</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-6">
            {activeTab === "racers" && (
              <ModernTable
                data={sortedRacers}
                columns={[
                  {
                    key: "avatar",
                    header: "",
                    cell: (racer) => (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {racer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ),
                    className: "w-[60px]",
                  },
                  {
                    key: "name",
                    header: "Name",
                    cell: (racer) => <span className="font-medium">{racer.name}</span>,
                    sortable: true,
                  },
                  {
                    key: "number",
                    header: "#",
                    cell: (racer) => racer.number,
                    sortable: true,
                    className: "w-[60px]",
                  },
                  {
                    key: "team",
                    header: "Team",
                    cell: (racer) => racer.team,
                    sortable: true,
                  },
                  {
                    key: "category",
                    header: "Category",
                    cell: (racer) => (
                      <Badge variant={racer.category === "Pro" ? "default" : "secondary"} className="font-normal">
                        {racer.category}
                      </Badge>
                    ),
                    sortable: true,
                  },
                  {
                    key: "country",
                    header: "Country",
                    cell: (racer) => racer.country,
                    sortable: true,
                  },
                  {
                    key: "wins",
                    header: "Wins",
                    cell: (racer) => (
                      <div className="flex items-center">
                        {racer.wins > 0 && <Trophy className={`h-4 w-4 mr-1 ${getMedalColor(racer.wins)}`} />}
                        {racer.wins}
                      </div>
                    ),
                    sortable: true,
                    className: "w-[80px]",
                  },
                ]}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={5}
              />
            )}

            {activeTab === "events" && (
              <ModernTable
                data={sortedEvents}
                columns={[
                  {
                    key: "name",
                    header: "Event Name",
                    cell: (event) => <span className="font-medium">{event.name}</span>,
                    sortable: true,
                  },
                  {
                    key: "date",
                    header: "Date",
                    cell: (event) => (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    ),
                    sortable: true,
                  },
                  {
                    key: "location",
                    header: "Location",
                    cell: (event) => (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {event.location}
                      </div>
                    ),
                    sortable: true,
                  },
                  {
                    key: "status",
                    header: "Status",
                    cell: (event) => (
                      <Badge variant={getStatusBadgeVariant(event.status)} className="font-normal">
                        {event.status}
                      </Badge>
                    ),
                    sortable: true,
                  },
                  {
                    key: "participants",
                    header: "Participants",
                    cell: (event) => (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {event.participants}
                      </div>
                    ),
                    sortable: true,
                  },
                ]}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={5}
              />
            )}
          </TabsContent>

          <TabsContent value="cards" className="mt-6">
            {activeTab === "racers" && (
              <ModernCardTable
                data={sortedRacers}
                renderCard={(racer) => (
                  <Card key={racer.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarFallback className="bg-primary/10 text-primary text-lg">
                            {racer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-lg">{racer.name}</span>
                            <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                              #{racer.number}
                            </span>
                          </div>
                          <div className="text-muted-foreground text-sm">{racer.team}</div>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-between items-center">
                        <Badge variant={racer.category === "Pro" ? "default" : "secondary"} className="font-normal">
                          {racer.category}
                        </Badge>
                        <div className="flex items-center text-sm">
                          <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                          <span>
                            {racer.wins} {racer.wins === 1 ? "win" : "wins"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={6}
              />
            )}

            {activeTab === "events" && (
              <ModernCardTable
                data={sortedEvents}
                renderCard={(event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-2">{event.name}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Users className="h-4 w-4 mr-2" />
                            {event.participants} participants
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex justify-end">
                        <Badge variant={getStatusBadgeVariant(event.status)} className="font-normal">
                          {event.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={6}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
