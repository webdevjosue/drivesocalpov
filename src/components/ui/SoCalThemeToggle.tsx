import * as React from "react"
import { Moon, Sun, MapPin, Car } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function SoCalThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative inline-flex h-9 w-14 items-center rounded-full border-2 border-gray-300 bg-gray-100">
        <div className="h-5 w-5 rounded-full bg-gray-300 absolute left-1 transition-all" />
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={cn(
          "relative inline-flex h-10 w-16 items-center rounded-full border-2 border-orange-300 bg-gradient-to-r from-orange-100 to-yellow-100 transition-all hover:shadow-lg hover:scale-105",
          "dark:border-orange-600 dark:from-orange-900 dark:to-yellow-900 dark:hover:border-orange-500"
        )}
        aria-label="Toggle theme"
      >
        {/* SoCal Sun Icon */}
        <Sun
          className={cn(
            "absolute left-1 h-6 w-6 text-orange-500 transition-all",
            theme === "dark" && "opacity-0 scale-0"
          )}
        />

        {/* GTA 5 Moon/Car Icon */}
        <Moon
          className={cn(
            "absolute right-1 h-6 w-6 text-orange-600 transition-all",
            theme === "light" && "opacity-0 scale-0"
          )}
        />

        {/* Toggle indicator */}
        <div
          className={cn(
            "absolute h-7 w-7 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 shadow-md transition-all",
            theme === "dark" ? "translate-x-7" : "translate-x-0",
            "dark:from-orange-500 dark:to-yellow-500 dark:shadow-lg"
          )}
        />
      </button>

      {/* Theme labels */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs font-medium">
        <MapPin className="h-3 w-3 text-orange-500" />
        <span className="text-orange-600 dark:text-orange-400">SoCal</span>
        <Car className="h-3 w-3 text-orange-500" />
      </div>
    </div>
  )
}