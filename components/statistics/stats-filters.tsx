"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Calendar, Filter } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StatsFilters() {
  const [season, setSeason] = useState("2023")
  const [event, setEvent] = useState("all")

  return (
    <Card className="mb-6 shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center space-x-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="racers">Racers</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-500 h-5 w-5" />
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="h-10 w-32">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-500 h-5 w-5" />
              <Select value={event} onValueChange={setEvent}>
                <SelectTrigger className="h-10 w-48">
                  <SelectValue placeholder="Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="mountain">Mountain Challenge</SelectItem>
                  <SelectItem value="city">City Sprint Series</SelectItem>
                  <SelectItem value="desert">Desert Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" className="h-10">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button variant="outline" size="sm" className="h-10">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
