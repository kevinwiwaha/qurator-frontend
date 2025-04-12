"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Save, X, Calendar, MapPin, Users, Globe, Mail, Phone, User } from "lucide-react"
import type { Event } from "@/components/events/events-list"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventDetailSheetProps {
  event: Event | null
  onClose: () => void
  onUpdate: (updatedEvent: Event) => void
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

export function EventDetailSheet({ event, onClose, onUpdate }: EventDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

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

  if (!event) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-0" side="right">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex justify-between items-start mb-4">
              <SheetTitle className="text-2xl">Event Details</SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-9 w-9">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SheetDescription>View and edit event information</SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
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
                        <FormLabel className="text-base">Participants</FormLabel>
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
