"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Save, X, Calendar, MapPin, Users, Globe, Mail, Phone, User, Plus, Trash2, Route } from "lucide-react"
import type { Event, EventRacer, Track } from "@/components/events/events-list"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface EventDetailSheetProps {
  event: Event | null
  onClose: () => void
  onUpdate: (updatedEvent: Event) => void
  availableRacers: EventRacer[]
  availableTracks: Track[]
}

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Event name is required" }),
  date: z.string(),
  location: z.string(),
  status: z.string(),
  participants: z.coerce.number().int().nonnegative(),
  description: z.string().optional(),
  organizer: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function EventDetailSheet({
  event,
  onClose,
  onUpdate,
  availableRacers,
  availableTracks,
}: EventDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [addRacerDialogOpen, setAddRacerDialogOpen] = useState(false)
  const [addTrackDialogOpen, setAddTrackDialogOpen] = useState(false)
  const [selectedRacers, setSelectedRacers] = useState<number[]>([])
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [searchRacer, setSearchRacer] = useState("")
  const [searchTrack, setSearchTrack] = useState("")

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      date: "",
      location: "",
      status: "",
      participants: 0,
      description: "",
      organizer: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      notes: "",
    },
  })

  // Update form values when event changes
  useEffect(() => {
    if (event) {
      setIsOpen(true)
      form.reset({
        name: event.name,
        date: event.date,
        location: event.location,
        status: event.status,
        participants: event.participants,
        description: event.description || "",
        organizer: event.organizer || "",
        contactEmail: event.contactEmail || "",
        contactPhone: event.contactPhone || "",
        website: event.website || "",
        notes: event.notes || "",
      })
    } else {
      setIsOpen(false)
    }
  }, [event, form])

  const handleClose = () => {
    setIsOpen(false)
    // Small delay to allow animation to complete
    setTimeout(onClose, 300)
  }

  const onSubmit = (data: FormValues) => {
    if (!event) return

    const updatedEvent: Event = {
      ...event,
      name: data.name,
      date: data.date,
      location: data.location,
      status: data.status as "Upcoming" | "In Progress" | "Completed" | "Cancelled",
      participants: data.participants,
      description: data.description,
      organizer: data.organizer,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      website: data.website,
      notes: data.notes,
    }

    onUpdate(updatedEvent)
  }

  const handleRemoveRacer = (racerId: number) => {
    if (!event) return

    const updatedRacers = event.racers.filter((racer) => racer.id !== racerId)
    const updatedEvent = { ...event, racers: updatedRacers }
    onUpdate(updatedEvent)
  }

  const handleRemoveTrack = (trackId: string) => {
    if (!event) return

    const updatedTracks = event.tracks.filter((track) => track.id !== trackId)
    const updatedEvent = { ...event, tracks: updatedTracks }
    onUpdate(updatedEvent)
  }

  const handleAddRacers = () => {
    if (!event) return

    // Get the selected racers from available racers
    const racersToAdd = availableRacers.filter(
      (racer) => selectedRacers.includes(racer.id) && !event.racers.some((r) => r.id === racer.id),
    )

    // Add the selected racers to the event
    const updatedRacers = [...event.racers, ...racersToAdd]
    const updatedEvent = { ...event, racers: updatedRacers }
    onUpdate(updatedEvent)

    // Close the dialog and reset selection
    setAddRacerDialogOpen(false)
    setSelectedRacers([])
  }

  const handleAddTracks = () => {
    if (!event) return

    // Get the selected tracks from available tracks
    const tracksToAdd = availableTracks.filter(
      (track) => selectedTracks.includes(track.id) && !event.tracks.some((t) => t.id === track.id),
    )

    // Add the selected tracks to the event
    const updatedTracks = [...event.tracks, ...tracksToAdd]
    const updatedEvent = { ...event, tracks: updatedTracks }
    onUpdate(updatedEvent)

    // Close the dialog and reset selection
    setAddTrackDialogOpen(false)
    setSelectedTracks([])
  }

  const toggleRacerSelection = (racerId: number) => {
    if (selectedRacers.includes(racerId)) {
      setSelectedRacers(selectedRacers.filter((id) => id !== racerId))
    } else {
      setSelectedRacers([...selectedRacers, racerId])
    }
  }

  const toggleTrackSelection = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter((id) => id !== trackId))
    } else {
      setSelectedTracks([...selectedTracks, trackId])
    }
  }

  // Filter racers based on search term
  const filteredAvailableRacers = availableRacers.filter((racer) => {
    if (!searchRacer) return true
    const term = searchRacer.toLowerCase()
    return (
      racer.name.toLowerCase().includes(term) ||
      racer.team.toLowerCase().includes(term) ||
      racer.number.toString().includes(term) ||
      racer.category.toLowerCase().includes(term)
    )
  })

  // Filter tracks based on search term
  const filteredAvailableTracks = availableTracks.filter((track) => {
    if (!searchTrack) return true
    const term = searchTrack.toLowerCase()
    return (
      track.name.toLowerCase().includes(term) ||
      track.type.toLowerCase().includes(term) ||
      track.difficulty.toLowerCase().includes(term)
    )
  })

  // Get difficulty badge color
  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-blue-100 text-blue-800"
      case "Hard":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!event) return null

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-0" side="right">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-start mb-4">
                <SheetTitle className="text-2xl">{event.name}</SheetTitle>
                <Button variant="ghost" size="icon" onClick={handleClose} className="h-9 w-9">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SheetDescription>View and edit event information</SheetDescription>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="racers">Racers</TabsTrigger>
                  <TabsTrigger value="tracks">Tracks</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="details" className="p-6 space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Event Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-12 text-base" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Date</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                                <Input {...field} type="date" className="h-12 text-base" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Location</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                                <Input {...field} className="h-12 text-base" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Status</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="h-12 text-base">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Upcoming">Upcoming</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="participants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Max Participants</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                                <Input {...field} type="number" className="h-12 text-base" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe the event"
                              className="resize-none text-base"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={form.control}
                      name="organizer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Organizer</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <User className="mr-2 h-5 w-5 text-muted-foreground" />
                              <Input {...field} className="h-12 text-base" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Contact Email</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                                <Input {...field} type="email" className="h-12 text-base" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Contact Phone</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                                <Input {...field} className="h-12 text-base" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Website</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Globe className="mr-2 h-5 w-5 text-muted-foreground" />
                              <Input {...field} className="h-12 text-base" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Additional notes about the event"
                              className="resize-none text-base"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" className="h-12 px-6 text-base">
                        <Save className="mr-2 h-5 w-5" />
                        Save Details
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="racers" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Registered Racers</h3>
                  <Button onClick={() => setAddRacerDialogOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Racers
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  {event.racers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-lg">
                      <Users className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No racers registered</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">Add racers to this event to see them here</p>
                      <Button onClick={() => setAddRacerDialogOpen(true)} className="mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Racers
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {event.racers.map((racer) => (
                        <Card key={racer.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {racer.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{racer.name}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span>#{racer.number}</span>
                                    <span>•</span>
                                    <span>{racer.team}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={racer.category === "Pro" ? "default" : "secondary"}>
                                  {racer.category}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveRacer(racer.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                            {racer.coDriver && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Co-Driver:</span> {racer.coDriver}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="tracks" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Event Tracks</h3>
                  <Button onClick={() => setAddTrackDialogOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tracks
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  {event.tracks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-lg">
                      <Route className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No tracks added</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">Add tracks to this event to see them here</p>
                      <Button onClick={() => setAddTrackDialogOpen(true)} className="mt-4" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tracks
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {event.tracks.map((track) => (
                        <Card key={track.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{track.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span>{track.distance}</span>
                                  <span>•</span>
                                  <span>{track.type}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getDifficultyBadgeColor(track.difficulty)}>{track.difficulty}</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveTrack(track.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </div>

            <div className="p-6 border-t mt-auto sticky bottom-0 bg-white">
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="h-12 px-5 text-base">
                  Close
                </Button>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="h-12 px-6 text-base"
                  disabled={activeTab !== "details"}
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Racers Dialog */}
      <Dialog open={addRacerDialogOpen} onOpenChange={setAddRacerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Racers</DialogTitle>
            <DialogDescription>Select racers to add to this event.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <Input
                placeholder="Search racers..."
                value={searchRacer}
                onChange={(e) => setSearchRacer(e.target.value)}
                className="w-full"
              />
            </div>

            <ScrollArea className="h-[300px] pr-4">
              {filteredAvailableRacers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No racers found matching your search</div>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableRacers
                    .filter((racer) => !event?.racers.some((r) => r.id === racer.id))
                    .map((racer) => (
                      <div
                        key={racer.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                        onClick={() => toggleRacerSelection(racer.id)}
                      >
                        <Checkbox
                          checked={selectedRacers.includes(racer.id)}
                          onCheckedChange={() => toggleRacerSelection(racer.id)}
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center font-medium">
                              {racer.number}
                            </div>
                            <div>
                              <div className="font-medium">{racer.name}</div>
                              <div className="text-sm text-muted-foreground">{racer.team}</div>
                            </div>
                          </div>
                          <Badge variant={racer.category === "Pro" ? "default" : "secondary"}>{racer.category}</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRacerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRacers} disabled={selectedRacers.length === 0}>
              Add Selected ({selectedRacers.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tracks Dialog */}
      <Dialog open={addTrackDialogOpen} onOpenChange={setAddTrackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Tracks</DialogTitle>
            <DialogDescription>Select tracks to add to this event.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <Input
                placeholder="Search tracks..."
                value={searchTrack}
                onChange={(e) => setSearchTrack(e.target.value)}
                className="w-full"
              />
            </div>

            <ScrollArea className="h-[300px] pr-4">
              {filteredAvailableTracks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No tracks found matching your search</div>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableTracks
                    .filter((track) => !event?.tracks.some((t) => t.id === track.id))
                    .map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                        onClick={() => toggleTrackSelection(track.id)}
                      >
                        <Checkbox
                          checked={selectedTracks.includes(track.id)}
                          onCheckedChange={() => toggleTrackSelection(track.id)}
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{track.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {track.distance} • {track.type}
                            </div>
                          </div>
                          <Badge className={getDifficultyBadgeColor(track.difficulty)}>{track.difficulty}</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddTrackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTracks} disabled={selectedTracks.length === 0}>
              Add Selected ({selectedTracks.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
