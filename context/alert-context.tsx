"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import { AlertMessage, type AlertMessageProps } from "@/components/ui/alert-message"

type AlertType = "info" | "success" | "warning" | "error"

interface Alert extends Omit<AlertMessageProps, "onClose"> {
  id: string
  variant: AlertType
}

interface AlertContextType {
  alerts: Alert[]
  showAlert: (
    message: string,
    options?: {
      type?: AlertType
      description?: string
      duration?: number
    },
  ) => void
  removeAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const showAlert = useCallback(
    (
      message: string,
      options?: {
        type?: AlertType
        description?: string
        duration?: number
      },
    ) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newAlert: Alert = {
        id,
        message,
        description: options?.description,
        variant: options?.type || "info",
        duration: options?.duration || 5000,
      }

      setAlerts((prev) => [...prev, newAlert])
    },
    [],
  )

  return (
    <AlertContext.Provider value={{ alerts, showAlert, removeAlert }}>
      {children}
      {alerts.map((alert) => (
        <AlertMessage
          key={alert.id}
          message={alert.message}
          description={alert.description}
          variant={alert.variant}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}
