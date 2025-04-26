"use client"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAlert } from "@/context/alert-context"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"

export default function AlertsPage() {
  const { showAlert } = useAlert()

  const handleShowInfoAlert = () => {
    showAlert("Information Message", {
      type: "info",
      description: "This is an informational alert that provides neutral information to the user.",
    })
  }

  const handleShowSuccessAlert = () => {
    showAlert("Success Message", {
      type: "success",
      description: "The operation was completed successfully.",
    })
  }

  const handleShowWarningAlert = () => {
    showAlert("Warning Message", {
      type: "warning",
      description: "This action might have some consequences. Please proceed with caution.",
    })
  }

  const handleShowErrorAlert = () => {
    showAlert("Error Message", {
      type: "error",
      description: "An error occurred while processing your request. Please try again.",
    })
  }

  const handleShowLongDurationAlert = () => {
    showAlert("Long Duration Alert", {
      type: "info",
      description: "This alert will stay visible for 10 seconds.",
      duration: 10000,
    })
  }

  const handleShowShortAlert = () => {
    showAlert("Quick Alert", {
      type: "success",
      duration: 2000,
    })
  }

  return (
    <AppShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Alert Messages</h1>
        <p className="text-muted-foreground mb-6">Click the buttons below to see different types of alert messages.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Alert Types</CardTitle>
              <CardDescription>Different types of alerts for various scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleShowInfoAlert}
                variant="outline"
                className="w-full flex items-center justify-start gap-2"
              >
                <Info className="h-4 w-4 text-blue-500" />
                Show Info Alert
              </Button>
              <Button
                onClick={handleShowSuccessAlert}
                variant="outline"
                className="w-full flex items-center justify-start gap-2"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                Show Success Alert
              </Button>
              <Button
                onClick={handleShowWarningAlert}
                variant="outline"
                className="w-full flex items-center justify-start gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Show Warning Alert
              </Button>
              <Button
                onClick={handleShowErrorAlert}
                variant="outline"
                className="w-full flex items-center justify-start gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                Show Error Alert
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Duration</CardTitle>
              <CardDescription>Control how long alerts are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleShowShortAlert}
                variant="outline"
                className="w-full flex items-center justify-start gap-2"
              >
                Show Quick Alert (2s)
              </Button>
              <Button
                onClick={handleShowLongDurationAlert}
                variant="outline"
                className="w-full flex items-center justify-start gap-2"
              >
                Show Long Duration Alert (10s)
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Multiple Alerts</CardTitle>
            <CardDescription>Trigger multiple alerts at once</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                handleShowInfoAlert()
                setTimeout(handleShowSuccessAlert, 300)
                setTimeout(handleShowWarningAlert, 600)
                setTimeout(handleShowErrorAlert, 900)
              }}
              className="w-full"
            >
              Show All Alert Types
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
