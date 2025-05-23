import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AlertProvider } from "@/context/alert-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Race Score Management System",
  description: "A web app for managing race scores",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AlertProvider>
            <div className="min-h-screen bg-gray-100">
              {children}
              <Toaster />
            </div>
          </AlertProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
