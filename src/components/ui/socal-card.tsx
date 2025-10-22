import * as React from "react"

import { cn } from "@/lib/utils"

const SoCalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 text-card-foreground shadow-xl",
      className
    )}
    {...props}
  />
))
SoCalCard.displayName = "SoCalCard"

const SoCalCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
SoCalCardHeader.displayName = "SoCalCardHeader"

const SoCalCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-bold text-2xl leading-none tracking-tight bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
))
SoCalCardTitle.displayName = "SoCalCardTitle"

const SoCalCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SoCalCardDescription.displayName = "SoCalCardDescription"

const SoCalCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
SoCalCardContent.displayName = "SoCalCardContent"

const SoCalCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
SoCalCardFooter.displayName = "SoCalCardFooter"

const GTACard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "mission" | "location" | "premium" }
>(({ className, variant = "location", ...props }, ref) => {
  const variantStyles = {
    mission: "border-4 border-yellow-400 bg-gradient-to-br from-yellow-100 to-orange-100 shadow-2xl",
    location: "border-4 border-blue-400 bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl",
    premium: "border-4 border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 shadow-2xl"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-4 shadow-2xl transform transition-all hover:scale-105",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
})
GTACard.displayName = "GTACard"

export { SoCalCard, SoCalCardHeader, SoCalCardFooter, SoCalCardTitle, SoCalCardDescription, SoCalCardContent, GTACard }