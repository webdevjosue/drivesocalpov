/**
 * Map Controls Component
 * Basic zoom controls for the mobile map interface
 */

'use client'

import React from 'react'
import { useMap } from '@vis.gl/react-maplibre'
import { ZoomIn, ZoomOut, Compass } from 'lucide-react'

interface MapControlsProps {
  className?: string
}

export default function MapControls({ className = '' }: MapControlsProps) {
  const map = useMap()

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut()
    }
  }

  const handleResetNorth = () => {
    if (map.current) {
      map.current.resetNorth()
    }
  }

  return (
    <div className={`absolute top-4 right-4 z-10 flex flex-col gap-2 ${className}`}>
      {/* Zoom Controls */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="flex items-center justify-center w-10 h-10 hover:bg-accent/50 transition-colors border-b border-border/30"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4 text-foreground" />
        </button>
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center w-10 h-10 hover:bg-accent/50 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Compass Control */}
      <button
        onClick={handleResetNorth}
        className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-border/50 w-10 h-10 flex items-center justify-center hover:bg-accent/50 transition-colors"
        aria-label="Reset north"
      >
        <Compass className="h-4 w-4 text-foreground" />
      </button>
    </div>
  )
}