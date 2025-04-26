"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg transition-all duration-300 max-w-md",
  {
    variants: {
      variant: {
        info: "bg-blue-50 text-blue-800 border border-blue-200",
        success: "bg-green-50 text-green-800 border border-green-200",
        warning: "bg-amber-50 text-amber-800 border border-amber-200",
        error: "bg-red-50 text-red-800 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
)

export interface AlertMessageProps extends VariantProps<typeof alertVariants> {
  message: string
  description?: string
  duration?: number
  onClose?: () => void
}

export function AlertMessage({ message, description, variant, duration = 5000, onClose }: AlertMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300)

    return () => clearTimeout(timer)
  }

  if (!isVisible) return null

  const IconComponent = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  }[variant || "info"]

  const iconColors = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
  }[variant || "info"]

  return (
    <div
      className={cn(alertVariants({ variant }), isExiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0")}
      role="alert"
    >
      <div className={cn("flex-shrink-0", iconColors)}>
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-base">{message}</h3>
        {description && <p className="text-sm opacity-80 mt-1">{description}</p>}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors"
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
