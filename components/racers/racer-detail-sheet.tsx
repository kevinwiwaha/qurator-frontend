"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Save, X, Mail, Phone, Flag, User, Users, Trophy } from "lucide-react"
import type { Racer } from "@/components/racers/racers-list"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RacerDetailSheetProps {
  racer: Racer | null
  onClose: () => void
  onUpdate: (updatedRacer: Racer) => void
}

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  number: z.coerce.number().int().positive(),
  team: z.string(),
  category: z.string(),
  age: z.coerce.number().int().positive(),
  gender: z.string(),
  country: z.string(),
  coDriver: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function RacerDetailSheet({ racer, onClose, onUpdate }: RacerDetailSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      number: 0,
      team: "",
      category: "",
      age: 0,
      gender: "",
      country: "",
      coDriver: "",
      email: "",
      phone: "",
      emergencyContact: "",
      notes: "",
    },
  })

  // Update form values when racer changes
  useEffect(() => {
    if (racer) {
      setIsOpen(true)
      form.reset({
        name: racer.name,
        number: racer.number,
        team: racer.team,
        category: racer.category,
        age: racer.age,
        gender: racer.gender,
        country: racer.country,
        coDriver: racer.coDriver || "",
        email: racer.email || "",
        phone: racer.phone || "",
        emergencyContact: racer.emergencyContact || "",
        notes: racer.notes || "",
      })
    } else {
      setIsOpen(false)
    }
  }, [racer, form])

  const handleClose = () => {
    setIsOpen(false)
    // Small delay to allow animation to complete
    setTimeout(onClose, 300)
  }

  // Update the onSubmit function to include coDriver
  const onSubmit = (data: FormValues) => {
    if (!racer) return

    const updatedRacer: Racer = {
      ...racer,
      name: data.name,
      number: data.number,
      team: data.team,
      category: data.category,
      age: data.age,
      gender: data.gender as "Male" | "Female" | "Other",
      country: data.country,
      coDriver: data.coDriver,
      email: data.email,
      phone: data.phone,
      emergencyContact: data.emergencyContact,
      notes: data.notes,
    }

    onUpdate(updatedRacer)
  }

  if (!racer) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto p-0" side="right">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b sticky top-0 bg-white z-10">
            <div className="flex justify-between items-start mb-4">
              <SheetTitle className="text-2xl">Racer Profile</SheetTitle>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-9 w-9">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SheetDescription>View and edit racer information</SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={racer.avatar} />
                <AvatarFallback className="text-2xl">
                  {racer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4">
                <h3 className="text-xl font-bold">{racer.name}</h3>
                <div className="flex items-center text-muted-foreground">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span>
                    {racer.wins} wins in {racer.totalRaces} races
                  </span>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Full Name</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Racer Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="h-12 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Team</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                            <Input {...field} className="h-12 text-base" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coDriver"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Co-Driver</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 text-base" placeholder="Co-driver name (if applicable)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Age</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" className="h-12 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Category</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pro">Pro</SelectItem>
                            <SelectItem value="Amateur">Amateur</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Gender</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-12 text-base">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Country</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Flag className="mr-2 h-5 w-5 text-muted-foreground" />
                            <Input {...field} className="h-12 text-base" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Phone</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Emergency Contact</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-12 text-base" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          placeholder="Add any additional notes about this racer"
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
