"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Mail, User, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Administrator",
  avatar: "",
  initials: "JD",
}

export function SettingsContent() {
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)

    // Simulate logout process
    setTimeout(() => {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      setIsLoggingOut(false)
      // In a real app, you would redirect to login page or clear auth state
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your account information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
              <AvatarFallback className="text-xl">{mockUser.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{mockUser.name}</h2>
              <p className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-4 w-4" />
                {mockUser.role}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{mockUser.name}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h3>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{mockUser.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">Last login: Today at 9:42 AM</div>
          <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">Race Score Management System • Version 1.0.0</div>
    </div>
  )
}
