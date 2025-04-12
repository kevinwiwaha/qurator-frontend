"use client"

import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, Trash2, Timer, AlertTriangle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

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

interface TimingEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  racer: TimingRacer | null
  racers?: TimingRacer[]
  onAdd: (racer: TimingRacer) => void
  onUpdate: (racer: TimingRacer) => void
}

// Form schema for validation
const formSchema = z.object({
  racerId: z.string().optional(),
  number: z.coerce.number().int().positive({ message: "Bib number is required" }),
  name: z.string().min(2, { message: "Name is required" }),
  team: z.string().optional(),
  category: z.string(),
  status: z.enum(["Not Started", "Finished", "DNF", "DSQ"]),
  hours: z.coerce.number().min(0).max(99),
  minutes: z.coerce.number().min(0).max(59),
  seconds: z.coerce.number().min(0).max(59),
  penalties: z.array(
    z.object({
      id: z.number(),
      seconds: z.coerce.number().int().nonnegative(),
      description: z.string(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

export default function TimingEntryDialog({
  open,
  onOpenChange,
  mode,
  racer,
  racers = [],
  onAdd,
  onUpdate,
}: TimingEntryDialogProps) {
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      racerId: "",
      number: 0,
      name: "",
      team: "",
      category: "Amateur",
      status: "Not Started",
      hours: 0,
      minutes: 0,
      seconds: 0,
      penalties: [],
    },
  })

  // Update form values when racer changes
  useEffect(() => {
    if (racer && mode === "edit") {
      // Convert elapsed time to hours, minutes, seconds
      let hours = 0
      let minutes = 0
      let seconds = 0

      if (racer.elapsedTime) {
        const totalSeconds = Math.floor(racer.elapsedTime / 1000)
        hours = Math.floor(totalSeconds / 3600)
        minutes = Math.floor((totalSeconds % 3600) / 60)
        seconds = Math.floor(totalSeconds % 60)
      }

      form.reset({
        racerId: racer.id.toString(),
        number: racer.number,
        name: racer.name,
        team: racer.team || "",
        category: racer.category,
        status: racer.status,
        hours,
        minutes,
        seconds,
        penalties: racer.penalties || [],
      })
    } else if (mode === "add") {
      form.reset({
        racerId: "",
        number: 0,
        name: "",
        team: "",
        category: "Amateur",
        status: "Not Started",
        hours: 0,
        minutes: 0,
        seconds: 0,
        penalties: [],
      })
    }
  }, [racer, mode, form, open])

  // Watch for racer selection changes
  const selectedRacerId = form.watch("racerId")
  const watchStatus = form.watch("status")

  useEffect(() => {
    if (mode === "add" && selectedRacerId) {
      const selectedRacer = racers.find((r) => r.id.toString() === selectedRacerId)
      if (selectedRacer) {
        form.setValue("number", selectedRacer.number)
        form.setValue("name", selectedRacer.name)
        form.setValue("team", selectedRacer.team || "")
        form.setValue("category", selectedRacer.category)
      }
    }
  }, [selectedRacerId, racers, form, mode])

  // Convert time fields to milliseconds
  const timeToMilliseconds = (hours: number, minutes: number, seconds: number): number => {
    return (hours * 3600 + minutes * 60 + seconds) * 1000
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

  const onSubmit = (data: FormValues) => {
    // Calculate total penalty time
    const totalPenaltySeconds = data.penalties.reduce((total, penalty) => total + penalty.seconds, 0)

    // Calculate elapsed time based on entered time and penalties
    let elapsedTime: number | null = null
    if (data.status === "Finished") {
      // Base time from input
      elapsedTime = timeToMilliseconds(data.hours, data.minutes, data.seconds)

      // Add penalty time
      if (totalPenaltySeconds > 0) {
        elapsedTime += totalPenaltySeconds * 1000
      }
    }

    if (mode === "add") {
      // Create a new racer
      const newRacer: TimingRacer = {
        id: 0, // Will be set by the parent component
        trackId: "", // Will be set by the parent component
        number: data.number,
        name: data.name,
        team: data.team || "",
        category: data.category,
        elapsedTime: elapsedTime,
        status: data.status,
        penalties: data.penalties || [],
      }
      onAdd(newRacer)
    } else if (mode === "edit" && racer) {
      // Update existing racer
      const updatedRacer: TimingRacer = {
        ...racer,
        elapsedTime: elapsedTime,
        status: data.status,
        penalties: data.penalties || [],
      }
      onUpdate(updatedRacer)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Time Record" : "Edit Time Record"}</DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add a new time record for a racer" : "Edit timing information for this racer"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {mode === "edit" ? (
              <Card className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-xl">
                      {racer?.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{racer?.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="px-2 py-0.5">
                          {racer?.category}
                        </Badge>
                        {racer?.team && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {racer.team}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="racerId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Select Racer</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a racer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {racers.map((r) => (
                            <SelectItem key={r.id} value={r.id.toString()}>
                              #{r.number} - {r.name} ({r.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select a racer to record their time</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRacerId && (
                  <Card className="bg-muted/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary font-bold text-xl">
                          {form.getValues("number")}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{form.getValues("name")}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline" className="px-2 py-0.5">
                              {form.getValues("category")}
                            </Badge>
                            {form.getValues("team") && (
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {form.getValues("team")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="Finished">Finished</SelectItem>
                      <SelectItem value="DNF">Did Not Finish</SelectItem>
                      <SelectItem value="DSQ">Disqualified</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchStatus === "Finished" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="h-5 w-5 text-muted-foreground" />
                  <div className="text-base font-medium">Elapsed Time</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col items-center">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="99"
                              className="text-center font-mono text-lg"
                            />
                          </FormControl>
                          <span className="text-xs text-muted-foreground mt-1">Hours</span>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col items-center">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="59"
                              className="text-center font-mono text-lg"
                            />
                          </FormControl>
                          <span className="text-xs text-muted-foreground mt-1">Minutes</span>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seconds"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col items-center">
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              max="59"
                              className="text-center font-mono text-lg"
                            />
                          </FormControl>
                          <span className="text-xs text-muted-foreground mt-1">Seconds</span>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Enter the raw time without penalties. Penalties will be added automatically.
                </div>
              </div>
            )}

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium">Penalties</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPenalty}
                  disabled={watchStatus !== "Finished"}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Penalty
                </Button>
              </div>

              {watchStatus !== "Finished" && (
                <div className="text-center py-4 text-muted-foreground bg-muted/50 rounded-lg border border-dashed">
                  <AlertTriangle className="h-4 w-4 mx-auto mb-2" />
                  Penalties can only be added for finished racers
                </div>
              )}

              {watchStatus === "Finished" && form.watch("penalties").length === 0 ? (
                <div className="text-center py-4 text-muted-foreground bg-muted/50 rounded-lg border border-dashed">
                  No penalties recorded
                </div>
              ) : (
                <div className="space-y-3">
                  {watchStatus === "Finished" &&
                    form.watch("penalties").map((penalty, index) => (
                      <Card key={penalty.id} className="border border-warning/30 bg-warning/10">
                        <CardHeader className="py-2 px-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">Penalty</CardTitle>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePenalty(penalty.id)}
                              className="h-7 w-7 p-0 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2 px-3 grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`penalties.${index}.seconds`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Seconds</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" className="h-8 text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`penalties.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Reason</FormLabel>
                                <FormControl>
                                  <Input {...field} className="h-8 text-sm" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{mode === "add" ? "Add Time Record" : "Update Time"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
