"use client"

import type React from "react"
import { Trophy, Users, Clock, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AppShellProps {
  children: React.ReactNode
  activePage?: "leaderboard" | "racers" | "events" | "timing" | "settings"
}

export function AppShell({ children, activePage = "leaderboard" }: AppShellProps) {
  const isMobile = useMobile()

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top navigation bar - not fixed anymore */}
      <div className="bg-primary px-4 py-3 flex items-center justify-between w-full shadow-md">
        <div className="w-10"></div> {/* Spacer to balance the avatar */}
        <div className="flex items-center justify-center">
          <NavItem href="/" icon={Trophy} label="Leaderboard" active={activePage === "leaderboard"} />
          <NavItem href="/racers" icon={Users} label="Racers" active={activePage === "racers"} />
          <NavItem href="/events" icon={Flag} label="Events" active={activePage === "events"} />
          <NavItem href="/timing" icon={Clock} label="Timing" active={activePage === "timing"} />
        </div>
        <div className="flex items-center">
          <Link href="/settings">
            <Avatar className="h-10 w-10 bg-white border-2 border-primary text-primary cursor-pointer hover:ring-2 hover:ring-primary transition-all shadow-md">
              <AvatarFallback className="font-medium text-sm">JD</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-auto bg-background w-full">{children}</div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
}

function NavItem({ href, icon: Icon, label, active }: NavItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center justify-center transition-all duration-200 ease-in-out mx-4",
          active ? "bg-white text-primary rounded-full px-4 py-2" : "text-white px-2 py-2",
        )}
      >
        <Icon className={cn("h-5 w-5", active ? "mr-2" : "")} />
        {active && <span className="font-medium text-sm whitespace-nowrap">{label}</span>}
      </div>
    </Link>
  )
}
