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
import { ChevronUp, ChevronDown, Medal, Save, AlertTriangle } from "lucide-react"
import { ScoreDetailSheet } from "@/components/score-detail-sheet"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Track type
export type Track = {
  id: string
  name: string
  distance: string
  type: "Road" | "Mountain" | "Trail" | "Mixed"
  difficulty: "Easy" | "Moderate" | "Hard" | "Expert"
}

// Extended race data with penalties and track information
export type Penalty = {
  id: number
  seconds: number
  description: string
}

export type RaceScore = {
  id: number
  trackId: string
  position: number
  racerNumber: number
  racerName: string
  team: string
  time: string
  rawTime?: string
  points: number
  category: string
  penalties: Penalty[]
  notes?: string
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

// Sample race data with penalties and track information
const initialRaceScores: RaceScore[] = [
  {
    id: 1,
    trackId: "track-1",
    position: 1,
    racerNumber: 42,
    racerName: "John Smith",
    team: "Red Racers",
    rawTime: "1:23:15",
    time: "1:23:45",
    points: 25,
    category: "Pro",
    penalties: [{ id: 1, seconds: 30, description: "False start" }],
    notes: "Strong performance despite penalty",
  },
  {
    id: 2,
    trackId: "track-1",
    position: 2,
    racerNumber: 17,
    racerName: "Emma Johnson",
    team: "Blue Speedsters",
    rawTime: "1:24:12",
    time: "1:24:12",
    points: 18,
    category: "Pro",
    penalties: [],
  },
  {
    id: 3,
    trackId: "track-1",
    position: 3,
    racerNumber: 33,
    racerName: "Michael Brown",
    team: "Green Machine",
    rawTime: "1:24:33",
    time: "1:25:03",
    points: 15,
    category: "Pro",
    penalties: [{ id: 2, seconds: 30, description: "Course deviation" }],
  },
  {
    id: 4,
    trackId: "track-2",
    position: 1,
    racerNumber: 8,
    racerName: "Sarah Davis",
    team: "Yellow Lightning",
    rawTime: "0:45:47",
    time: "0:45:47",
    points: 25,
    category: "Pro",
    penalties: [],
  },
  {
    id: 5,
    trackId: "track-2",
    position: 2,
    racerNumber: 21,
    racerName: "David Wilson",
    team: "Purple Power",
    rawTime: "0:46:30",
    time: "0:46:30",
    points: 18,
    category: "Pro",
    penalties: [],
  },
  {
    id: 6,
    trackId: "track-2",
    position: 3,
    racerNumber: 55,
    racerName: "Lisa Martinez",
    team: "Orange Flames",
    rawTime: "0:46:45",
    time: "0:47:15",
    points: 15,
    category: "Amateur",
    penalties: [{ id: 3, seconds: 30, description: "Equipment violation" }],
  },
  {
    id: 7,
    trackId: "track-3",
    position: 1,
    racerNumber: 12,
    racerName: "Robert Taylor",
    team: "Silver Streaks",
    rawTime: "0:18:02",
    time: "0:18:02",
    points: 25,
    category: "Amateur",
    penalties: [],
  },
  {
    id: 8,
    trackId: "track-3",
    position: 2,
    racerNumber: 29,
    racerName: "Jennifer Anderson",
    team: "Black Bolts",
    rawTime: "0:18:45",
    time: "0:18:45",
    points: 18,
    category: "Amateur",
    penalties: [],
  },
  {
    id: 9,
    trackId: "track-3",
    position: 3,
    racerNumber: 7,
    racerName: "Thomas White",
    team: "Gold Gliders",
    rawTime: "0:19:03",
    time: "0:19:33",
    points: 15,
    category: "Amateur",
    penalties: [{ id: 4, seconds: 30, description: "Late check-in" }],
  },
  {
    id: 10,
    trackId: "track-4",
    position: 1,
    racerNumber: 39,
    racerName: "Jessica Lee",
    team: "Bronze Blazers",
    rawTime: "1:29:48",
    time: "1:30:18",
    points: 25,
    category: "Amateur",
    penalties: [{ id: 5, seconds: 30, description: "Unsportsmanlike conduct" }],
  },
]

type SortField = "position" | "racerNumber" | "racerName" | "team" | "time" | "points" | "category"
type SortDirection = "asc" | "desc"

export function RaceScoreList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("position")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedScore, setSelectedScore] = useState<RaceScore | null>(null)
  const [raceScores, setRaceScores] = useState<RaceScore[]>(initialRaceScores)
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<string>("track-1")
  const { toast } = useToast()

  const itemsPerPage = 5

  // Filter scores by selected track
  const filteredScores = raceScores.filter((score) => score.trackId === selectedTrack)
  const totalPages = Math.ceil(filteredScores.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedScores = [...filteredScores].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const paginatedScores = sortedScores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  const handleRowClick = (score: RaceScore) => {
    setSelectedScore(score)
  }

  const handleScoreUpdate = (updatedScore: RaceScore) => {
    const updatedScores = raceScores.map((score) => (score.id === updatedScore.id ? updatedScore : score))

    // Re-sort and recalculate positions for the specific track
    const trackScores = updatedScores.filter((score) => score.trackId === updatedScore.trackId)

    // Sort by time
    const sortedByTime = [...trackScores].sort((a, b) => {
      // Convert time strings to seconds for comparison
      const aTimeInSeconds = convertTimeToSeconds(a.time)
      const bTimeInSeconds = convertTimeToSeconds(b.time)
      return aTimeInSeconds - bTimeInSeconds
    })

    // Update positions for this track only
    const rerankedTrackScores = sortedByTime.map((score, index) => ({
      ...score,
      position: index + 1,
    }))

    // Merge back with scores from other tracks
    const otherScores = updatedScores.filter((score) => score.trackId !== updatedScore.trackId)
    const finalScores = [...otherScores, ...rerankedTrackScores]

    setRaceScores(finalScores)
    setHasChanges(true)

    // Update the selected score if it's still open
    if (selectedScore && selectedScore.id === updatedScore.id) {
      const updatedSelectedScore = finalScores.find((s) => s.id === updatedScore.id)
      if (updatedSelectedScore) {
        setSelectedScore(updatedSelectedScore)
      }
    }
  }

  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    setHasChanges(false)
    toast({
      title: "Changes saved",
      description: "Race scores have been updated successfully.",
    })
  }

  const handleTrackChange = (trackId: string) => {
    setSelectedTrack(trackId)
    setCurrentPage(1) // Reset to first page when changing tracks
  }

  // Helper function to convert time string (MM:SS:ms) to seconds
  const convertTimeToSeconds = (timeString: string): number => {
    const parts = timeString.split(":")
    if (parts.length === 2) {
      // MM:SS format
      const [minutes, seconds] = parts.map(Number)
      return minutes * 60 + seconds
    } else if (parts.length === 3) {
      // HH:MM:SS format
      const [hours, minutes, seconds] = parts.map(Number)
      return hours * 3600 + minutes * 60 + seconds
    }
    return 0
  }

  // Get the selected track details
  const selectedTrackDetails = tracks.find((track) => track.id === selectedTrack)

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Race Scores</h2>
          <p className="text-muted-foreground">View and manage race scores by track</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedTrack} onValueChange={handleTrackChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select track" />
            </SelectTrigger>
            <SelectContent>
              {tracks.map((track) => (
                <SelectItem key={track.id} value={track.id}>
                  {track.name} ({track.distance})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasChanges && (
            <Button onClick={handleSaveChanges} size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {selectedTrackDetails && (
        <Card className="mb-6 p-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Track</p>
              <p className="font-medium">{selectedTrackDetails.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distance</p>
              <p className="font-medium">{selectedTrackDetails.distance}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{selectedTrackDetails.type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <Badge
                variant={
                  selectedTrackDetails.difficulty === "Easy"
                    ? "success"
                    : selectedTrackDetails.difficulty === "Moderate"
                      ? "secondary"
                      : selectedTrackDetails.difficulty === "Hard"
                        ? "default"
                        : "destructive"
                }
              >
                {selectedTrackDetails.difficulty}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden shadow-md">
        {hasChanges && (
          <div className="bg-warning/10 p-4 flex justify-between items-center border-b">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-warning mr-2" />
              <p className="text-warning-foreground font-medium">You have unsaved changes</p>
            </div>
            <Button onClick={handleSaveChanges} size="lg" className="px-6">
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </Button>
          </div>
        )}

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
                    onClick={() => handleSort("time")}
                  >
                    Time {renderSortIcon("time")}
                  </Button>
                </TableHead>
                <TableHead className="w-20 text-right py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center p-0 h-auto font-semibold ml-auto"
                    onClick={() => handleSort("points")}
                  >
                    Pts {renderSortIcon("points")}
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
                <TableHead className="w-24 py-4">Penalties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedScores.length > 0 ? (
                paginatedScores.map((score) => (
                  <TableRow
                    key={score.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(score)}
                  >
                    <TableCell className="font-medium py-5">
                      <div className="flex items-center">
                        {score.position <= 3 && <Medal className={`mr-1 h-5 w-5 ${getMedalColor(score.position)}`} />}
                        {score.position}
                      </div>
                    </TableCell>
                    <TableCell className="py-5">{score.racerNumber}</TableCell>
                    <TableCell className="font-medium py-5">{score.racerName}</TableCell>
                    <TableCell className="py-5">{score.team}</TableCell>
                    <TableCell className="py-5">{score.time}</TableCell>
                    <TableCell className="text-right font-semibold py-5">{score.points}</TableCell>
                    <TableCell className="py-5">
                      <Badge variant={score.category === "Pro" ? "default" : "secondary"} className="px-3 py-1 text-sm">
                        {score.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5">
                      {score.penalties.length > 0 && (
                        <Badge variant="destructive" className="px-3 py-1 text-sm">
                          {score.penalties.length}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No race scores found for this track
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {paginatedScores.length > 0 && (
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

      <ScoreDetailSheet
        score={selectedScore}
        onClose={() => setSelectedScore(null)}
        onUpdate={handleScoreUpdate}
        tracks={tracks}
      />
    </>
  )
}
