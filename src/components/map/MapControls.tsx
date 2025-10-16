/**
 * Map Controls Component
 * Enhanced zoom controls with accessibility features and better visibility
 */

'use client'

import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useMap } from '@vis.gl/react-maplibre'
import dynamic from 'next/dynamic'

// Dynamic imports for better bundle splitting
const ZoomIn = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ZoomIn })), {
  loading: () => <div className="w-5 h-5 animate-pulse bg-gray-300 rounded" />,
  ssr: false
})

const ZoomOut = dynamic(() => import('lucide-react').then(mod => ({ default: mod.ZoomOut })), {
  loading: () => <div className="w-5 h-5 animate-pulse bg-gray-300 rounded" />,
  ssr: false
})

interface MapControlsProps {
  className?: string
}

export default function MapControls({ className = '' }: MapControlsProps) {
  const map = useMap()
  const [currentZoom, setCurrentZoom] = useState<number>(10)

  // Update zoom level when map changes
  useEffect(() => {
    if (!map.current) return

    const currentMap = map.current
    const handleZoom = () => {
      setCurrentZoom(currentMap?.getZoom() || 10)
    }

    currentMap.on('zoom', handleZoom)

    // Initial values
    handleZoom()

    return () => {
      currentMap?.off('zoom', handleZoom)
    }
  }, [map])

  // Enhanced zoom handlers with accessibility announcements
  const handleZoomIn = useCallback(() => {
    if (map.current) {
      map.current.zoomIn()
      const newZoom = Math.round((map.current.getZoom() + 1) * 10) / 10
      announceToScreenReader(`Zoomed in to level ${newZoom}`)
    }
  }, [map])

  const handleZoomOut = useCallback(() => {
    if (map.current) {
      map.current.zoomOut()
      const newZoom = Math.round((map.current.getZoom() - 1) * 10) / 10
      announceToScreenReader(`Zoomed out to level ${newZoom}`)
    }
  }, [map])

  // Screen reader announcement helper
  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'visually-hidden'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Keyboard navigation support
  const handleKeyDown = useCallback((event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }, [])

  // Memoize button states to prevent unnecessary re-renders
  const zoomInDisabled = useMemo(() => currentZoom >= 18, [currentZoom])
  const zoomOutDisabled = useMemo(() => currentZoom <= 2, [currentZoom])

  return (
    <>
      {/* Screen reader announcements for map state */}
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        Current zoom level: {Math.round(currentZoom * 10) / 10}
      </div>

      <div className={`absolute top-4 right-4 z-10 ${className}`}>
        {/* Enhanced Zoom Controls */}
        <div
          className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1"
          role="group"
          aria-label="Map zoom controls"
        >
          <button
            onClick={handleZoomIn}
            onKeyDown={(e) => handleKeyDown(e, handleZoomIn)}
            className="flex items-center justify-center w-12 h-12 hover:bg-blue-50 active:bg-blue-100 transition-all duration-150 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom in"
            disabled={zoomInDisabled}
            title="Zoom in"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" strokeWidth={2.5} />
          </button>

          <button
            onClick={handleZoomOut}
            onKeyDown={(e) => handleKeyDown(e, handleZoomOut)}
            className="flex items-center justify-center w-12 h-12 hover:bg-blue-50 active:bg-blue-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Zoom out"
            disabled={zoomOutDisabled}
            title="Zoom out"
          >
            <ZoomOut className="h-5 w-5 text-gray-700" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </>
  )
}