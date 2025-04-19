"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, Trophy, Users, Settings, Menu, X, Clock, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"

// Update the AppShellProps interface to remove the schedule and statistics options
interface AppShellProps {
  children: React.ReactNode
  activePage?: "leaderboard" | "racers" | "events" | "timing" | "settings"
}

export function AppShell({ children, activePage = "leaderboard" }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Update the getPageTitle function to remove the schedule and statistics cases
  const getPageTitle = () => {
    switch (activePage) {
      case "leaderboard":
        return "Leaderboard"
      case "racers":
        return "Racers"
      case "events":
        return "Events"
      case "timing":
        return "Timing"
      case "settings":
        return "Settings"
      default:
        return "Race Manager"
    }
  }

  return (
    <div className="flex h-screen bg-background-subtle overflow-hidden">
      {/* Mobile sidebar - only shown when toggled */}
      {isMobile && (
        <div
          className={cn(
            "bg-card shadow-md z-30 transition-all duration-300 ease-in-out",
            sidebarOpen ? "fixed inset-y-0 left-0 w-64" : "fixed inset-y-0 -left-64 w-64",
          )}
        >
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                RM
              </div>
              <div className="mt-2 font-semibold text-lg">Race Manager</div>
            </div>

            {/* Remove the schedule and statistics links from the mobile sidebar */}
            <nav className="flex-1 p-4 space-y-2">
              <Link href="/">
                <SidebarItem icon={Trophy} label="Leaderboard" active={activePage === "leaderboard"} />
              </Link>
              <Link href="/racers">
                <SidebarItem icon={Users} label="Racers" active={activePage === "racers"} />
              </Link>
              <Link href="/events">
                <SidebarItem icon={Flag} label="Events" active={activePage === "events"} />
              </Link>
              <Link href="/timing">
                <SidebarItem icon={Clock} label="Timing" active={activePage === "timing"} />
              </Link>
            </nav>

            <div className="p-4 border-t mt-auto">
              <Link href="/settings">
                <SidebarItem icon={Settings} label="Settings" active={activePage === "settings"} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar - fixed width, not collapsible */}
      {!isMobile && (
        <div className="bg-card shadow-md z-30 w-24 flex-shrink-0 border-r">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                RM
              </div>
              <div className="mt-2 text-xs font-medium text-center">Race Manager</div>
            </div>

            {/* Remove the schedule and statistics links from the desktop sidebar */}
            <nav className="flex-1 p-4 flex flex-col items-center space-y-8">
              <Link href="/" className="w-full flex flex-col items-center">
                <SidebarItemVertical icon={Trophy} label="Leaderboard" active={activePage === "leaderboard"} />
              </Link>
              <Link href="/racers" className="w-full flex flex-col items-center">
                <SidebarItemVertical icon={Users} label="Racers" active={activePage === "racers"} />
              </Link>
              <Link href="/events" className="w-full flex flex-col items-center">
                <SidebarItemVertical icon={Flag} label="Events" active={activePage === "events"} />
              </Link>
              <Link href="/timing" className="w-full flex flex-col items-center">
                <SidebarItemVertical icon={Clock} label="Timing" active={activePage === "timing"} />
              </Link>
            </nav>

            <div className="p-4 border-t mt-auto flex justify-center">
              <Link href="/settings" className="w-full flex flex-col items-center">
                <SidebarItemVertical icon={Settings} label="Settings" active={activePage === "settings"} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation bar */}
        <header className="bg-card shadow-sm z-20 border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
                  <Menu className="h-6 w-6" />
                </Button>
              )}
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
                <div className="ml-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Mountain Challenge 2023
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Events
              </Button>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span className="font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  active?: boolean
}

function SidebarItem({ icon: Icon, label, active }: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
      )}
    >
      <Icon className="h-6 w-6 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </div>
  )
}

interface SidebarItemVerticalProps {
  icon: React.ElementType
  label: string
  active?: boolean
}

function SidebarItemVertical({ icon: Icon, label, active }: SidebarItemVerticalProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors w-full",
        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
      )}
    >
      <Icon className="h-6 w-6 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}
