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
import { Medal, Flag, MapPin } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

// Using the same types as before
export type Track = {
  id: string
  name: string
  distance: string
  type: "Road" | "Mountain" | "Trail" | "Mixed"
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert"
}

export type Penalty = {
  id: number
  seconds: number
  description: string
}

export type LeaderboardEntry = {
  id: number
  position: number
  racerId: number
  racerNumber: number
  racerName: string
  coDriver?: string
  team: string
  category: string
  totalPoints: number
  bestResult: {
    trackId: string
    position: number
    time: string
  }
  results: {
    trackId: string
    position: number
    time: string
    points: number
  }[]
}

// Sample tracks
const tracks: Track[] = [
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

// Sample leaderboard data (using the same data as before)
const initialLeaderboard: LeaderboardEntry[] = [
  {
    id: 1,
    position: 1,
    racerId: 1,
    racerNumber: 42,
    racerName: "John Smith",
    coDriver: "Michael Roberts",
    team: "Red Racers",
    category: "Pro",
    totalPoints: 68,
    bestResult: {
      trackId: "track-1",
      position: 1,
      time: "1:23:45",
    },
    results: [
      { trackId: "track-1", position: 1, time: "1:23:45", points: 25 },
      { trackId: "track-2", position: 2, time: "0:46:12", points: 18 },
      { trackId: "track-3", position: 3, time: "0:19:33", points: 15 },
      { trackId: "track-4", position: 4, time: "1:32:18", points: 10 },
    ],
  },
  {
    id: 2,
    position: 2,
    racerId: 2,
    racerNumber: 17,
    racerName: "Emma Johnson",
    coDriver: "Sarah Williams",
    team: "Blue Speedsters",
    category: "Pro",
    totalPoints: 63,
    bestResult: {
      trackId: "track-2",
      position: 1,
      time: "0:45:47",
    },
    results: [
      { trackId: "track-1", position: 2, time: "1:24:12", points: 18 },
      { trackId: "track-2", position: 1, time: "0:45:47", points: 25 },
      { trackId: "track-3", position: 4, time: "0:19:45", points: 10 },
      { trackId: "track-4", position: 5, time: "1:33:02", points: 10 },
    ],
  },
  {
    id: 3,
    position: 3,
    racerId: 3,
    racerNumber: 33,
    racerName: "Michael Brown",
    team: "Green Machine",
    category: "Pro",
    totalPoints: 58,
    bestResult: {
      trackId: "track-4",
      position: 1,
      time: "1:29:48",
    },
    results: [
      { trackId: "track-1", position: 3, time: "1:25:03", points: 15 },
      { trackId: "track-2", position: 3, time: "0:47:15", points: 15 },
      { trackId: "track-3", position: 5, time: "0:20:01", points: 8 },
      { trackId: "track-4", position: 1, time: "1:29:48", points: 20 },
    ],
  },
  {
    id: 4,
    position: 4,
    racerId: 4,
    racerNumber: 8,
    racerName: "Sarah Davis",
    coDriver: "James Wilson",
    team: "Yellow Lightning",
    category: "Pro",
    totalPoints: 53,
    bestResult: {
      trackId: "track-3",
      position: 1,
      time: "0:18:02",
    },
    results: [
      { trackId: "track-1", position: 4, time: "1:26:33", points: 10 },
      { trackId: "track-2", position: 4, time: "0:48:05", points: 10 },
      { trackId: "track-3", position: 1, time: "0:18:02", points: 25 },
      { trackId: "track-4", position: 6, time: "1:34:15", points: 8 },
    ],
  },
  {
    id: 5,
    position: 5,
    racerId: 5,
    racerNumber: 21,
    racerName: "David Wilson",
    team: "Purple Power",
    category: "Pro",
    totalPoints: 48,
    bestResult: {
      trackId: "track-3",
      position: 2,
      time: "0:18:45",
    },
    results: [
      { trackId: "track-1", position: 5, time: "1:27:45", points: 8 },
      { trackId: "track-2", position: 5, time: "0:48:55", points: 8 },
      { trackId: "track-3", position: 2, time: "0:18:45", points: 18 },
      { trackId: "track-4", position: 3, time: "1:31:22", points: 14 },
    ],
  },
  {
    id: 6,
    position: 6,
    racerId: 6,
    racerNumber: 55,
    racerName: "Lisa Martinez",
    team: "Orange Flames",
    category: "Amateur",
    totalPoints: 45,
    bestResult: {
      trackId: "track-2",
      position: 1,
      time: "0:49:12",
    },
    results: [
      { trackId: "track-1", position: 2, time: "1:28:33", points: 18 },
      { trackId: "track-2", position: 1, time: "0:49:12", points: 25 },
      { trackId: "track-3", position: 8, time: "0:21:05", points: 2 },
      { trackId: "track-4", position: 0, time: "DNF", points: 0 },
    ],
  },
  {
    id: 7,
    position: 7,
    racerId: 7,
    racerNumber: 12,
    racerName: "Robert Taylor",
    coDriver: "Thomas Laurent",
    team: "Silver Streaks",
    category: "Amateur",
    totalPoints: 42,
    bestResult: {
      trackId: "track-3",
      position: 1,
      time: "0:20:12",
    },
    results: [
      { trackId: "track-1", position: 3, time: "1:29:15", points: 15 },
      { trackId: "track-2", position: 4, time: "0:50:33", points: 10 },
      { trackId: "track-3", position: 1, time: "0:20:12", points: 25 },
      { trackId: "track-4", position: 10, time: "1:38:45", points: 2 },
    ],
  },
  {
    id: 8,
    position: 8,
    racerId: 8,
    racerNumber: 29,
    racerName: "Jennifer Anderson",
    team: "Black Bolts",
    category: "Amateur",
    totalPoints: 38,
    bestResult: {
      trackId: "track-4",
      position: 2,
      time: "1:35:22",
    },
    results: [
      { trackId: "track-1", position: 4, time: "1:30:05", points: 10 },
      { trackId: "track-2", position: 3, time: "0:50:15", points: 15 },
      { trackId: "track-3", position: 5, time: "0:21:33", points: 8 },
      { trackId: "track-4", position: 2, time: "1:35:22", points: 5 },
    ],
  },
]

interface LeaderboardListProps {
  searchTerm?: string
  categoryFilter?: string
  trackFilter?: string
}

export function LeaderboardList({
  searchTerm = "",
  categoryFilter = "all",
  trackFilter = "all",
}: LeaderboardListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard)
  const [displayedLeaderboard, setDisplayedLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard)

  const itemsPerPage = 8 // Increased for tablet view

  // Update displayed leaderboard when filters change
  useEffect(() => {
    let filtered = [...initialLeaderboard]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.racerName.toLowerCase().includes(term) ||
          entry.team.toLowerCase().includes(term) ||
          entry.racerNumber.toString().includes(term),
      )
    }

    // Filter by category if specified
    if (categoryFilter !== "all") {
      filtered = filtered.filter((entry) => entry.category.toLowerCase() === categoryFilter.toLowerCase())
    }

    // Filter by track if specified
    if (trackFilter !== "all") {
      filtered = filtered.filter((entry) => entry.results.some((result) => result.trackId === trackFilter))

      // If filtering by track, sort by position in that track
      filtered.sort((a, b) => {
        const aResult = a.results.find((r) => r.trackId === trackFilter)
        const bResult = b.results.find((r) => r.trackId === trackFilter)

        if (!aResult) return 1
        if (!bResult) return -1

        return aResult.position - bResult.position
      })

      // Recalculate positions based on track results
      filtered = filtered.map((entry, index) => ({
        ...entry,
        position: index + 1,
      }))
    }

    setDisplayedLeaderboard(filtered)
  }, [searchTerm, categoryFilter, trackFilter])

  const totalPages = Math.ceil(displayedLeaderboard.length / itemsPerPage)
  const paginatedLeaderboard = displayedLeaderboard.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  // Get the track name from ID
  const getTrackName = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    return track ? track.name : trackId
  }

  return (
    <Card className="overflow-hidden shadow-md mb-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-16 py-4 text-base">Pos</TableHead>
              <TableHead className="w-16 py-4 text-base">#</TableHead>
              <TableHead className="py-4 text-base">Racer</TableHead>
              <TableHead className="py-4 text-base">Team</TableHead>
              <TableHead className="py-4 text-base">Category</TableHead>
              <TableHead className="w-20 text-right py-4 text-base">Points</TableHead>
              <TableHead className="py-4 text-base">Best Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeaderboard.length > 0 ? (
              paginatedLeaderboard.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                  <TableCell className="font-medium py-4 text-base">
                    <div className="flex items-center">
                      {entry.position <= 3 && <Medal className={`mr-1 h-5 w-5 ${getMedalColor(entry.position)}`} />}
                      {entry.position}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-base">{entry.racerNumber}</TableCell>
                  <TableCell className="font-medium py-4 text-base">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-base">
                          {entry.racerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div>{entry.racerName}</div>
                        {entry.coDriver && (
                          <div className="text-sm text-muted-foreground">Co-Driver: {entry.coDriver}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-base">{entry.team}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant={entry.category === "Pro" ? "default" : "secondary"} className="px-3 py-1 text-base">
                      {entry.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold py-4 text-base">{entry.totalPoints}</TableCell>
                  <TableCell className="py-4 text-base">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Flag className="h-5 w-5 mr-1 text-primary" />
                        <span className="font-medium">P{entry.bestResult.position}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {getTrackName(entry.bestResult.trackId)}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-base">
                  No results found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginatedLeaderboard.length > 0 && totalPages > 1 && (
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
                  className={`h-12 w-12 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
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
                    className="h-12 w-12 text-base"
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
                  className={`h-12 w-12 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  )
}
