"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Timer, AlertTriangle, Plus, Clock, Users, ChevronRight } from "lucide-react"
import TimingEntryDialog from "@/components/timing/timing-entry-dialog"
import { useToast } from "@/hooks/use-toast"

// Penalty type for timing
type TimingPenalty = {
  id: number
  seconds: number
  description: string
}

// Racer data type for timing
type TimingRacer = {
  id: number
  trackId: string
  number: number
  name: string
  team: string
  category: string
  elapsedTime: number | null
  status: "Not Started" | "Finished" | "DNF" | "DSQ"
  penalties: TimingPenalty[]
}

// Track type
type Track = {
  id: string
  name: string
}

// Mock data for tracks
const mockTracks: Track[] = [
  { id: "track1", name: "SCS 1" },
  { id: "track2", name: "SCS 2" },
  { id: "track3", name: "SCS 3" },
  { id: "track4", name: "SCS 4" },
  { id: "track5", name: "SCS 5" },
  { id: "track6", name: "SCS 6" },
  { id: "track7", name: "SCS 7" },
  { id: "track1t", name: "SCS 1 Team" },
  { id: "track2t", name: "SCS 2 Team" },
  { id: "track3t", name: "SCS 3 Team" },
]

// Mock data for racers
const mockRacers: TimingRacer[] = [
  {
    id: 1,
    trackId: "track1",
    number: 101,
    name: "Alex Johnson",
    team: "Team Alpha",
    category: "Elite",
    elapsedTime: 3620000, // 1:00:20
    status: "Finished",
    penalties: [{ id: 1, seconds: 30, description: "False start" }],
  },
  {
    id: 2,
    trackId: "track1",
    number: 102,
    name: "Sam Wilson",
    team: "Team Beta",
    category: "Amateur",
    elapsedTime: 3780000, // 1:03:00
    status: "Finished",
    penalties: [],
  },
  {
    id: 3,
    trackId: "track1",
    number: 103,
    name: "Jamie Smith",
    team: "Team Gamma",
    category: "Elite",
    elapsedTime: null,
    status: "Not Started",
    penalties: [],
  },
  {
    id: 4,
    trackId: "track2",
    number: 201,
    name: "Taylor Brown",
    team: "Team Delta",
    category: "Amateur",
    elapsedTime: 4200000, // 1:10:00
    status: "Finished",
    penalties: [{ id: 1, seconds: 60, description: "Course deviation" }],
  },
  {
    id: 5,
    trackId: "track2",
    number: 202,
    name: "Morgan Lee",
    team: "Team Epsilon",
    category: "Elite",
    elapsedTime: null,
    status: "DNF",
    penalties: [],
  },
  {
    id: 6,
    trackId: "track3",
    number: 301,
    name: "Casey Davis",
    team: "Team Zeta",
    category: "Elite",
    elapsedTime: 5400000, // 1:30:00
    status: "Finished",
    penalties: [],
  },
]

