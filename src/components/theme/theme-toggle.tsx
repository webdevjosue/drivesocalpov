"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative overflow-hidden group"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>

      {/* GTA V inspired shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gtav-gold-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
    </Button>
  )
}

export function ThemeToggleExpanded() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Sun className="h-4 w-4" />
        <span className="hidden sm:inline">Theme</span>
      </Button>
    )
  }

  const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Monitor },
  ]

  return (
    <div className="flex gap-1 p-1 bg-surface rounded-lg border border-border">
      {themes.map(({ name, value, icon: Icon }) => (
        <Button
          key={value}
          variant={theme === value ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme(value)}
          className={`
            gap-2 transition-all duration-200
            ${theme === value
              ? "bg-socal-ocean-500 text-white hover:bg-socal-ocean-600 shadow-md"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-alt"
            }
          `}
        >
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{name}</span>
        </Button>
      ))}
    </div>
  )
}