"use client"

import { useState, useImperativeHandle, forwardRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RacerAddDialog } from "@/components/racers/racer-add-dialog"
import { useToast } from "@/hooks/use-toast"
import { RacerDetailDialog } from "@/components/racers/racer-detail-dialog"
import type { Racer } from "@/components/racers/racers-list"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Base sample racer data
const baseRacers: Racer[] = [
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

// Generate more sample data by duplicating and modifying the base data
const generateMoreRacers = (baseRacers: Racer[], count: number): Racer[] => {
  const result: Racer[] = [...baseRacers]
  let lastId = Math.max(...baseRacers.map((r) => r.id))

  const teams = ["Alpha Racing", "Beta Team", "Gamma Racers", "Delta Speed", "Omega Motors", "Sigma Racing"]
  const countries = ["Brazil", "Japan", "Sweden", "South Africa", "Mexico", "New Zealand", "Russia", "China"]

  for (let i = 0; i < count; i++) {
    const baseRacer = baseRacers[i % baseRacers.length]
    lastId++

    // Create a modified version of the base racer
    const newRacer: Racer = {
      ...baseRacer,
      id: lastId,
      name: `${baseRacer.name.split(" ")[0]} ${String.fromCharCode(65 + (i % 26))}`,
      number: baseRacer.number + 100 + i,
      team: teams[i % teams.length],
      country: countries[i % countries.length],
      age: Math.max(18, Math.min(50, baseRacer.age + (i % 10) - 5)),
      totalRaces: Math.max(0, baseRacer.totalRaces + (i % 15) - 7),
      wins: Math.max(0, Math.min(baseRacer.totalRaces, i % 8)),
    }

    result.push(newRacer)
  }

  return result
}

// Generate 30 more racers for a total of 38
const initialRacers = generateMoreRacers(baseRacers, 30)

export interface ModernRacersListRef {
  onAddRacer: () => void
}

interface ModernRacersListProps {
  searchTerm?: string
  categoryFilter?: string
  onAddRacer?: (callback: () => void) => void
}

export const ModernRacersList = forwardRef<ModernRacersListRef, ModernRacersListProps>(
  ({ searchTerm = "", categoryFilter = "all", onAddRacer }, ref) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [sortKey, setSortKey] = useState<string>("name")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [selectedRacer, setSelectedRacer] = useState<Racer | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [racers, setRacers] = useState<Racer[]>(initialRacers)
    const [addDialogOpen, setAddDialogOpen] = useState(false)
    const { toast } = useToast()

    const itemsPerPage = 10

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      onAddRacer: () => setAddDialogOpen(true),
    }))

    // Register the callback if provided
    if (onAddRacer) {
      onAddRacer(() => setAddDialogOpen(true))
    }

    const handleSort = (key: string) => {
      if (key === sortKey) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortKey(key)
        setSortDirection("asc")
      }
    }

    const filteredAndSortedRacers = [...racers]
      .filter((racer) => {
        // Apply search filter if there's a search term
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
        // Apply category filter if it's not "all"
        if (categoryFilter !== "all") {
          return racer.category.toLowerCase() === categoryFilter
        }
        return true
      })
      .sort((a, b) => {
        const aValue = a[sortKey as keyof typeof a]
        const bValue = b[sortKey as keyof typeof a]

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

    // Calculate pagination
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
      <div className="flex flex-col">
        {/* Table content */}
        <div className="bg-white rounded-lg shadow-sm border mb-4 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full divide-y divide-gray-100 border-collapse">
              <thead className="bg-white sticky top-0 z-10 shadow-sm border-b">
                <tr>
                  <th className="w-[60px] px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      {sortKey === "name" &&
                        (sortDirection === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        ))}
                    </div>
                  </th>
                  <th
                    className="w-[60px] px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort("number")}
                  >
                    <div className="flex items-center">
                      #
                      {sortKey === "number" &&
                        (sortDirection === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort("team")}
                  >
                    <div className="flex items-center">
                      Team
                      {sortKey === "team" &&
                        (sortDirection === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort("coDriver")}
                  >
                    <div className="flex items-center">
                      Co-Driver
                      {sortKey === "coDriver" &&
                        (sortDirection === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      {sortKey === "category" &&
                        (sortDirection === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort("country")}
                  >
                    <div className="flex items-center">
                      Country
                      {sortKey === "country" &&
                        (sortDirection === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        ))}
                    </div>
                  </th>
                  <th
                    className="w-[80px] px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort("wins")}
                  >
                    <div className="flex items-center">
                      Wins
                      {sortKey === "wins" &&
                        (sortDirection === "asc" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1 h-4 w-4 text-primary"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        ))}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedRacers.length > 0 ? (
                  paginatedRacers.map((racer) => (
                    <tr
                      key={racer.id}
                      className="hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer"
                      onClick={() => handleRowClick(racer)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                        <Avatar>
                          <AvatarImage src={racer.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {racer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{racer.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{racer.number}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{racer.team}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{racer.coDriver || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                        <Badge variant={racer.category === "Pro" ? "default" : "secondary"} className="font-normal">
                          {racer.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{racer.country}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">
                        <div className="flex items-center">
                          {racer.wins > 0 && <Trophy className="h-4 w-4 text-yellow-500 mr-1" />}
                          {racer.wins}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <div className="text-center py-8">
                        <p className="text-lg font-medium text-gray-500">No racers found</p>
                        <p className="text-sm text-gray-400 mb-4">Add racers to see them listed here</p>
                        <Button onClick={() => setAddDialogOpen(true)} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Racer
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination at the bottom */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
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

                {Array.from({ length: totalPages }).map((_, index) => {
                  // Show first, last, current, and pages around current
                  if (
                    index === 0 ||
                    index === totalPages - 1 ||
                    index === currentPage - 1 ||
                    Math.abs(index - (currentPage - 1)) <= 1
                  ) {
                    return (
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
                    )
                  }

                  // Show ellipsis for gaps
                  if ((index === 1 && currentPage > 3) || (index === totalPages - 2 && currentPage < totalPages - 2)) {
                    return (
                      <PaginationItem key={index}>
                        <span className="flex h-10 w-10 items-center justify-center">...</span>
                      </PaginationItem>
                    )
                  }

                  return null
                })}

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

        <RacerDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          racer={selectedRacer}
          onUpdate={handleRacerUpdate}
        />

        <RacerAddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddRacer} />
      </div>
    )
  },
)

ModernRacersList.displayName = "ModernRacersList"
