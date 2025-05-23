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
import { Trophy, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RacerAddDialog } from "@/components/racers/racer-add-dialog"
import { useToast } from "@/hooks/use-toast"
import { RacerDetailDialog } from "@/components/racers/racer-detail-dialog"
import { Card } from "@/components/ui/card"

// Update the Racer data type to include coDriver field
export type Racer = {
  id: number
  name: string
  number: number
  team: string
  category: string
  age: number
  gender: "Male" | "Female" | "Other"
  country: string
  totalRaces: number
  wins: number
  coDriver?: string
  avatar?: string
  email?: string
  phone?: string
  emergencyContact?: string
  notes?: string
}

// Update the sample racer data to include coDriver for some racers
const initialRacers: Racer[] = [
  {
    id: 1,
    name: "John Smith",
    number: 42,
    team: "Red Racers",
    category: "Pro",
    age: 28,
    gender: "Male",
    country: "USA",
    totalRaces: 24,
    wins: 5,
    coDriver: "Michael Roberts",
    email: "john.smith@example.com",
    phone: "+1 555-123-4567",
    emergencyContact: "Jane Smith: +1 555-987-6543",
    notes: "Prefers early start times. Allergic to bee stings.",
  },
  {
    id: 2,
    name: "Emma Johnson",
    number: 17,
    team: "Blue Speedsters",
    category: "Pro",
    age: 26,
    gender: "Female",
    country: "Canada",
    totalRaces: 18,
    wins: 3,
    coDriver: "Sarah Williams",
    email: "emma.j@example.com",
    phone: "+1 555-234-5678",
  },
  {
    id: 3,
    name: "Michael Brown",
    number: 33,
    team: "Green Machine",
    category: "Pro",
    age: 31,
    gender: "Male",
    country: "UK",
    totalRaces: 32,
    wins: 7,
    email: "mbrown@example.com",
    phone: "+44 20 1234 5678",
  },
  {
    id: 4,
    name: "Sarah Davis",
    number: 8,
    team: "Yellow Lightning",
    category: "Pro",
    age: 24,
    gender: "Female",
    country: "Australia",
    totalRaces: 15,
    wins: 2,
    coDriver: "James Wilson",
    email: "sarah.d@example.com",
    phone: "+61 2 1234 5678",
  },
  {
    id: 5,
    name: "David Wilson",
    number: 21,
    team: "Purple Power",
    category: "Pro",
    age: 29,
    gender: "Male",
    country: "Germany",
    totalRaces: 27,
    wins: 4,
    email: "dwilson@example.com",
    phone: "+49 30 1234 5678",
  },
  {
    id: 6,
    name: "Lisa Martinez",
    number: 55,
    team: "Orange Flames",
    category: "Amateur",
    age: 22,
    gender: "Female",
    country: "Spain",
    totalRaces: 8,
    wins: 0,
    email: "lisa.m@example.com",
    phone: "+34 91 1234 5678",
  },
  {
    id: 7,
    name: "Robert Taylor",
    number: 12,
    team: "Silver Streaks",
    category: "Amateur",
    age: 35,
    gender: "Male",
    country: "France",
    totalRaces: 12,
    wins: 1,
    coDriver: "Thomas Laurent",
    email: "rtaylor@example.com",
    phone: "+33 1 1234 5678",
  },
  {
    id: 8,
    name: "Jennifer Anderson",
    number: 29,
    team: "Black Bolts",
    category: "Amateur",
    age: 27,
    gender: "Female",
    country: "Italy",
    totalRaces: 9,
    wins: 0,
    email: "j.anderson@example.com",
    phone: "+39 06 1234 5678",
  },
]

interface RacersListProps {
  searchTerm?: string
  categoryFilter?: string
  countryFilter?: string
}

export function RacersList({ searchTerm = "", categoryFilter = "all", countryFilter = "all" }: RacersListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedRacer, setSelectedRacer] = useState<Racer | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [racers, setRacers] = useState<Racer[]>(initialRacers)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const itemsPerPage = 5

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort racers based on search term, category, and country
  const filteredAndSortedRacers = [...racers]
    .filter((racer) => {
      // Apply search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        return (
          racer.name.toLowerCase().includes(term) ||
          racer.team.toLowerCase().includes(term) ||
          racer.number.toString().includes(term)
        )
      }
      return true
    })
    .filter((racer) => {
      // Apply category filter
      if (categoryFilter !== "all") {
        return racer.category.toLowerCase() === categoryFilter.toLowerCase()
      }
      return true
    })
    .filter((racer) => {
      // Apply country filter
      if (countryFilter !== "all") {
        return racer.country.toLowerCase() === countryFilter.toLowerCase()
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

  const totalPages = Math.ceil(filteredAndSortedRacers.length / itemsPerPage)
  const paginatedRacers = filteredAndSortedRacers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleRowClick = (racer: Racer) => {
    setSelectedRacer(racer)
    setDialogOpen(true)
  }

  const handleRacerUpdate = (updatedRacer: Racer) => {
    const updatedRacers = racers.map((racer) => (racer.id === updatedRacer.id ? updatedRacer : racer))
    setRacers(updatedRacers)
  }

  const handleAddRacer = (newRacer: Racer) => {
    // Generate a new ID for the racer
    const newId = Math.max(...racers.map((r) => r.id)) + 1
    const racerWithId = { ...newRacer, id: newId }

    // Add to racers list
    setRacers([...racers, racerWithId])

    toast({
      title: "Racer added",
      description: `${newRacer.name} has been added successfully.`,
    })
  }

  return (
    <>
      <Card className="overflow-hidden shadow-md mb-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-12 py-4"></TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("name")}
                >
                  Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="w-16 py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("number")}
                >
                  # {sortField === "number" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("team")}
                >
                  Team {sortField === "team" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="py-4 text-base">Co-Driver</TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("category")}
                >
                  Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("country")}
                >
                  Country {sortField === "country" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="py-4 text-base cursor-pointer hover:text-primary"
                  onClick={() => handleSort("wins")}
                >
                  Wins {sortField === "wins" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRacers.length > 0 ? (
                paginatedRacers.map((racer) => (
                  <TableRow
                    key={racer.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(racer)}
                  >
                    <TableCell className="py-4">
                      <Avatar>
                        <AvatarImage src={racer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {racer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium py-4 text-base">{racer.name}</TableCell>
                    <TableCell className="py-4 text-base">{racer.number}</TableCell>
                    <TableCell className="py-4 text-base">{racer.team}</TableCell>
                    <TableCell className="py-4 text-base">{racer.coDriver || "-"}</TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={racer.category === "Pro" ? "default" : "secondary"}
                        className="px-3 py-1 text-base"
                      >
                        {racer.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-base">{racer.country}</TableCell>
                    <TableCell className="py-4 text-base">
                      <div className="flex items-center">
                        {racer.wins > 0 && <Trophy className="h-4 w-4 text-yellow-500 mr-1" />}
                        {racer.wins}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No racers found matching your criteria
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

      <Button
        onClick={() => setAddDialogOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        size="icon"
      >
        <Plus className="h-8 w-8" />
      </Button>

      <RacerDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        racer={selectedRacer}
        onUpdate={handleRacerUpdate}
      />

      <RacerAddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddRacer} />
    </>
  )
}
