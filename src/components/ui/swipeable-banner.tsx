/**
 * Swipeable Bottom Banner Component
 * Provides a swipeable bottom banner for ads and promotions
 */

'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronUp, ChevronDown, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SwipeableBannerProps {
  title?: string
  subtitle?: string
  actionText?: string
  onAction?: () => void
  onDismiss?: () => void
  className?: string
}

export default function SwipeableBanner({
  title = "🎮 Premium Features Available!",
  subtitle = "Unlock hidden gems & offline maps",
  actionText = "Learn More",
  onAction,
  onDismiss,
  className
}: SwipeableBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const bannerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches?.[0]) return
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
    setCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches?.[0]) return

    const y = e.touches[0].clientY
    setCurrentY(y)

    const deltaY = startY - y
    const threshold = 50

    if (deltaY > threshold) {
      setIsExpanded(true)
    } else if (deltaY < -threshold) {
      setIsExpanded(false)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleDismiss = () => {
    onDismiss?.()
  }

  return (
    <div
      ref={bannerRef}
      className={cn(
        "relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white transition-all duration-300 ease-out gta-glow",
        isExpanded ? "h-32" : "h-20",
        className
      )}
      style={{
        transform: isDragging ? `translateY(${Math.max(0, startY - currentY) * 0.5}px)` : 'none'
      }}
    >
      {/* Drag Handle */}
      <div
        className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full cursor-pointer"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={toggleExpanded}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-white/60" />
          ) : (
            <ChevronUp className="h-3 w-3 text-white/60" />
          )}
        </div>
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-white/60 hover:text-white hover:bg-white/20"
        onClick={handleDismiss}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Content */}
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-yellow-300" />
          <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none text-xs">
            NEW
          </Badge>
        </div>

        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        {isExpanded && (
          <p className="text-xs text-white/80 mb-3 max-w-xs">
            Get access to exclusive Southern California locations, offline maps, and advanced trip planning features.
          </p>
        )}
        <p className="text-xs text-white/70 mb-3">{subtitle}</p>

        <Button
          size="sm"
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs active:scale-95 transition-all"
          onClick={onAction}
        >
          {actionText}
        </Button>
      </div>

      {/* Swipe Hint Animation */}
      {!isExpanded && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="gta-swipe-indicator">
            <ChevronUp className="h-3 w-3 text-white/60 gta-text-glow" />
          </div>
        </div>
      )}
    </div>
  )
}