// Format milliseconds to a readable time string
const formatTime = (time: number | null): string => {
  if (time === null) return "--:--:--"

  const totalSeconds = Math.floor(time / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

interface TimingConsoleProps {
  searchTerm?: string
  trackFilter?: string
  categoryFilter?: string
  addTimeDialogOpen?: boolean
  setAddTimeDialogOpen?: (open: boolean) => void
}

export function TimingConsole({
  searchTerm = "",
  trackFilter = "all",
  categoryFilter = "all",
  addTimeDialogOpen = false,
  setAddTimeDialogOpen = () => {},
}: TimingConsoleProps) {
  const [selectedTrack, setSelectedTrack] = useState<string>("track1")
  const [racers, setRacers] = useState<TimingRacer[]>(mockRacers)
  const [filteredRacers, setFilteredRacers] = useState<TimingRacer[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editRacer, setEditRacer] = useState<TimingRacer | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const { toast } = useToast()

  // Update selected track when trackFilter changes
  useEffect(() => {
    if (trackFilter !== "all") {
      setSelectedTrack(trackFilter)
    }
  }, [trackFilter])

  // Filter racers by selected track, category, and search term
  useEffect(() => {
    let filtered = racers

    // Apply track filter
    if (trackFilter !== "all") {
      filtered = filtered.filter((racer) => racer.trackId === trackFilter)
    } else if (selectedTrack) {
      filtered = filtered.filter((racer) => racer.trackId === selectedTrack)
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((racer) => racer.category.toLowerCase() === categoryFilter)
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (racer) =>
          racer.name.toLowerCase().includes(term) ||
          racer.team.toLowerCase().includes(term) ||
          racer.number.toString().includes(term),
      )
    }

    setFilteredRacers(filtered)
  }, [selectedTrack, racers, categoryFilter, searchTerm, trackFilter])

  // Handle adding a new time record
  const handleAddTimeRecord = (newRacer: TimingRacer) => {
    // Generate a new ID for the racer
    const newId = Math.max(...racers.map((r) => r.id)) + 1

    // Add the track ID
    const racerWithTrack = {
      ...newRacer,
      id: newId,
      trackId: selectedTrack,
    }

    // Add to racers list
    setRacers([...racers, racerWithTrack])
    setDialogOpen(false)

    toast({
      title: "Time record added",
      description: `Added time record for ${newRacer.name}`,
    })
  }

  // Handle updating a time record
  const handleUpdateTimeRecord = (updatedRacer: TimingRacer) => {
    setRacers(racers.map((r) => (r.id === updatedRacer.id ? updatedRacer : r)))
    setDialogOpen(false)

    toast({
      title: "Time record updated",
      description: `Updated time record for ${updatedRacer.name}`,
    })
  }

  // Open dialog to add a new time record
  const openAddDialog = () => {
    setDialogMode("add")
    setEditRacer(null)
    setDialogOpen(true)
    if (setAddTimeDialogOpen) {
      setAddTimeDialogOpen(false)
    }
  }

  // Open dialog to edit a time record
  const openEditDialog = (racer: TimingRacer) => {
    setDialogMode("edit")
    setEditRacer(racer)
    setDialogOpen(true)
  }

  // Get all racers for dropdown selection (for adding new time records)
  const getAllRacers = () => {
    // In a real app, this would fetch from an API
    return mockRacers
  }

  // Get the current track name
  const currentTrackName = mockTracks.find((track) => track.id === selectedTrack)?.name || "Track"

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Finished":
        return "default"
      case "Not Started":
        return "outline"
      case "DNF":
      case "DSQ":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Get status color for left border
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Finished":
        return "border-green-500"
      case "Not Started":
        return "border-gray-300"
      case "DNF":
      case "DSQ":
        return "border-red-500"
      default:
        return "border-gray-300"
    }
  }

  // Use the external dialog state if provided
  useEffect(() => {
    if (addTimeDialogOpen) {
      openAddDialog()
    }
  }, [addTimeDialogOpen])

  return (
    <div className="p-4 space-y-6 relative pb-20">
      {/* Timing data display */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{currentTrackName} Timing</CardTitle>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[calc(100vh-280px)]">
            {filteredRacers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Timer className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No timing data found</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  {searchTerm || categoryFilter !== "all" || trackFilter !== "all"
                    ? "Try adjusting your filters to see more results"
                    : "Add time records for racers on this track to see them here"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredRacers.map((racer) => (
                  <div
                    key={racer.id}
                    className={`border rounded-md py-2 px-3 cursor-pointer hover:bg-muted/50 transition-colors ${getStatusColor(
                      racer.status,
                    )} border-l-[3px]`}
                    onClick={() => openEditDialog(racer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center font-medium text-sm">
                          {racer.number}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{racer.name}</h3>
                            <Badge variant="outline" className="px-1.5 py-0 text-xs">
                              {racer.category}
                            </Badge>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {racer.team}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <div className="font-mono font-medium flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            {formatTime(racer.elapsedTime)}
                          </div>

                          {racer.penalties.length > 0 && (
                            <div className="flex items-center text-warning text-xs mt-0.5">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              <span>{racer.penalties.length}</span>
                            </div>
                          )}
                        </div>

                        <Badge variant={getStatusBadgeVariant(racer.status)} className="h-6">
                          {racer.status}
                        </Badge>

                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Floating Add Button */}
      <Button onClick={openAddDialog} className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
        <Plus className="h-6 w-6" />
      </Button>

      <TimingEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        racer={editRacer}
        racers={getAllRacers()}
        onAdd={handleAddTimeRecord}
        onUpdate={handleUpdateTimeRecord}
      />
    </div>
  )
}
