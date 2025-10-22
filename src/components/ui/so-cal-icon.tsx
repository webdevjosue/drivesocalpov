"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SoCalIconProps extends React.HTMLAttributes<HTMLDivElement> {
  category: 'beach' | 'park' | 'attraction' | 'museum' | 'hiking' | 'food' | 'shopping' | 'entertainment' | 'premium'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'socal' | 'sunset' | 'gtav'
  alt?: string
}

const SoCalIcon = React.forwardRef<HTMLDivElement, SoCalIconProps>(
  ({ className, category, size = 'md', variant = 'default', alt, ...props }, ref) => {
    const sizeMap = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    }

    const variantStyles = {
      default: 'text-current',
      socal: 'text-socal-ocean-600 dark:text-socal-ocean-400',
      sunset: 'text-socal-sunset-600 dark:text-socal-sunset-400',
      gtav: 'text-gtav-gold-600 dark:text-gtav-gold-400'
    }

    const iconPath = `/icons/soCal-theme/${category}.svg`
    const ariaLabel = alt || `${category} icon placeholder`

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          sizeMap[size],
          variantStyles[variant],
          className
        )}
        role="img"
        aria-label={ariaLabel}
        {...props}
      >
        <img
          src={iconPath}
          alt={ariaLabel}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    )
  }
)

SoCalIcon.displayName = "SoCalIcon"

export { SoCalIcon, type SoCalIconProps }