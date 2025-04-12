"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, RefreshCw, SlidersHorizontal } from "lucide-react"

export function LeaderboardFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [track, setTrack] = useState("all")

  return (
    <Card className="mb-6 shadow-md">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              placeholder="Search racer or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <div className="flex items-center space-x-3">
            <SlidersHorizontal className="text-gray-500 h-5 w-5" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Amateur">Amateur</SelectItem>
                <SelectItem value="Elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-3">
            <SlidersHorizontal className="text-gray-500 h-5 w-5" />
            <Select value={track} onValueChange={setTrack}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Track" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                <SelectItem value="track-1">Mountain Loop</SelectItem>
                <SelectItem value="track-2">Forest Trail</SelectItem>
                <SelectItem value="track-3">City Circuit</SelectItem>
                <SelectItem value="track-4">Extreme Ridge</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end md:col-span-3">
            <Button variant="outline" className="mr-3 h-12 px-5 text-base">
              <RefreshCw className="mr-2 h-5 w-5" />
              Reset
            </Button>
            <Button className="h-12 px-6 text-base">
              <Filter className="mr-2 h-5 w-5" />
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
