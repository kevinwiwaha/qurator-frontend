"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Medal, Clock, AlertTriangle, Plus, Trash2, Save, X, User, MapPin } from "lucide-react"
import type { RaceScore, Track } from "@/components/race-score-list"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScoreDetailSheetProps {
  score: RaceScore | null
  onClose: () => void
  onUpdate: (updatedScore: RaceScore) => void
  tracks: Track[]
}

// Form schema for validation - only for editable fields
const formSchema = z.object({
  trackId: z.string(),
  rawTime: z.string().regex(/^\d+:\d{2}(:\d{2})?$/, {
    message: "Time must be in format MM:SS or HH:MM:SS",
  }),
  notes: z.string().optional(),
  penalties: z.array(
    z.object({
      id: z.number(),
      seconds: z.coerce.number().int().nonnegative(),
      description: z.string(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

export function ScoreDetailSheet({ score, onClose, onUpdate, tracks }: ScoreDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackId: "",
      rawTime: "",
      notes: "",
      penalties: [],
    },
  })

  // Update form values when score changes
  useEffect(() => {
    if (score) {
      setIsOpen(true)
      form.reset({
        trackId: score.trackId,
        rawTime: score.rawTime || score.time,
        notes: score.notes || "",
        penalties: score.penalties,
      })
    } else {
      setIsOpen(false)
    }
  }, [score, form])

  const handleClose = () => {
    setIsOpen(false)
    // Small delay to allow animation to complete
    setTimeout(onClose, 300)
  }

  const onSubmit = (data: FormValues) => {
    if (!score) return

    // Calculate total penalty time
    const totalPenaltySeconds = data.penalties.reduce((total, penalty) => total + penalty.seconds, 0)

    // Parse raw time
    const timeParts = data.rawTime.split(":")
    let minutes = 0
    let seconds = 0

    if (timeParts.length === 2) {
      // MM:SS format
      ;[minutes, seconds] = timeParts.map(Number)
    } else if (timeParts.length === 3) {
      // HH:MM:SS format
      const [hours, mins, secs] = timeParts.map(Number)
      minutes = hours * 60 + mins
      seconds = secs
    }

    // Calculate final time with penalties
    const totalSeconds = minutes * 60 + seconds + totalPenaltySeconds
    const finalMinutes = Math.floor(totalSeconds / 60)
    const finalSeconds = totalSeconds % 60

    // Format the final time
    let finalTime = ""
    if (finalMinutes >= 60) {
      const hours = Math.floor(finalMinutes / 60)
      const mins = finalMinutes % 60
      finalTime = `${hours}:${mins.toString().padStart(2, "0")}:${finalSeconds.toString().padStart(2, "0")}`
    } else {
      finalTime = `${finalMinutes}:${finalSeconds.toString().padStart(2, "0")}`
    }

    const updatedScore: RaceScore = {
      ...score,
      // Update the track if changed
      trackId: data.trackId,
      // Preserve the original immutable fields
      racerName: score.racerName,
      racerNumber: score.racerNumber,
      team: score.team,
      category: score.category,
      // Update the editable fields
      rawTime: data.rawTime,
      time: finalTime,
      notes: data.notes,
      penalties: data.penalties,
    }

    onUpdate(updatedScore)
  }

  const addPenalty = () => {
    const currentPenalties = form.getValues("penalties") || []
    const newId = currentPenalties.length > 0 ? Math.max(...currentPenalties.map((p) => p.id)) + 1 : 1

    form.setValue("penalties", [...currentPenalties, { id: newId, seconds: 0, description: "" }])
  }

  const removePenalty = (id: number) => {
    const currentPenalties = form.getValues("penalties")
    form.setValue(
      "penalties",
      currentPenalties.filter((penalty) => penalty.id !== id),
    )
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

  // Get the selected track details
  const selectedTrack = tracks.find((track) => score && track.id === score.trackId)

  if (!score) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-0" side="right">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b sticky top-0 bg-card z-10">
            <div className="flex justify-between items-start mb-4">
              <SheetTitle className="text-2xl flex items-center gap-2">
                {score.position <= 3 && <Medal className={`h-6 w-6 ${getMedalColor(score.position)}`} />}
                Position {score.position}
              </SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-9 w-9">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SheetDescription>View and edit race timing and penalties</SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Racer Information Card */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  Racer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-base">{score.racerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Number</p>
                    <p className="font-medium text-base">{score.racerNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team</p>
                    <p className="font-medium text-base">{score.team}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge variant={score.category === "Pro" ? "default" : "secondary"} className="mt-1">
                      {score.category}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Racer details can only be edited in the Racers section
                </div>
              </CardContent>
            </Card>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="trackId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Track</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select track" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tracks.map((track) => (
                            <SelectItem key={track.id} value={track.id}>
                              {track.name} ({track.distance})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {selectedTrack && (
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {selectedTrack.type} - {selectedTrack.difficulty}
                            </span>
                          </div>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rawTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Raw Time (MM:SS or HH:MM:SS)</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                          <Input {...field} placeholder="00:00" className="h-12 text-base" />
                        </div>
                      </FormControl>
                      <FormDescription>Enter the raw time without penalties</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Penalties</h3>
                    <Button type="button" variant="outline" onClick={addPenalty} className="h-10">
                      <Plus className="h-4 w-4 mr-2" /> Add Penalty
                    </Button>
                  </div>

                  {form.watch("penalties").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg border border-dashed">
                      No penalties recorded
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.watch("penalties").map((penalty, index) => (
                        <Card key={penalty.id} className="border border-warning/30 bg-warning/10">
                          <CardHeader className="py-3 px-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                                Penalty
                              </CardTitle>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePenalty(penalty.id)}
                                className="h-8 w-8 p-0 text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2 px-4 grid gap-3">
                            <div className="grid grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`penalties.${index}.seconds`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Seconds</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="number" className="h-10" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`penalties.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm">Reason</FormLabel>
                                    <FormControl>
                                      <Input {...field} className="h-10" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add any additional notes about this racer's performance"
                          className="resize-none text-base"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Final Time</h4>
                    <div className="flex items-center mt-1">
                      <div className="text-xl font-bold">{score.time}</div>
                      {form.watch("penalties").length > 0 && (
                        <Badge variant="outline" className="ml-2">
                          Includes penalties
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Points</h4>
                    <div className="text-xl font-bold text-right">{score.points}</div>
                  </div>
                </div>
              </form>
            </Form>
          </div>

          <div className="p-6 border-t mt-auto sticky bottom-0 bg-card">
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="h-12 px-5 text-base">
                Cancel
              </Button>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="h-12 px-6 text-base">
                <Save className="mr-2 h-5 w-5" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
