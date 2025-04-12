"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Save, X, Calendar, Clock, MapPin } from "lucide-react"
import type { ScheduleItem } from "@/components/schedule/schedule-calendar"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScheduleDetailSheetProps {
  item: ScheduleItem | null
  onClose: () => void
  onUpdate: (updatedItem: ScheduleItem) => void
}

// Form schema for validation
const formSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  type: z.string(),
  description: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function ScheduleDetailSheet({ item, onClose, onUpdate }: ScheduleDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "",
      description: "",
      notes: "",
    },
  })

  // Update form values when item changes
  useEffect(() => {
    if (item) {
      setIsOpen(true)
      form.reset({
        title: item.title,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        location: item.location,
        type: item.type,
        description: item.description || "",
        notes: item.notes || "",
      })
    } else {
      setIsOpen(false)
    }
  }, [item, form])

  const handleClose = () => {
    setIsOpen(false)
    // Small delay to allow animation to complete
    setTimeout(onClose, 300)
  }

  const onSubmit = (data: FormValues) => {
    if (!item) return

    const updatedItem: ScheduleItem = {
      ...item,
      title: data.title,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      type: data.type as "Race" | "Practice" | "Meeting" | "Registration" | "Award Ceremony",
      description: data.description,
      notes: data.notes,
    }

    onUpdate(updatedItem)
  }

  if (!item) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-0" side="right">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex justify-between items-start mb-4">
              <SheetTitle className="text-2xl">Schedule Details</SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-9 w-9">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SheetDescription>View and edit schedule information</SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Event Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Race">Race</SelectItem>
                          <SelectItem value="Practice">Practice</SelectItem>
                          <SelectItem value="Meeting">Meeting</SelectItem>
                          <SelectItem value="Registration">Registration</SelectItem>
                          <SelectItem value="Award Ceremony">Award Ceremony</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Start Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                            <Input {...field} type="time" className="h-12 text-base" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">End Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                            <Input {...field} type="time" className="h-12 text-base" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

                <Separator />

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

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Additional notes"
                          className="resize-none text-base"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <div className="p-6 border-t mt-auto sticky bottom-0 bg-white">
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
