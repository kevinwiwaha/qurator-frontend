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
import { Card } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Medal, Flag, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Track type
export type Track = {
  id: string
  name: string
  distance: string
  type: "Road" | "Mountain" | "Trail" | "Mixed"
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert"
}

// Penalty type
export type Penalty = {
  id: number
  seconds: number
  description: string
}

// Leaderboard entry type
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

// Sample leaderboard data
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

// Class-based leaderboard
const getClassLeaderboard = (entries: LeaderboardEntry[], category: string) => {
  if (category === "all") return entries

  const filteredEntries = entries.filter((entry) => entry.category === category)

  // Recalculate positions within the category
  return filteredEntries.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }))
}

// Track and class-based leaderboard
const getTrackClassLeaderboard = (entries: LeaderboardEntry[], trackId: string, category: string) => {
  let filteredEntries = entries

  // Filter by category if specified
  if (category !== "all") {
    filteredEntries = filteredEntries.filter((entry) => entry.category === category)
  }

  // If a specific track is selected, sort by position in that track
  if (trackId !== "all") {
    filteredEntries = filteredEntries
      .filter((entry) => entry.results.some((result) => result.trackId === trackId))
      .sort((a, b) => {
        const aResult = a.results.find((r) => r.trackId === trackId)
        const bResult = b.results.find((r) => r.trackId === trackId)

        if (!aResult) return 1
        if (!bResult) return -1

        return aResult.position - bResult.position
      })
  }

  // Recalculate positions
  return filteredEntries.map((entry, index) => ({
    ...entry,
    position: index + 1,
  }))
}

type SortField = "position" | "racerNumber" | "racerName" | "team" | "category" | "totalPoints"
type SortDirection = "asc" | "desc"

export function LeaderboardList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("position")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard)
  const [viewType, setViewType] = useState<"overall" | "class" | "track">("overall")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTrack, setSelectedTrack] = useState<string>("all")
  const [displayedLeaderboard, setDisplayedLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard)

  const itemsPerPage = 5

  // Update displayed leaderboard when filters change
  useEffect(() => {
    let filtered = [...initialLeaderboard]

    // Filter by category if specified
    if (selectedCategory !== "all") {
      filtered = filtered.filter((entry) => entry.category === selectedCategory)
    }

    // Filter by track if specified
    if (selectedTrack !== "all") {
      filtered = filtered.filter((entry) => entry.results.some((result) => result.trackId === selectedTrack))

      // If filtering by track, sort by position in that track
      filtered.sort((a, b) => {
        const aResult = a.results.find((r) => r.trackId === selectedTrack)
        const bResult = b.results.find((r) => r.trackId === selectedTrack)

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
  }, [selectedCategory, selectedTrack])

  const totalPages = Math.ceil(displayedLeaderboard.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedLeaderboard = [...displayedLeaderboard].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const paginatedLeaderboard = sortedLeaderboard.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-700"
      default:
        return "text-gray-300"
    }
  }

  // Get the track name from ID
  const getTrackName = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId)
    return track ? track.name : trackId
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {selectedTrack === "all" ? "Overall Leaderboard" : `${getTrackName(selectedTrack)} Leaderboard`}
            {selectedCategory !== "all" ? ` - ${selectedCategory}` : ""}
          </h2>
          <p className="text-muted-foreground">
            {selectedTrack === "all"
              ? "Rankings based on total points across all tracks"
              : `Rankings for ${getTrackName(selectedTrack)}`}
            {selectedCategory !== "all" ? ` in ${selectedCategory} category` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Export Results
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("position")}
                  >
                    Pos {renderSortIcon("position")}
                  </Button>
                </TableHead>
                <TableHead className="w-16 py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("racerNumber")}
                  >
                    # {renderSortIcon("racerNumber")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("racerName")}
                  >
                    Racer {renderSortIcon("racerName")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">Co-Driver</TableHead>
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("team")}
                  >
                    Team {renderSortIcon("team")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold"
                    onClick={() => handleSort("category")}
                  >
                    Category {renderSortIcon("category")}
                  </Button>
                </TableHead>
                <TableHead className="w-20 text-right py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold ml-auto"
                    onClick={() => handleSort("totalPoints")}
                  >
                    Points {renderSortIcon("totalPoints")}
                  </Button>
                </TableHead>
                <TableHead className="py-4">Best Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLeaderboard.length > 0 ? (
                paginatedLeaderboard.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center">
                        {entry.position <= 3 && <Medal className={`mr-1 h-5 w-5 ${getMedalColor(entry.position)}`} />}
                        {entry.position}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">{entry.racerNumber}</TableCell>
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {entry.racerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {entry.racerName}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">{entry.coDriver || "-"}</TableCell>
                    <TableCell className="py-5">{entry.team}</TableCell>
                    <TableCell className="py-5">
                      <Badge variant={entry.category === "Pro" ? "default" : "secondary"} className="px-3 py-1 text-sm">
                        {entry.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold py-5">{entry.totalPoints}</TableCell>
                    <TableCell className="py-5">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Flag className="h-4 w-4 mr-1 text-primary" />
                          <span className="font-medium">P{entry.bestResult.position}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {getTrackName(entry.bestResult.trackId)}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {paginatedLeaderboard.length > 0 && (
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
    </>
  )
}
