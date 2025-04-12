"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Trophy, Users, Timer, Calendar, TrendingUp, BarChartIcon, LineChartIcon } from "lucide-react"

// Sample data for charts
const participationData = [
  { name: "Jan", count: 45 },
  { name: "Feb", count: 52 },
  { name: "Mar", count: 68 },
  { name: "Apr", count: 82 },
  { name: "May", count: 95 },
  { name: "Jun", count: 110 },
  { name: "Jul", count: 125 },
  { name: "Aug", count: 132 },
  { name: "Sep", count: 120 },
  { name: "Oct", count: 105 },
  { name: "Nov", count: 88 },
  { name: "Dec", count: 72 },
]

const categoryData = [
  { name: "Pro", value: 35 },
  { name: "Amateur", value: 45 },
  { name: "Junior", value: 15 },
  { name: "Senior", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const performanceData = [
  { name: "Race 1", avgTime: 85, fastestTime: 72, slowestTime: 110 },
  { name: "Race 2", avgTime: 82, fastestTime: 68, slowestTime: 105 },
  { name: "Race 3", avgTime: 78, fastestTime: 65, slowestTime: 98 },
  { name: "Race 4", avgTime: 80, fastestTime: 67, slowestTime: 102 },
  { name: "Race 5", avgTime: 75, fastestTime: 62, slowestTime: 95 },
]

const topRacers = [
  { id: 1, name: "John Smith", races: 24, wins: 5, podiums: 12, points: 187 },
  { id: 2, name: "Emma Johnson", races: 22, wins: 4, podiums: 10, points: 165 },
  { id: 3, name: "Michael Brown", races: 25, wins: 3, podiums: 11, points: 158 },
  { id: 4, name: "Sarah Davis", races: 20, wins: 3, podiums: 8, points: 142 },
  { id: 5, name: "David Wilson", races: 23, wins: 2, podiums: 9, points: 136 },
]

export function StatsDashboard() {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Racers</p>
                <h3 className="text-3xl font-bold mt-1">248</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                +12%
              </Badge>
              <span className="ml-2 text-muted-foreground">vs last season</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Events</p>
                <h3 className="text-3xl font-bold mt-1">32</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                +8%
              </Badge>
              <span className="ml-2 text-muted-foreground">vs last season</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Avg. Finish Time</p>
                <h3 className="text-3xl font-bold mt-1">1:24:36</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Timer className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                -3.5%
              </Badge>
              <span className="ml-2 text-muted-foreground">faster than last season</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Completion Rate</p>
                <h3 className="text-3xl font-bold mt-1">92.4%</h3>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge variant="outline" className="text-green-600 bg-green-50">
                +2.1%
              </Badge>
              <span className="ml-2 text-muted-foreground">vs last season</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Participation Trends</CardTitle>
                <CardDescription>Monthly racer participation over the past year</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  <BarChartIcon className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  Line
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={participationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Participants" fill="#3b82f6" />
                  </BarChart>
                ) : (
                  <LineChart data={participationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Participants" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Racer Categories</CardTitle>
            <CardDescription>Distribution of racers by category</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
            <CardDescription>Race time statistics across recent events</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="fastestTime"
                    name="Fastest Time"
                    stroke="#22c55e"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="avgTime" name="Average Time" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="slowestTime" name="Slowest Time" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Racers with the most wins and podium finishes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 text-left font-medium">Racer</th>
                    <th className="py-3 px-4 text-center font-medium">Races</th>
                    <th className="py-3 px-4 text-center font-medium">Wins</th>
                    <th className="py-3 px-4 text-center font-medium">Podiums</th>
                    <th className="py-3 px-4 text-center font-medium">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {topRacers.map((racer, index) => (
                    <tr key={racer.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs mr-2">
                            {index + 1}
                          </div>
                          <span className="font-medium">{racer.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{racer.races}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                          {racer.wins}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{racer.podiums}</td>
                      <td className="py-3 px-4 text-center font-bold">{racer.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button variant="outline" className="w-full">
              View All Rankings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
