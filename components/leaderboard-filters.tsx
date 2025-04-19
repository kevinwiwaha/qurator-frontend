"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, RefreshCw } from "lucide-react"

export function LeaderboardFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [track, setTrack] = useState("all")

  return (
    <Card className="mb-4 shadow-sm">
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search racer or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-9 text-sm w-[140px]">
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

          <div className="flex items-center gap-2">
            <Select value={track} onValueChange={setTrack}>
              <SelectTrigger className="h-9 text-sm w-[140px]">
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

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-9">
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button size="sm" className="h-9">
              <Filter className="mr-1 h-3.5 w-3.5" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
