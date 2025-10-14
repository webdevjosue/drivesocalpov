/**
 * Map Container Component - Drive SoCal POV
 * Main map container with performance monitoring and mobile optimization
 */

'use client'

import React from 'react'
import { MapProvider } from './MapProvider'
import { useMapStore } from '@/store/mapStore'
import { useMobilePerformance } from '@/hooks/useMobilePerformance'

interface MapContainerProps {
  className?: string
  children?: React.ReactNode
  showControls?: boolean
  enablePerformanceMode?: boolean
}

export function MapContainer({
  className = '',
  children,
  showControls = true,
  enablePerformanceMode: enablePerfMode = true,
}: MapContainerProps) {
  const { isLowEndDevice, shouldReduceAnimations, shouldReduceQuality } = useMobilePerformance()
  const { error, isLoading, performanceMode } = useMapStore()

  // Handle map load
  const handleMapLoad = React.useCallback((map: any) => {
    console.log('Map loaded successfully:', {
      bounds: map.getBounds(),
      center: map.getCenter(),
      zoom: map.getZoom(),
    })

    // Add performance monitoring
    if (process.env.NODE_ENV === 'development') {
      ;(window as any).__debugMap = map
    }
  }, [])

  // Handle map error
  const handleMapError = React.useCallback((error: any) => {
    console.error('Map error:', error)
  }, [])

  // Performance mode indicator (development only)
  const PerformanceIndicator = () => {
    if (process.env.NODE_ENV !== 'development') return null

    return (
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded z-50">
        <div>Mode: {performanceMode ? 'Performance' : 'Normal'}</div>
        <div>Low-end: {isLowEndDevice ? 'Yes' : 'No'}</div>
        <div>Reduce Anim: {shouldReduceAnimations ? 'Yes' : 'No'}</div>
        <div>Reduce Quality: {shouldReduceQuality ? 'Yes' : 'No'}</div>
      </div>
    )
  }

  // Loading overlay
  const LoadingOverlay = () => {
    if (!isLoading) return null

    return (
      <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  // Error overlay
  const ErrorOverlay = () => {
    if (!error) return null

    return (
      <div className="absolute inset-0 bg-red-50 bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center p-4">
          <div className="text-red-600 text-lg font-semibold mb-2">Map Error</div>
          <p className="text-gray-600 text-sm mb-4">
            Unable to load the map. Please check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <MapProvider
        onMapLoad={handleMapLoad}
        onMapError={handleMapError}
        enablePerformanceMode={enablePerfMode}
      >
        {/* Map children will go here */}
        {children}

        {/* Controls overlay */}
        {showControls && (
          <div className="absolute top-4 right-4 z-10">
            {/* Controls will be added in next steps */}
          </div>
        )}

        {/* Performance Indicator */}
        <PerformanceIndicator />

        {/* Loading State */}
        <LoadingOverlay />

        {/* Error State */}
        <ErrorOverlay />
      </MapProvider>
    </div>
  )
}

export default MapContainer