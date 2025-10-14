/**
 * Map Container Component - Drive SoCal POV
 * Main map container with performance monitoring and mobile optimization
 */

'use client'

import React from 'react'
import { MapProvider } from './MapProvider'
import MapControls from './MapControls'
import { useMapStore } from '@/store/mapStore'

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
  const { error, isLoading } = useMapStore()

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

  // Performance mode indicator (development only) - Removed for cleaner UI
  // const PerformanceIndicator = () => {
  //   if (process.env.NODE_ENV !== 'development') return null
  //   return (
  //     <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded z-50">
  //       <div>Mode: {performanceMode ? 'Performance' : 'Normal'}</div>
  //       <div>Low-end: {isLowEndDevice ? 'Yes' : 'No'}</div>
  //       <div>Reduce Anim: {shouldReduceAnimations ? 'Yes' : 'No'}</div>
  //       <div>Reduce Quality: {shouldReduceQuality ? 'Yes' : 'No'}</div>
  //     </div>
  //   )
  // }

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
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0, // Critical: Allows flex item to shrink properly
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <MapProvider
        onMapLoad={handleMapLoad}
        onMapError={handleMapError}
        enablePerformanceMode={enablePerfMode}
      >
        {/* Map children will go here */}
        {children}

        {/* Map Controls */}
        {showControls && <MapControls />}

        {/* Performance Indicator - Removed for cleaner UI */}

        {/* Loading State */}
        <LoadingOverlay />

        {/* Error State */}
        <ErrorOverlay />
      </MapProvider>
    </div>
  )
}

export default MapContainer